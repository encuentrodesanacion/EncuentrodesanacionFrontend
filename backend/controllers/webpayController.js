const { WebpayPlus, Options, Environment } = require("transbank-sdk");
const { google } = require("googleapis");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Importación de modelos de la base de datos
const db = require("../models");
const Reserva = db.Reserva;
const TemporalReserva = db.TemporalReserva;
const Terapeuta = db.Terapeuta;
const Transaccion = db.Transaccion;
const Disponibilidad = db.Disponibilidad;

const { Op } = require("sequelize");
const sequelize = db.sequelize;

// Importación de servicios personalizados
const getPurchaseDetails = async (req, res) => {
  // Usamos req.query porque el frontend envía los parámetros en la URL
  const { token, transactionId } = req.query;

  if (!token || !transactionId) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros de token o ID de transacción." });
  }

  try {
    // 1. Buscar la transacción por el ID de la tabla Transacciones (transactionId)
    const transaccion = await db.Transaccion.findOne({
      where: {
        id: transactionId, // Buscamos por el ID interno de la tabla Transacciones
        tokenTransaccion: token, // Y validamos que el token coincida
      },
    });

    if (!transaccion) {
      return res.status(404).json({
        error:
          "Transacción no encontrada o los datos de confirmación no coinciden.",
      });
    }

    // 2. Buscar la reserva asociada a la Transaccion.
    // Usamos el ID interno de la Transacción (transaccion.id) para buscar en la tabla Reservas.
    const reserva = await db.Reserva.findOne({
      where: { transaccionId: transaccion.id }, // <--- Usamos transaccionId de la reserva
    });

    // Si tu relación es por buyOrder, usarías:
    // where: { buyOrder: transaccion.buyOrder }

    if (!reserva) {
      return res
        .status(404)
        .json({ error: "Reserva asociada a la transacción no encontrada." });
    }

    // 3. Construir el objeto PurchaseDetails para el frontend
    const purchaseDetails = {
      servicio: reserva.servicio,
      especialidad: reserva.especialidad,
      nombreTerapeuta: reserva.terapeuta,
      fecha: reserva.fecha,
      hora: reserva.hora,
      sesiones: reserva.sesiones,
      precio: `$${reserva.precio.toLocaleString("es-CL")} CLP`,
      clienteNombre: reserva.nombreCliente,
      clienteTelefono: reserva.telefonoCliente,
      remitenteNombre: reserva.remitenteNombre,
      remitenteTelefono: reserva.remitenteTelefono,
      mensajePersonalizado: reserva.mensajePersonalizado,
    };

    return res.status(200).json(purchaseDetails);
  } catch (error) {
    console.error("Error al buscar detalles de la compra:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener detalles." });
  }
};
const { sendEmail } = require("../services/emailService");

console.log("------------------------------------------");
console.log("INICIALIZANDO WEBPAY CONTROLLER");
console.log(`[CONFIG] Código de Comercio: ${process.env.TBK_COMMERCE_CODE}`);
console.log(`[CONFIG] Entorno de Transbank: ${process.env.TBK_ENV}`);
console.log("------------------------------------------");
const TBK_COMMERCE_CODE_FINAL = process.env.TBK_API_KEY_ID; // Usar TBK_API_KEY_ID como Código de Comercio
const TBK_API_KEY_SECRET_FINAL = process.env.TBK_API_KEY_SECRET; // Usar TBK_API_KEY_SECRET como API Key
const transbankEnvironment =
  process.env.TBK_ENV === "PRODUCCION"
    ? Environment.Production // Directamente el objeto de entorno
    : Environment.Integration; // Directamente el objeto de entorno

console.log(`[CONFIG] Código de Comercio (usado): ${TBK_COMMERCE_CODE_FINAL}`);
console.log(
  `[CONFIG] API Key (usado, sólo mostrar los primeros caracteres): ${
    TBK_API_KEY_SECRET_FINAL
      ? TBK_API_KEY_SECRET_FINAL.substring(0, 5) + "..."
      : "N/A"
  }`
);
console.log(`[CONFIG] Entorno de Transbank (usado): ${process.env.TBK_ENV}`);
console.log(
  `[CONFIG] Ambiente de SDK: ${
    transbankEnvironment ? transbankEnvironment.name : "undefined (Error)"
  }`
); // Logea el nombre del ambiente'Production' o 'Integration'

if (!TBK_COMMERCE_CODE_FINAL || !TBK_API_KEY_SECRET_FINAL) {
  console.error(
    "ERROR: Las credenciales de Transbank (TBK_API_KEY_ID o TBK_API_KEY_SECRET) no están definidas."
  );
  // Considera lanzar un error o detener la aplicación aquí si no pueden operar sin credenciales
  process.exit(1); // Esto es drástico, úsalo con precaución, pero evita problemas mayores.
}

const transaction = new WebpayPlus.Transaction(
  new Options(
    TBK_COMMERCE_CODE_FINAL,
    TBK_API_KEY_SECRET_FINAL,
    transbankEnvironment
  )
);

// --- Funciones auxiliares para Google Calendar ---
async function authorize() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return await auth.getClient();
}

async function crearEventoReserva(fechaInicioISO, fechaFinISO, resumen) {
  try {
    const authClient = await authorize();
    const calendar = google.calendar("v3");

    const evento = {
      summary: resumen,
      start: { dateTime: fechaInicioISO },
      end: { dateTime: fechaFinISO },
    };

    const respuesta = await calendar.events.insert({
      auth: authClient,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: evento,
    });
    console.log("Evento de calendario creado:", respuesta.data);
    return respuesta.data;
  } catch (calendarError) {
    console.error("Error al crear evento en Google Calendar:", calendarError);
    return null;
  }
}
const crearReservaDirecta = async (req, res) => {
  let t; // Para la transacción de Sequelize
  try {
    const {
      servicio,
      especialidad,
      fecha,
      hora,
      precio,
      nombreCliente,
      telefonoCliente,
      terapeuta,
      terapeutaId,
      sesiones,
      cantidadCupos,
    } = req.body;

    console.log("\n--- [BACKEND] INICIO: Solicitud crearReservaDirecta ---");
    console.log("[BACKEND] Datos recibidos:", req.body);
    console.log("[BACKEND] Especialidad de la reserva:", especialidad);

    // 1. Validaciones de Datos Mínimas
    if (
      typeof servicio !== "string" ||
      servicio.trim() === "" ||
      typeof especialidad !== "string" ||
      especialidad.trim() === "" ||
      typeof fecha !== "string" ||
      fecha.trim() === "" ||
      typeof hora !== "string" ||
      hora.trim() === "" ||
      typeof precio !== "number" ||
      isNaN(precio) ||
      precio <= 0 ||
      typeof nombreCliente !== "string" ||
      nombreCliente.trim() === "" ||
      typeof telefonoCliente !== "string" ||
      telefonoCliente.trim() === "" ||
      typeof terapeuta !== "string" ||
      terapeuta.trim() === "" ||
      typeof terapeutaId !== "number" ||
      isNaN(terapeutaId) // terapeutaId debe ser un número
    ) {
      console.error(
        "[ERROR] Datos incompletos o inválidos para crear reserva directa."
      );
      return res.status(400).json({
        mensaje:
          "Faltan datos obligatorios o son inválidos para crear la reserva.",
      });
    }
    // Asegurarse de que cantidadCupos es 1 para los talleres (si es relevante)
    if (cantidadCupos !== 1) {
      console.warn(
        "[WARN] cantidadCupos no es 1 para esta operación de reserva directa. Procesando con el valor recibido."
      );
    }

    t = await sequelize.transaction(); // Iniciar transacción

    // 2. Buscar al Terapeuta
    const terapeutaEncontrado = await Terapeuta.findByPk(terapeutaId, {
      transaction: t,
    });
    if (!terapeutaEncontrado) {
      console.error(`[ERROR] Terapeuta con ID ${terapeutaId} no encontrado.`);
      await t.rollback();
      return res.status(404).json({ mensaje: "Terapeuta no encontrado." });
    }
    const effectiveClientBookingId = uuidv4();

    // 4. Crear la Reserva
    const nuevaReservaInstancia = await Reserva.create(
      // Generar un ID único para esta reserva

      {
        clientBookingId: effectiveClientBookingId,
        servicio: servicio,
        especialidad: especialidad,
        fecha: fecha,
        hora: hora,
        precio: precio,
        nombreCliente: nombreCliente,
        telefonoCliente: telefonoCliente,
        sesiones: sesiones || 1, // Por defecto 1 sesión
        cantidad: cantidadCupos || 1, // Por defecto 1 cupo
        terapeuta: terapeuta,
        terapeutaId: terapeutaId,
        estado: "pendiente",
        // *** NUEVOS CAMPOS A GUARDAR ***
        remitenteNombre: req.body.remitenteNombre, // <-- OK
        remitenteTelefono: req.body.remitenteTelefono, // <-- OK
        mensajePersonalizado: req.body.mensajePersonalizado,
        // *******************************// Nuevo estado para reservas directas (aún no pagadas por Webpay)
        // Puedes añadir aquí un campo 'pagoConfirmado: false' si lo tienes en tu modelo
      },
      { transaction: t }
    );
    console.log(
      `[INFO] Nueva Reserva creada con ID: ${nuevaReservaInstancia.id} (DB ID) y ClientBookingId: ${nuevaReservaInstancia.clientBookingId}`
    );
    await t.commit(); // Confirmar la transacción si todo fue exitoso

    // Enviar de vuelta la reserva creada, incluyendo su ID generado en el backend
    return res.status(201).json({
      mensaje: "Reserva creada exitosamente.",
      reserva: nuevaReservaInstancia.toJSON(), // Devuelve el objeto completo de la reserva
    });
  } catch (error) {
    if (t && t.finished !== "rollback" && t.finished !== "commit") {
      await t.rollback();
    }
    console.error("[ERROR] Error en crearReservaDirecta:", error);
    // Este mensaje ya no debería ocurrir por validación de disponibilidad
    res.status(500).json({
      mensaje: "Error interno del servidor al crear la reserva directa.",
      error: error.message,
    });
  }
};

// --- Controlador para iniciar una transacción con Webpay ---
const crearTransaccionInicial = async (req, res) => {
  console.log(
    "\n--- [WEBPAY] INICIO: Solicitud para crear transacción inicial ---"
  );
  try {
    const { monto, returnUrl, reservas } = req.body;

    if (!monto || !returnUrl || !reservas || reservas.length === 0) {
      return res.status(400).json({
        error:
          "Faltan parámetros: monto, returnUrl o reservas no contiene ítems.",
      });
    }

    // Validate each reservation item from the frontend
    for (const resItem of reservas) {
      if (
        typeof resItem.servicio !== "string" ||
        resItem.servicio.trim() === ""
      ) {
        console.error(
          "Error de validación: Reserva en carrito sin servicio válido.",
          resItem
        );
        return res.status(400).json({
          error:
            "Reserva en carrito contiene un servicio inválido (vacío o no string).",
        });
      }
      if (
        typeof resItem.precio !== "number" ||
        isNaN(resItem.precio) ||
        resItem.precio === null ||
        resItem.precio <= 0
      ) {
        console.error(
          "Error de validación: Reserva en carrito con precio inválido.",
          resItem
        );
        return res.status(400).json({
          error:
            "Reserva en carrito contiene un precio inválido (no número, nulo o <= 0).",
        });
      }
      if (
        typeof resItem.terapeuta !== "string" ||
        resItem.terapeuta.trim() === ""
      ) {
        console.error(
          "Error de validación: Reserva en carrito sin terapeuta válido.",
          resItem
        );
        return res.status(400).json({
          error: "Reserva en carrito contiene un terapeuta inválido.",
        });
      }
      if (
        typeof resItem.especialidad !== "string" ||
        resItem.especialidad.trim() === ""
      ) {
        console.warn(
          "Advertencia de validación: Reserva en carrito sin especialidad válida. Se usará un valor por defecto si el modelo lo permite."
        );
      }
      // Validations for date and time
      if (typeof resItem.fecha !== "string" || resItem.fecha.trim() === "") {
        console.error(
          "Error de validación: Reserva en carrito sin fecha válida.",
          resItem
        );
        return res.status(400).json({
          error:
            "Reserva en carrito contiene una fecha inválida (vacía o no string).",
        });
      }
      if (typeof resItem.hora !== "string" || resItem.hora.trim() === "") {
        console.error(
          "Error de validación: Reserva en carrito sin hora válida.",
          resItem
        );
        return res.status(400).json({
          error:
            "Reserva en carrito contiene una hora inválida (vacía o no string).",
        });
      }
      // Optional: Validate that date and time are parsable
      if (isNaN(new Date(`${resItem.fecha}T${resItem.hora}:00`).getTime())) {
        console.error(
          "Error de validación: Fecha/hora de reserva no es un formato válido.",
          resItem
        );
        return res.status(400).json({
          error: "Formato de fecha u hora de reserva inválido.",
        });
      }
    }

    const buyOrder = `orden_compra_${Date.now()}`;
    const sessionId = `sesion_${Date.now()}`;

    // Create the transaction with Transbank
    const response = await transaction.create(
      buyOrder,
      sessionId,
      monto,
      returnUrl
    );

    console.log(
      `[DEBUG - crearTransaccionInicial] Token Transbank recibido: ${response.token}`
    );
    console.log(`[DEBUG - crearTransaccionInicial] Monto: ${monto}`);
    console.log(`[DEBUG - crearTransaccionInicial] Reservas:`, reservas);

    // Save temporary reservation details to DB
    try {
      const createdTempReserva = await TemporalReserva.create({
        token: response.token,
        reservas: JSON.stringify(reservas), // Store as JSON string
        montoTotal: monto,
        clienteId: reservas[0]?.telefonoCliente || null, // Assuming client ID is first reservation's phone
        buyOrder: buyOrder, // <-- Guardar buyOrder aquí también es útil para referencia
      });
      console.log(
        `[DEBUG - crearTransaccionInicial] TemporalReserva creada en DB con ID: ${createdTempReserva.id} y token: ${createdTempReserva.token}`
      );
    } catch (dbError) {
      console.error(
        "[ERROR - crearTransaccionInicial] Error al guardar TemporalReserva en DB:",
        dbError
      );
      return res.status(500).json({
        mensaje: "Error interno al guardar la reserva temporal.",
        error: dbError.message,
      });
    }

    res.json({
      url: response.url,
      token: response.token,
    });
  } catch (error) {
    console.error("Error al crear transacción inicial Webpay:", error);
    if (error.constructor && error.constructor.name === "TransbankError") {
      console.error("Detalles del error de Transbank:", error.message);
      res.status(500).json({
        mensaje: "Error de configuración o credenciales con Transbank.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        mensaje: "Error al iniciar la transacción.",
        error: error.message,
      });
    }
  }
};

// --- Controlador para confirmar una transacción después de Webpay ---
const confirmarTransaccion = async (req, res) => {
  let tokenWs =
    req.body?.token_ws ||
    req.query.token_ws ||
    req.query.TBK_TOKEN ||
    req.body?.TBK_TOKEN;

  let t;
  let nuevaTransaccion;

  try {
    console.log("==================================================");
    console.log("!!! INICIO DEPURACIÓN CONFIRMACION DE WEBPAY !!!");
    console.log(`[DEBUG] Request Method: ${req.method}`);
    console.log(`[DEBUG] Request URL: ${req.originalUrl}`);
    console.log(`[DEBUG] Request BODY (POST data):`, req.body);
    console.log(`[DEBUG] Request QUERY (GET params):`, req.query);
    console.log(`[DEBUG] Token Intentado Capturar (tokenWs): ${tokenWs}`);
    console.log("==================================================");
    // FIN BLOQUE DE DEPURACIÓN
    if (req.query.TBK_TOKEN && !req.query.token_ws) {
      console.log(
        `[INFO] Se recibió TBK_TOKEN (${tokenWs}) sin token_ws. Asumiendo anulación directa por usuario.`
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${tokenWs}&error=anulacion_directa_usuario`
      );
    }

    if (!tokenWs) {
      // Esto solo se activaría si NINGÚN token (token_ws o TBK_TOKEN) fue recibido.
      console.warn(
        "Falta cualquier tipo de token (token_ws o TBK_TOKEN) en req.body o req.query."
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=missing_token`
      );
    }

    t = await sequelize.transaction();

    console.log("------------------------------------------");
    console.log("Entrando a confirmarTransaccion");
    console.log("req.method:", req.method);
    console.log("req.body:", req.body);
    console.log("req.query:", req.query);
    console.log("Token obtenido:", tokenWs);
    console.log("------------------------------------------");

    const commitResponse = await transaction.commit(tokenWs);
    console.log("Respuesta de commit Transbank:", commitResponse);

    const temporal = await TemporalReserva.findOne({
      where: { token: tokenWs },
      transaction: t,
    });

    if (!temporal) {
      console.warn("TemporalReserva no encontrada para el token:", tokenWs);
      await t.rollback();
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=no_temp_reservations&token=${tokenWs}`
      );
    }

    const montoTotal = temporal.montoTotal;

    nuevaTransaccion = await Transaccion.create(
      {
        tokenTransaccion: tokenWs,
        buyOrder: temporal.buyOrder,
        montoTotal: montoTotal,
        estadoPago:
          commitResponse.status === "AUTHORIZED" ? "aprobado" : "rechazado",
        fechaPago: new Date(),
        clienteId: temporal.clienteId,
      },
      { transaction: t }
    );

    if (commitResponse.status === "AUTHORIZED") {
      if (nuevaTransaccion.estadoPago !== "aprobado") {
        await nuevaTransaccion.update(
          {
            estadoPago: "aprobado",
            fechaPago: new Date(),
          },
          { transaction: t }
        );
        console.log("Transaccion actualizada a APROBADO.");
      }

      let reservasToProcess = temporal.reservas;
      if (typeof reservasToProcess === "string") {
        try {
          reservasToProcess = JSON.parse(reservasToProcess);
        } catch (parseError) {
          console.error(
            "Error al parsear JSON de temporal.reservas:",
            parseError
          );
          await nuevaTransaccion.update(
            {
              estadoPago: "fallo_datos_corruptos",
            },
            { transaction: t }
          );
          throw new Error("Datos de reserva corruptos. " + parseError.message);
        }
      }

      if (!Array.isArray(reservasToProcess) || reservasToProcess.length === 0) {
        console.warn(
          "TemporalReserva encontrada pero 'reservas' no es un array o está vacío después de parsear:",
          reservasToProcess
        );
        await nuevaTransaccion.update(
          { estadoPago: "fallo_sin_reservas" },
          { transaction: t }
        );
        throw new Error("No hay reservas válidas para procesar.");
      }

      console.log(
        "*************************************************************"
      );
      console.log(
        "*** WEB PAY CONTROLLER: Procesando reservas confirmadas ***"
      );
      console.log(
        "*************************************************************"
      );

      const serviciosExcluidosDeDisponibilidad = [
        "Formación de Terapeutas de la Luz",
        "Tratamiento Integral",
        "Talleres Mensuales",
        "Finde de Talleres",
        "Mente y Ser",
        "GiftCard",
      ];
      for (const reserva of reservasToProcess) {
        // *** ESTA DESESTRUCTURACIÓN ESTÁ CORRECTA EN `confirmarTransaccion` ***
        const {
          id, // <-- Asegúrate de desestructurar `id` aquí también, para `existingReserva`
          clientBookingId, // <-- Asegúrate de desestructurar `clientBookingId` aquí también
          servicio,
          especialidad,
          fecha,
          hora,
          precio,
          nombreCliente,
          telefonoCliente,
          terapeuta,
          terapeutaId,
          sesiones,
          cantidad,
          remitenteNombre,
          remitenteTelefono,
          mensajePersonalizado,
        } = reserva;
        console.log(
          `[DEBUG CONFIRM] Procesando reserva: ID=${id}, ClientBookingId=${clientBookingId}, Servicio=${servicio}`
        );
        let errorMessages = [];
        if (
          typeof servicio !== "string" ||
          servicio.trim() === "" ||
          typeof precio !== "number" ||
          isNaN(precio) ||
          precio <= 0 ||
          typeof terapeuta !== "string" ||
          terapeuta.trim() === "" ||
          typeof especialidad !== "string" ||
          especialidad.trim() === "" ||
          typeof fecha !== "string" ||
          fecha.trim() === "" ||
          typeof hora !== "string" ||
          hora.trim() === "" ||
          typeof nombreCliente !== "string" ||
          nombreCliente.trim() === "" ||
          typeof telefonoCliente !== "string" ||
          telefonoCliente.trim() === "" ||
          (sesiones !== undefined &&
            (typeof sesiones !== "number" ||
              isNaN(sesiones) ||
              sesiones <= 0)) ||
          (cantidad !== undefined &&
            (typeof cantidad !== "number" || isNaN(cantidad) || cantidad <= 0))
        ) {
          errorMessages.push("Datos de reserva incompletos o inválidos.");
        }
        if (errorMessages.length > 0) {
          console.error(
            "Error: Datos de reserva inválidos detectados. Detalles:",
            errorMessages,
            "Objeto:",
            reserva
          );
          await nuevaTransaccion.update(
            { estadoPago: "fallo_datos_reserva" },
            { transaction: t }
          );
          throw new Error(
            `Datos de reserva inválidos: ${errorMessages.join(", ")}`
          );
        }

        let terapeutaEncontrado = null;
        const terapeutaNombreNormalizado = reserva.terapeuta.trim();
        if (reserva.terapeutaId) {
          terapeutaEncontrado = await Terapeuta.findByPk(reserva.terapeutaId, {
            transaction: t,
          });
        } else if (terapeutaNombreNormalizado) {
          terapeutaEncontrado = await Terapeuta.findOne({
            where: { nombre: terapeutaNombreNormalizado }, // <-- ¡AÑADE LA CLÁUSULA `where`!
            transaction: t,
          });
        }

        const terapeutaData = terapeutaEncontrado.get({ plain: true });

        let existingReserva = await Reserva.findOne({
          where: {
            clientBookingId: clientBookingId,
            // Solo busca por ID si el frontend proporcionó uno (flujo normal de carrito)
            ...(id && { id: id }),
          },
          transaction: t,
        });

        // --- LÓGICA CONDICIONAL: CREAR O ACTUALIZAR ---

        if (!existingReserva) {
          // 🎯 Caso 1: La reserva NO existe (¡Es un pago directo de Tratamiento/GiftCard!)
          console.log(
            `[INFO CONFIRM] Reserva (ClientBookingId: ${clientBookingId}) NO encontrada. Creando nueva reserva...`
          );

          // Creamos la reserva con todos los datos del temporal, y con estado 'confirmado'
          existingReserva = await Reserva.create(
            {
              transaccionId: nuevaTransaccion.id,
              estado: "confirmado",

              // Copiamos los campos del objeto reservaToProcess
              clientBookingId: clientBookingId,
              terapeuta: terapeuta,
              servicio: servicio,
              especialidad: especialidad,
              fecha: fecha,
              hora: hora,
              precio: precio,
              nombreCliente: nombreCliente,
              telefonoCliente: telefonoCliente,
              sesiones: sesiones || 1,
              cantidad: cantidad || 1,
              terapeutaId: terapeutaId,
              remitenteNombre: remitenteNombre || null,
              remitenteTelefono: remitenteTelefono || null,
              mensajePersonalizado: mensajePersonalizado || null,
            },
            { transaction: t }
          );

          console.log(
            `[INFO CONFIRM] Nueva Reserva creada con éxito en la tabla Reservas. ID: ${existingReserva.id}`
          );
        } else {
          // 🎯 Caso 2: La reserva SÍ existe (flujo normal con hora agendada previamente)
          console.log(
            `[DEBUG CONFIRM] Reserva existente encontrada con ID: ${existingReserva.id}. Actualizando estado.`
          );

          // Solo actualizamos los campos de pago y estado
          await existingReserva.update(
            {
              transaccionId: nuevaTransaccion.id,
              estado: "confirmado",
              // Actualizamos los campos de GiftCard si existen (inofensivo si son null)
              remitenteNombre:
                remitenteNombre || existingReserva.remitenteNombre || null,
              remitenteTelefono:
                remitenteTelefono || existingReserva.remitenteTelefono || null,
              mensajePersonalizado:
                mensajePersonalizado ||
                existingReserva.mensajePersonalizado ||
                null,
            },
            { transaction: t }
          );
          existingReserva = await existingReserva.reload({ transaction: t });
        }
        console.log(
          `[DEBUG CONFIRM] Existencia de reserva en DB: ${
            !!existingReserva ? "Encontrada" : "NO ENCONTRADA"
          }`
        );
        console.log(
          `Reserva ${servicio} (ID: ${existingReserva.id}) actualizada con Transaccion ID: ${nuevaTransaccion.id} y estado 'confirmado'`
        );
        // *** FIN MODIFICACIÓN PARA EXCLUIR FORMACIONES, TALLERES Y TRATAMIENTOS ***

        /// --- Therapist Notification Logic --- (-- ( ---
        try {
          const serviciosExcluidosDeDisponibilidad = [
            "Formación de Terapeutas de la Luz",
            "Tratamiento Integral",
            "Talleres Mensuales",
            "Finde de Talleres",
            "Mente y Ser",
            "GiftCard", // <--- CORRECCIÓN DE DISPONIBILIDAD: AÑADIDO
          ];
          // AHORA SE GESTIONA LA DISPONIBILIDAD (SÓLO SI EL PAGO ES EXITOSO)

          // --- CORRECCIÓN DE DISPONIBILIDAD: CONDICIÓN COMPROBADA ---
          if (
            serviciosExcluidosDeDisponibilidad.includes(servicio) ||
            servicio === "GiftCard"
          ) {
            console.log(
              `[INFO DISPONIBILIDAD] Saltando la lógica de actualización de disponibilidad para el servicio: "${servicio}" (configurado para no modificar horas).`
            );
          } else {
            // Lógica para servicios que SÍ afectan la disponibilidad del terapeuta
            try {
              console.log(
                `[DEBUG DISPONIBILIDAD] Buscando entrada de Disponibilidad para eliminar hora: Terapeuta ID: ${terapeutaId}, Fecha: ${fecha}, Hora: ${hora}`
              );
              const disponibilidadEntry = await Disponibilidad.findOne({
                where: {
                  terapeutaId: terapeutaId,
                  diasDisponibles: {
                    [Op.contains]: sequelize.literal(
                      `ARRAY['${fecha}']::TEXT[]`
                    ),
                  },
                  estado: "disponible", // Solo busca si está disponible
                },
                transaction: t,
                lock: t.LOCK.UPDATE, // Bloquear la fila para evitar condiciones de carrera
              });

              if (!disponibilidadEntry) {
                const msg = `CRÍTICO: La entrada de disponibilidad para ${terapeutaData.nombre} el ${fecha} (hora: ${hora}) con estado 'disponible' NO FUE ENCONTRADA o ya fue reservada/modificada.`;
                console.error(`[ERROR DISPONIBILIDAD] ${msg}`);
                throw new Error(
                  `Fallo en la gestión de disponibilidad: ${msg}`
                );
              }

              let currentHours = disponibilidadEntry.horasDisponibles;
              if (!Array.isArray(currentHours)) {
                currentHours = [];
              }
              const initialHoursCount = currentHours.length;
              const updatedHours = currentHours.filter((h) => h !== hora);

              if (updatedHours.length === initialHoursCount) {
                const msg = `CRÍTICO: La hora ${hora} NO FUE ENCONTRADA en el array de horas disponibles. Esto indica una inconsistencia.`;
                console.error(`[ERROR DISPONIBILIDAD] ${msg}`);
                throw new Error(
                  `Fallo en la gestión de disponibilidad: ${msg}`
                );
              }

              if (updatedHours.length === 0) {
                await disponibilidadEntry.destroy({ transaction: t });
                console.log(
                  `[INFO DISPONIBILIDAD] *** ÉXITO: Eliminada entrada de Disponibilidad (ID: ${disponibilidadEntry.id}) para ${terapeutaData.nombre} el ${fecha} (última hora ${hora} reservada). ***`
                );
              } else {
                await disponibilidadEntry.update(
                  { horasDisponibles: updatedHours },
                  { transaction: t }
                );
                console.log(
                  `[INFO DISPONIBILIDAD] *** ÉXITO: Hora ${hora} eliminada del array de horas disponibles (ID: ${disponibilidadEntry.id}) para ${terapeutaData.nombre} el ${fecha}. Restantes: ${updatedHours.length} horas. ***`
                );
              }
            } catch (dispError) {
              console.error(
                `[ERROR DISPONIBILIDAD] FALLO CRÍTICO en el bloque de actualización de disponibilidad para ${terapeutaData.nombre} (${terapeutaId}) el ${fecha} a las ${hora}:`,
                dispError.message || dispError
              );
              throw new Error(
                `Fallo en la gestión de disponibilidad: ${
                  dispError.message || "Error desconocido"
                }`
              );
            }
          }
          // <--- INICIO: LÓGICA AGREGADA PARA DISTINGUIR CRISIS DE NORMAL ---
          let tipoServicio = "Servicio Normal"; // Definición de precios de crisis (Basado en la estructura de TratamientoHolistico.tsx)

          // Lógica para GiftCard
          if (servicio === "GiftCard") {
            tipoServicio = "Gift Card / Paquete de Sesiones";
          } else {
            // Lógica existente para Mente y Ser (Intervención en Crisis)
            const PRECIO_CRISIS_4_SESIONES = 170000;
            const PRECIO_CRISIS_10_SESIONES = 370000;
            if (servicio === "Mente y Ser") {
              if (
                (sesiones === 4 && precio === PRECIO_CRISIS_4_SESIONES) ||
                (sesiones === 10 && precio === PRECIO_CRISIS_10_SESIONES)
              ) {
                tipoServicio = "¡PAQUETE ASISTENCIA EN CRISIS!";
              }
            }
          }
          // Notificación al terapeuta
          if (terapeutaData && terapeutaData.email) {
            let serviciosOfrecidosArray = terapeutaData.serviciosOfrecidos;
            if (!Array.isArray(serviciosOfrecidosArray)) {
              console.warn(
                "[DEBUG NOTIFY] serviciosOfrecidosArray no es un array, forzando a vacío.",
                serviciosOfrecidosArray
              );
              serviciosOfrecidosArray = [];
            }

            const servicioReservaNormalizado = especialidad.trim();
            const servicioReservaLowerCase =
              servicioReservaNormalizado.toLowerCase();

            const ofreceServicio = serviciosOfrecidosArray.some((s) => {
              const servicioOfrecidoNormalizado = String(s).trim();
              const servicioOfrecidoLowerCase =
                servicioOfrecidoNormalizado.toLowerCase();
              return servicioOfrecidoLowerCase === servicioReservaLowerCase;
            });

            if (ofreceServicio) {
              // --- AJUSTE EN ASUNTO (Añadimos la etiqueta de servicio) ---
              const subjectPrefix =
                tipoServicio === "¡PAQUETE ASISTENCIA EN CRISIS!"
                  ? "[Intervención En Crisis] "
                  : servicio === "GiftCard"
                  ? "[Gift Card / Paquete] " // Nuevo prefijo para GiftCard
                  : "";
              const subject = `${subjectPrefix}¡Nueva Reserva Confirmada para ${especialidad}!`;
              // ---------------------------------------------------------

              let htmlContent;
              let mensajeAdicional;

              // ************************************************************
              // *** LÓGICA CONDICIONAL PARA EMAIL DE GIFTCARD (SIN REGEX) ***
              // ************************************************************
              if (servicio === "GiftCard") {
                // LEEMOS DIRECTAMENTE DE LOS NUEVOS CAMPOS DE LA RESERVA (INSTANCIA EXISTENTE)
                const destinatario = existingReserva.nombreCliente || "N/A";
                const telefonoDestinatario =
                  existingReserva.telefonoCliente || "N/A";
                const remitente = existingReserva.remitenteNombre || "N/A";
                const telefonoRemitente =
                  existingReserva.remitenteTelefono || "N/A";
                const mensajePersonalizado =
                  existingReserva.mensajePersonalizado ||
                  "No se adjuntó mensaje.";

                htmlContent = `
                  <p>Hola ${terapeutaData.nombre || "Equipo"},</p>
                  <p>¡Se ha confirmado la compra de una **Gift Card / Paquete de Sesiones**!</p>
                  <p>Esta compra **NO** representa una hora agendada en tu calendario, sino un paquete de sesiones prepagado que el VALIENTE agendará junto contigo una vez lo contactes</p>
                  <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ccc;">
                  
                  <h4 style="color: #02807d; margin-bottom: 5px;">Detalles del Paquete</h4>
                  <ul>
                      <li><strong>Tipo de Producto:</strong> ${tipoServicio}</li> 
                      <li><strong>Especialidad:</strong> ${
                        especialidad || "N/A"
                      }</li>
                      <li><strong>Paquete:</strong> ${
                        sesiones || 1
                      } sesiones</li>
                      <li><strong>Precio Pagado:</strong> $${
                        precio ? precio.toLocaleString("es-CL") : "N/A"
                      } CLP</li>
                  </ul>
                  
                  <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ccc;">

                  <h4 style="color: #02807d; margin-bottom: 5px;">Datos del Regalo</h4>
                  <ul>
                      <li><strong>Destinatario (Quien Recibe):</strong> ${destinatario}</li>
                      <li><strong>Teléfono Destinatario:</strong> ${telefonoDestinatario}</li>
                  </ul>
                  
                  <h4 style="color: #02807d; margin: 15px 0 5px 0;">Remitente (Quien Regala)</h4>
                  <ul>
                      <li><strong>Nombre:</strong> ${remitente}</li>
                      <li><strong>Teléfono:</strong> ${telefonoRemitente}</li>
                  </ul>

                  <h4 style="color: #02807d; margin: 15px 0 5px 0;">Mensaje Personalizado</h4>
                  <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9; border-radius: 4px; margin-bottom: 15px;">
                      <p style="margin: 0; white-space: pre-wrap;">${mensajePersonalizado}</p>
                  </div>
                  
                  <p>Contacta con el destinatario para coordinar la toma de hora.</p>
                  <p style="font-size: 0.9em; color: #888;">Fecha de Compra: ${
                    fecha || "N/A"
                  }</p>
                  `;
              } else {
                // Contenido original para reservas de hora normal/crisis
                const mensajeAdicional =
                  tipoServicio === "¡PAQUETE ASISTENCIA EN CRISIS!"
                    ? `<p style="color:red; font-weight:bold;">¡ATENCIÓN! ESTE ES UN PAQUETE DE INTERVENCIÓN EN CRISIS. REQUIERE ATENCIÓN PRIORITARIA.</p>`
                    : `<p>Por favor, revisa tu calendario y prepárate para la sesión.</p>`;

                htmlContent = `
                    <p>Hola ${terapeutaData.nombre || "Terapeuta"},</p>
                    <p>¡Se ha confirmado una nueva reserva para ${servicio}!</p>
                    <ul>
                        <li><strong>Tipo de Servicio:</strong> ${tipoServicio}</li> 
                        <li><strong>Servicio:</strong> ${servicio}</li>
                        <li><strong>Especialidad:</strong> ${
                          especialidad || "N/A"
                        }</li>
                        <li><strong>Cliente:</strong> ${
                          nombreCliente || "N/A"
                        }</li>
                        <li><strong>Teléfono Cliente:</strong> ${
                          telefonoCliente || "N/A"
                        }</li>
                        <li><strong>Fecha:</strong> ${fecha || "N/A"}</li>
                        <li><strong>Hora:</strong> ${hora || "N/A"}</li>
                        <li><strong>Sesiones:</strong> ${sesiones || 1}</li>
                        <li><strong>Precio:</strong> $${
                          precio ? precio.toLocaleString("es-CL") : "N/A"
                        } CLP</li>
                    </ul>
                    ${mensajeAdicional}
                    `;
              }
              // ************************************************************

              await sendEmail(terapeutaData.email, subject, htmlContent);
              console.log(
                `[DEBUG NOTIFY] Notificación por correo enviada a ${terapeutaData.email}.`
              );
            } else {
              console.warn(
                `[DEBUG NOTIFY] Alerta: Terapeuta "${terapeutaData.nombre}" encontrado, pero la especialidad "${especialidad}" NO está en su lista de servicios ofrecidos. No se enviará notificación específica de servicio.`
              );
            }
          } else {
            console.warn(
              `[DEBUG NOTIFY] Terapeuta "${terapeuta}" no encontrado (o sin email registrado). No se enviará notificación.`
            );
          }
        } catch (emailError) {
          // <--- ESTE CATCH PERTENECE AL TRY DE NOTIFICACIÓN
          console.error(
            "[DEBUG NOTIFY] ERROR CRÍTICO en notificación al terapeuta:",
            emailError
          );
          throw new Error(
            `Fallo en la lógica de notificación: ${
              emailError.message || "Error desconocido"
            }`
          );
        }
        console.log(
          "[DEBUG CONFIRM] Lógica de notificación completada para reserva:",
          servicio
        );

        // --- Google Calendar Event Creation Logic ---
        console.log(
          "[DEBUG CONFIRM] Intentando crear evento de calendario para reserva:",
          servicio
        );
        // Excluir GiftCard de la creación de eventos de calendario
        if (fecha && hora && servicio !== "GiftCard") {
          try {
            const startDateTime = new Date(`${fecha}T${hora}:00`);
            const endDateTime = new Date(
              startDateTime.getTime() + 60 * 60 * 1000
            );
            if (!isNaN(startDateTime.getTime())) {
              const resumenEvento = `Reserva: ${servicio} | Cliente: ${nombreCliente} | Teléfono: ${telefonoCliente} | Terapeuta: ${terapeutaData.nombre}`;
              await crearEventoReserva(
                startDateTime.toISOString(),
                endDateTime.toISOString(),
                resumenEvento
              );
            } else {
              console.warn(
                `[DEBUG GOOGLE CALENDAR] Fecha u hora inválida para evento de Google Calendar: ${fecha} ${hora}`
              );
            }
          } catch (calError) {
            // <--- ESTE CATCH PERTENECE AL TRY DE GOOGLE CALENDAR
            console.error(
              "[DEBUG GOOGLE CALENDAR] Error al intentar crear evento de Google Calendar:",
              calError
            );
            throw new Error(
              `Fallo en la creación de evento de calendario: ${
                calError.message || "Error desconocido"
              }`
            );
          }
        } else if (servicio === "GiftCard") {
          console.warn(
            "[DEBUG GOOGLE CALENDAR] Saltando creación de evento: Servicio es GiftCard."
          );
        } else {
          console.warn(
            "[DEBUG GOOGLE CALENDAR] No se puede crear evento de Google Calendar: Falta fecha u hora en la reserva."
          );
        }
        console.log(
          "[DEBUG CONFIRM] Lógica de Google Calendar completada para reserva:",
          servicio
        );
      } // End of for loop through reservations

      await TemporalReserva.destroy({
        where: { token: tokenWs },
        transaction: t,
      });
      console.log("TemporalReserva eliminada.");
      await t.commit();
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-confirmacion-exito?token=${tokenWs}&transactionId=${nuevaTransaccion.id}`
      );
    } else {
      // If payment is not authorized (rejected or failed by Transbank)
      console.warn("Pago no autorizado o fallido:", commitResponse);
      await nuevaTransaccion.update(
        { estadoPago: "rechazado", fechaPago: new Date() },
        { transaction: t }
      );
      await TemporalReserva.destroy({
        where: { token: tokenWs },
        transaction: t,
      });
      console.log("TemporalReserva eliminada tras pago rechazado.");
      await t.rollback();
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${tokenWs}&status=${
          commitResponse.status
        }&code=${commitResponse.response_code || ""}`
      );
    }
  } catch (error) {
    if (t && t.finished !== "rollback" && t.finished !== "commit") {
      await t.rollback();
    }
    console.error("Error general al confirmar transacción:", error);
    let errorMessage = error.message || "Error desconocido.";

    if (nuevaTransaccion) {
      try {
        await Transaccion.update(
          { estadoPago: "error_procesamiento" },
          { where: { id: nuevaTransaccion.id } }
        );
        console.log(
          `[DB] Transacción ${nuevaTransaccion.id} actualizada a 'error_procesamiento'.`
        );
      } catch (updateErr) {
        console.error(
          `[DB-ERROR] Error al intentar actualizar estado de transacción ${nuevaTransaccion.id} a 'error_procesamiento':`,
          updateErr
        );
      }
    } else if (tokenWs) {
      try {
        const transaccionEnDB = await Transaccion.findOne({
          where: { tokenTransaccion: tokenWs },
        });
        if (transaccionEnDB) {
          await transaccionEnDB.update({ estadoPago: "error_procesamiento" });
          console.log(
            `[DB] Transacción encontrada por token ${tokenWs} y actualizada a 'error_procesamiento'.`
          );
        }
      } catch (searchUpdateError) {
        console.error(
          `[DB-ERROR] Error al buscar/actualizar transacción por token ${tokenWs} en caso de error:`,
          searchUpdateError
        );
      }
    }

    if (error.constructor && error.constructor.name === "TransbankError") {
      console.error("Detalles del error de Transbank:", errorMessage);
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          tokenWs || "n/a"
        }&error=${encodeURIComponent(errorMessage)}&type=transbank_error`
      );
    } else if (error.name === "SequelizeValidationError") {
      console.error(
        "Detalles del error de validación de Sequelize:",
        error.errors.map((e) => e.message).join(", ")
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          tokenWs || "n/a"
        }&error=${encodeURIComponent(
          "Validación de datos: " +
            error.errors.map((e) => e.message).join(", ")
        )}&type=validation_error`
      );
    } else if (error.name === "SequelizeUniqueConstraintError") {
      console.error(
        "Detalles del error de clave única de Sequelize:",
        error.errors.map((e) => e.message).join(", ")
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          tokenWs || "n/a"
        }&error=${encodeURIComponent(
          "Error de clave única: " +
            error.errors.map((e) => e.message).join(", ")
        )}&type=unique_constraint_error`
      );
    } else if (
      error.message &&
      error.message.includes("Fallo en la gestión de disponibilidad")
    ) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          tokenWs || "n/a"
        }&error=${encodeURIComponent(errorMessage)}&type=disponibilidad_error`
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          tokenWs || "n/a"
        }&error=${encodeURIComponent(errorMessage)}&type=internal_server_error`
      );
    }
  }
};

module.exports = {
  crearTransaccionInicial,
  confirmarTransaccion,
  crearReservaDirecta,
  getPurchaseDetails,
};
