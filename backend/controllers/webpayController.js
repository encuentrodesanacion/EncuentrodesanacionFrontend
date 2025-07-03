const { WebpayPlus, Options, Environment } = require("transbank-sdk");
const { google } = require("googleapis");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const db = require("../models");
const Reserva = db.Reserva;
const TemporalReserva = db.TemporalReserva;
const Terapeuta = db.Terapeuta;
const Transaccion = db.Transaccion;

const { Op, Sequelize } = db.sequelize;
const sequelize = db.sequelize;

const { sendEmail } = require("../services/emailService");

console.log("------------------------------------------");
console.log("Cargando configuración de Transbank en Controller:");
console.log("process.env.TBK_COMMERCE_CODE:", process.env.TBK_COMMERCE_CODE);
console.log("process.env.TBK_API_KEY:", process.env.TBK_API_KEY);
console.log("process.env.TBK_ENV:", process.env.TBK_ENV);
console.log("------------------------------------------");

const transaction = new WebpayPlus.Transaction(
  new Options(
    process.env.TBK_COMMERCE_CODE,
    process.env.TBK_API_KEY,
    process.env.TBK_ENV === "PRODUCCION"
      ? Environment.Production
      : Environment.Integration
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

const crearTransaccionInicial = async (req, res) => {
  try {
    const { monto, returnUrl, reservas } = req.body;

    if (!monto || !returnUrl || !reservas || reservas.length === 0) {
      return res.status(400).json({
        error:
          "Faltan parámetros: monto, returnUrl o reservas no contiene ítems.",
      });
    }

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
      // **NUEVAS VALIDACIONES para fecha y hora**
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
      // Opcional: Validar que la fecha y hora sean parseables
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

    try {
      const createdTempReserva = await TemporalReserva.create({
        token: response.token,
        reservas: JSON.stringify(reservas), // Guardar como string JSON
        montoTotal: monto,
        clienteId: reservas[0]?.telefonoCliente || null,
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

exports.confirmarTransaccion = async (req, res) => {
  // Obtener el token de Transbank. Puede venir de req.query o req.body.
  const tokenWs = req.query.token_ws || req.body?.token_ws;
  let transaccionDbRecord; // Renombrado para evitar confusión con 'transaction' de WebpayPlus
  let commitResponse; // Variable para almacenar la respuesta de Transbank commit
  let temporalReserva; // La reserva temporal de la DB

  // Iniciar la transacción de Sequelize para asegurar atomicidad
  const t = await sequelize.transaction();

  try {
    console.log("------------------------------------------");
    console.log("Entrando a confirmarTransaccion");
    console.log("req.method:", req.method);
    console.log("req.body:", req.body);
    console.log("req.query:", req.query);
    console.log("Token obtenido (tokenWs):", tokenWs); // Usar tokenWs consistentemente
    console.log("------------------------------------------");

    if (!tokenWs) {
      console.warn("Falta token de confirmación en req.body o req.query.");
      await t.rollback(); // Rollback si no hay token
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=missing_token`
      );
    }

    // --- 1. Confirmar la transacción con Transbank ---
    // 'transaction' es tu instancia de WebpayPlus.Transaction
    commitResponse = await transaction.commit(tokenWs);
    console.log("Respuesta de commit Transbank:", commitResponse);

    // --- 2. Buscar la TemporalReserva ---
    temporalReserva = await TemporalReserva.findOne({
      where: { token: tokenWs },
    });

    if (!temporalReserva) {
      console.warn("TemporalReserva no encontrada para el token:", tokenWs);
      await t.rollback();
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=no_temp_reservations&token=${tokenWs}`
      );
    }

    // --- 3. Manejar la Transaccion en DB (crear o actualizar) ---
    // Buscar una transacción existente por token
    transaccionDbRecord = await Transaccion.findOne({
      where: { token_transaccion: tokenWs }, // Asumo que esta es tu columna de token en Transacciones
      transaction: t,
    });

    if (transaccionDbRecord) {
      // Transacción ya existe, la actualizamos
      console.log(
        "DEBUG webpayController: Transacción existente encontrada, actualizando estado."
      );
      await transaccionDbRecord.update(
        {
          estado_pago:
            commitResponse.status === "AUTHORIZED" ? "aprobado" : "rechazado",
          fecha_pago: new Date(),
          // Puedes actualizar otros campos de la transacción aquí si es necesario
        },
        { transaction: t }
      );
    } else {
      // No existe, la creamos
      console.log("DEBUG webpayController: Creando nueva transacción.");
      // Asegúrate de que temporalReserva contenga los datos necesarios para Transaccion.create
      transaccionDbRecord = await Transaccion.create(
        {
          token_transaccion: tokenWs,
          monto_total: temporalReserva.montoTotal,
          estado_pago:
            commitResponse.status === "AUTHORIZED" ? "aprobado" : "rechazado",
          fecha_pago: new Date(),
          cliente_id: temporalReserva.clienteId, // Asumo que clienteId está en temporalReserva
          // buy_order: temporalReserva.buyOrder, // Si los tienes
          // session_id: temporalReserva.sessionId, // Si los tienes
        },
        { transaction: t }
      );
    }

    // --- 4. Procesar Reservas individuales y actualizar Disponibilidad (SOLO SI PAGO APROBADO) ---
    if (commitResponse.status === "AUTHORIZED") {
      let reservasToProcess = temporalReserva.reservas; // Esto viene como string JSON, necesita parseo
      if (typeof reservasToProcess === "string") {
        try {
          reservasToProcess = JSON.parse(reservasToProcess);
        } catch (parseError) {
          console.error(
            "Error al parsear JSON de temporal.reservas:",
            parseError
          );
          await nuevaTransaccion.update(
            { estado_pago: "fallo_datos_corruptos" },
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
          { estado_pago: "fallo_sin_reservas" },
          { transaction: t }
        );
        throw new Error("No hay reservas válidas para procesar.");
      }

      let criticalReservationError = false;

      for (const resItem of reservasToProcess) {
        // Itera sobre cada item del carrito
        if (criticalReservationError) break; // Salir del bucle si hay un error crítico

        let errorMessages = [];
        // *** Validación de datos de reserva (tus validaciones existentes) ***
        // Asegúrate de que todos los campos requeridos por el modelo Reserva estén presentes y válidos
        if (
          !resItem.servicio ||
          !resItem.especialidad ||
          !resItem.fecha ||
          !resItem.hora ||
          resItem.precio === undefined ||
          resItem.precio === null || // Changed price check
          !resItem.nombreCliente ||
          !resItem.telefonoCliente ||
          !resItem.terapeuta ||
          resItem.terapeutaId === undefined ||
          resItem.terapeutaId === null
        ) {
          errorMessages.push("Datos de reserva incompletos o inválidos.");
        }
        // ... (otras validaciones existentes para tipo y valor) ...

        if (errorMessages.length > 0) {
          console.error(
            "Error: Datos de reserva inválidos detectados. Detalles:",
            errorMessages,
            "Objeto:",
            resItem
          );
          await nuevaTransaccion.update(
            { estado_pago: "fallo_datos_reserva" },
            { transaction: t }
          );
          criticalReservationError = true;
          break;
        }

        // *** Buscar el terapeuta para obtener el ID (si no viene ya en la reserva del frontend) ***
        // Asumo que 'resItem.terapeutaId' ya viene del frontend (verificar si es así)
        // Si no, necesitarías buscarlo por 'resItem.terapeuta' (nombre), como en tu código original.
        let terapeutaEncontrado = null;
        if (resItem.terapeutaId) {
          // Preferimos buscar por ID si viene del frontend
          terapeutaEncontrado = await Terapeuta.findByPk(resItem.terapeutaId, {
            transaction: t,
          });
          console.log(
            `[DEBUG CREATERESERVA] Buscando terapeuta por ID: ${resItem.terapeutaId}.`
          );
        } else if (resItem.terapeuta) {
          // Fallback si no viene el ID, buscar por nombre
          console.log(
            `[DEBUG CREATERESERVA] Buscando terapeuta por nombre: "${resItem.terapeuta}".`
          );
          terapeutaEncontrado = await Terapeuta.findOne({
            where: { nombre: resItem.terapeuta },
            transaction: t,
          });
        }

        // Asegúrate de que el terapeuta fue encontrado
        if (!terapeutaEncontrado) {
          const errorMsg = `Error al crear reserva: Terapeuta "${
            resItem.terapeuta
          }" (ID: ${
            resItem.terapeutaId || "N/A"
          }) NO FUE ENCONTRADO EN LA BASE DE DATOS.`;
          console.error(errorMsg);
          await nuevaTransaccion.update(
            { estado_pago: "fallo_terapeuta_no_encontrado" },
            { transaction: t }
          );
          criticalReservationError = true;
          break;
        }

        // *** 4.a. Crear la Reserva en la DB ***
        const createdReserva = await Reserva.create(
          {
            transaccionId: nuevaTransaccion.id, // ID de la transacción creada/actualizada
            clientBookingId: resItem.id || uuidv4(), // Usar el ID del item del carrito o generar uno
            servicio: resItem.servicio,
            especialidad: resItem.especialidad,
            fecha: resItem.fecha,
            hora: resItem.hora,
            precio: resItem.precio,
            nombre_cliente: resItem.nombreCliente,
            telefono_cliente: resItem.telefonoCliente,
            sesiones: resItem.sesiones || 1,
            cantidad: resItem.cantidad || 1,
            terapeuta: resItem.terapeuta, // Nombre del terapeuta
            terapeuta_id: terapeutaEncontrado.id, // ¡ID del terapeuta, crucial!
          },
          { transaction: t }
        );
        console.log(
          `Reserva ${createdReserva.servicio} (ID: ${createdReserva.id}) guardada y asociada a Transaccion ID: ${nuevaTransaccion.id}`
        );

        // *** 4.b. Actualizar la Tabla 'Disponibilidades' (Eliminar la hora reservada) ***
        const disponibilidad = await Disponibilidad.findOne({
          where: {
            terapeuta_id: terapeutaEncontrado.id, // Buscar por ID del terapeuta
            dias_disponibles: resItem.fecha, // Y por la fecha específica
          },
          transaction: t,
          lock: t.LOCK.UPDATE, // Bloquear la fila para evitar reservas dobles
        });

        if (!disponibilidad) {
          const msg = `Disponibilidad no encontrada para el terapeuta ${terapeutaEncontrado.nombre} y la fecha ${resItem.fecha}.`;
          console.error(msg);
          await nuevaTransaccion.update(
            { estado_pago: "fallo_disponibilidad_no_encontrada" },
            { transaction: t }
          );
          criticalReservationError = true;
          throw new Error(msg); // Lanza el error para que la transacción se revierta
        }

        let currentHours = disponibilidad.horasDisponibles; // Ya es un array por el getter

        const initialHoursCount = currentHours.length;
        currentHours = currentHours.filter((h) => h !== resItem.hora); // Eliminar la hora reservada

        if (currentHours.length === initialHoursCount) {
          const msg = `La hora ${resItem.hora} no fue encontrada en la disponibilidad de ${resItem.terapeuta} el ${resItem.fecha}.`;
          console.error(msg);
          await nuevaTransaccion.update(
            { estado_pago: "fallo_hora_no_disponible" },
            { transaction: t }
          );
          criticalReservationError = true;
          throw new Error(msg); // Lanza el error para que la transacción se revierta
        }

        await disponibilidad.update(
          {
            horas_disponibles: currentHours, // El setter se encargará de JSON.stringify()
          },
          { transaction: t }
        );

        console.log(
          `Disponibilidad actualizada para ${terapeutaEncontrado.nombre} el ${resItem.fecha}. Hora ${resItem.hora} eliminada.`
        );

        // Lógica de Notificación al Terapeuta (asegúrate que 'terapeutaEncontrado.servicios_ofrecidos' sea parseado a un array antes de usar 'some')
        try {
          let serviciosOfrecidosArray = [];
          if (typeof terapeutaEncontrado.servicios_ofrecidos === "string") {
            try {
              serviciosOfrecidosArray = JSON.parse(
                terapeutaEncontrado.servicios_ofrecidos
              );
            } catch (parseErr) {
              console.error(
                `Error al parsear servicios_ofrecidos para terapeuta ${terapeutaEncontrado.nombre}:`,
                parseErr
              );
            }
          }

          const ofreceServicio =
            Array.isArray(serviciosOfrecidosArray) &&
            serviciosOfrecidosArray.some(
              (s) =>
                s.trim().toLowerCase() ===
                resItem.especialidad.trim().toLowerCase()
            );

          if (
            terapeutaEncontrado &&
            terapeutaEncontrado.email &&
            ofreceServicio
          ) {
            const subject = `¡Nueva Reserva Confirmada para ${resItem.especialidad}!`;
            const htmlContent = `
                          <p>Hola ${
                            terapeutaEncontrado.nombre || "Terapeuta"
                          },</p>
                          <p>¡Se ha confirmado una nueva reserva para tu servicio!</p>
                          <ul>
                            <li><strong>Servicio:</strong> ${
                              resItem.servicio
                            }</li>
                            <li><strong>Especialidad:</strong> ${
                              resItem.especialidad || "N/A"
                            }</li>
                            <li><strong>Cliente:</strong> ${
                              resItem.nombreCliente || "N/A"
                            }</li>
                            <li><strong>Teléfono Cliente:</strong> ${
                              resItem.telefonoCliente || "N/A"
                            }</li>
                            <li><strong>Fecha:</strong> ${
                              resItem.fecha || "N/A"
                            }</li>
                            <li><strong>Hora:</strong> ${
                              resItem.hora || "N/A"
                            }</li>
                            <li><strong>Sesiones:</strong> ${
                              resItem.sesiones || 1
                            }</li>
                            <li><strong>Precio:</strong> $${
                              resItem.precio
                                ? resItem.precio.toLocaleString("es-CL")
                                : "N/A"
                            } CLP</li>
                          </ul>
                          <p>Por favor, revisa tu calendario y prepárate para la sesión.</p>
                          <p>Atentamente,<br>El equipo de Encuentro de Sanación</p>
                      `;
            await sendEmail(terapeutaEncontrado.email, subject, htmlContent);
            console.log(
              `[DEBUG NOTIFY] Notificación por correo enviada a ${terapeutaEncontrado.nombre} (${terapeutaEncontrado.email})`
            );
          } else {
            console.warn(
              `[DEBUG NOTIFY] Alerta: No se pudo enviar notificación a terapeuta "${terapeutaEncontrado.nombre}" (email: ${terapeutaEncontrado.email}, ofreceServicio: ${ofreceServicio}).`
            );
          }
        } catch (emailError) {
          console.error("Error al enviar email al terapeuta:", emailError);
        }

        // Lógica de Creación de Evento en Google Calendar
        if (resItem.fecha && resItem.hora) {
          try {
            const startDateTime = new Date(
              `${resItem.fecha}T${resItem.hora}:00`
            );
            const endDateTime = new Date(
              startDateTime.getTime() + 60 * 60 * 1000
            ); // Asumiendo 1 hora de duración
            if (!isNaN(startDateTime.getTime())) {
              const resumenEvento = `Reserva: ${resItem.servicio} | Cliente: ${resItem.nombreCliente} | Teléfono: ${resItem.telefonoCliente}`;
              await crearEventoReserva(
                startDateTime.toISOString(),
                endDateTime.toISOString(),
                resumenEvento
              );
            } else {
              console.warn(
                `Fecha u hora inválida para evento de Google Calendar: ${resItem.fecha} ${resItem.hora}`
              );
            }
          } catch (calError) {
            console.error(
              "Error al crear evento en Google Calendar:",
              calError
            );
          }
        }
      } // Fin del bucle for (reservasToProcess)

      if (criticalReservationError) {
        // Si hubo un error crítico en alguna reserva, la transacción ya se revirtió por el 'throw'
        return res.redirect(
          `${process.env.FRONTEND_URL}/pago-fallido?error=reserva_fallida_parcialmente&token=${tokenWs}`
        );
      } else {
        await TemporalReserva.destroy({ where: { token: tokenWs } }); // Eliminar TemporalReserva
        console.log("TemporalReserva eliminada.");
        await t.commit(); // Confirmar la transacción si todo fue exitoso
        return res.redirect(
          `${process.env.FRONTEND_URL}/pago-confirmacion-exito?token=${tokenWs}&transactionId=${transaccionDbRecord.id}`
        );
      }
    } else {
      // Pago no autorizado o fallido (commitResponse.status !== "AUTHORIZED")
      console.warn("Pago no autorizado o fallido:", commitResponse);
      await transaccionDbRecord.update(
        {
          estado_pago: "rechazado",
          fecha_pago: new Date(),
        },
        { transaction: t }
      ); // Actualizar estado de Transaccion a rechazado
      await t.rollback(); // Revertir la transacción
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${tokenWs}&status=${
          commitResponse.status
        }&code=${commitResponse.response_code || ""}`
      );
    }
  } catch (error) {
    // Captura errores generales
    await t.rollback(); // Siempre hacer rollback en caso de error
    console.error(
      "Error general al confirmar transacción (catch principal):",
      error
    );

    let redirectErrorType = "internal_server_error";
    let redirectErrorMessage = error.message || "Error desconocido.";

    if (error.constructor && error.constructor.name === "TransbankError") {
      redirectErrorType = "transbank_error";
    } else if (error.name === "SequelizeValidationError") {
      redirectErrorType = "validation_error";
      redirectErrorMessage =
        "Validación de datos: " + error.errors.map((e) => e.message).join(", ");
    } else if (error.name === "SequelizeUniqueConstraintError") {
      redirectErrorType = "unique_constraint_error";
      redirectErrorMessage =
        "Error de clave única: " +
        error.errors.map((e) => e.message).join(", ");
    } else {
      // Error inesperado
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          tokenWs || "n/a"
        }&error=${encodeURIComponent(
          redirectErrorMessage
        )}&type=${redirectErrorType}`
      );
    }
  }
};

module.exports = {
  crearTransaccionInicial,
  confirmarTransaccion,
  // anularTransaccion, // Comentado o eliminado si no se necesita en esta versión.
};
