// =================================================================
// WEBPAY CONTROLLER - Encuentro de Sanación
// =================================================================
// Responsable del flujo de pago con Transbank, incluyendo la
// creación, confirmación y procesamiento de transacciones.
// =================================================================

// -----------------------------------------------------------------
// 1. IMPORTACIONES DE MÓDULOS Y SERVICIOS
// -----------------------------------------------------------------
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

const { Op, Sequelize } = db.sequelize;
const sequelize = db.sequelize;

// Importación de servicios personalizados
const { sendEmail } = require("../services/emailService");

console.log("------------------------------------------");
console.log("INICIALIZANDO WEBPAY CONTROLLER");
console.log(`[CONFIG] Código de Comercio: ${process.env.TBK_COMMERCE_CODE}`);
console.log(`[CONFIG] Entorno de Transbank: ${process.env.TBK_ENV}`);
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
  let tokenWs = req.query.token_ws || req.body?.token_ws;

  let t;
  let nuevaTransaccion;

  try {
    // --- MODIFICACIÓN CLAVE AQUÍ: Capturar TBK_TOKEN o token_ws ---
    // Preferimos token_ws para transacciones normales, pero también aceptamos TBK_TOKEN
    // que es común en flujos de anulación o reversa.
    let tokenWs =
      req.query.token_ws || req.query.TBK_TOKEN || req.body?.token_ws;

    console.log("------------------------------------------");
    console.log("Entrando a confirmarTransaccion");
    console.log("req.method:", req.method);
    console.log("req.body:", req.body);
    console.log("req.query:", req.query);
    console.log("Token obtenido (incluyendo posible TBK_TOKEN):", tokenWs); // Log actualizado
    console.log("------------------------------------------");

    // --- LÓGICA PARA ANULACIÓN DIRECTA (manejar TBK_TOKEN sin commit) ---
    // Si el token es un TBK_TOKEN de anulación, Transbank no espera un commit.
    // Asumimos que si hay un TBK_TOKEN y NO hay un token_ws, es una anulación directa.
    // NOTA: Si en escenarios futuros Transbank envía 'TBK_TOKEN' para COMMIT, esta lógica necesitaría ajuste.
    // Por ahora, asumimos que 'token_ws' es para commit y 'TBK_TOKEN' (solo) es para anulación.
    if (req.query.TBK_TOKEN && !req.query.token_ws) {
      console.log(
        `[INFO] Se recibió TBK_TOKEN (${tokenWs}) sin token_ws. Asumiendo anulación directa por usuario.`
      );
      // No iniciar transacción de DB si es solo una anulación sin commit.
      // Redirige directamente a la página de pago fallido.
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${tokenWs}&error=anulacion_directa_usuario`
      );
    }

    // --- Validación inicial del token para transacciones que SÍ requieren commit ---
    if (!tokenWs) {
      // Esto solo se activaría si NINGÚN token (token_ws o TBK_TOKEN) fue recibido.
      console.warn(
        "Falta cualquier tipo de token (token_ws o TBK_TOKEN) en req.body o req.query."
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=missing_token`
      );
    }

    // Inicia la transacción de Sequelize solo si se espera un commit
    t = await sequelize.transaction();

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

      for (const reserva of reservasToProcess) {
        let errorMessages = [];
        if (
          typeof reserva.servicio !== "string" ||
          reserva.servicio.trim() === "" ||
          typeof reserva.precio !== "number" ||
          isNaN(reserva.precio) ||
          reserva.precio <= 0 ||
          typeof reserva.terapeuta !== "string" ||
          reserva.terapeuta.trim() === "" ||
          typeof reserva.especialidad !== "string" ||
          reserva.especialidad.trim() === "" ||
          typeof reserva.fecha !== "string" ||
          reserva.fecha.trim() === "" ||
          typeof reserva.hora !== "string" ||
          reserva.hora.trim() === "" ||
          typeof reserva.nombreCliente !== "string" ||
          reserva.nombreCliente.trim() === "" ||
          typeof reserva.telefonoCliente !== "string" ||
          reserva.telefonoCliente.trim() === "" ||
          (reserva.sesiones !== undefined &&
            (typeof reserva.sesiones !== "number" ||
              isNaN(reserva.sesiones) ||
              reserva.sesiones <= 0)) ||
          (reserva.cantidad !== undefined &&
            (typeof reserva.cantidad !== "number" ||
              isNaN(reserva.cantidad) ||
              reserva.cantidad <= 0))
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
            where: { nombre: terapeutaNombreNormalizado },
            transaction: t,
          });
        }
        if (terapeutaEncontrado && terapeutaEncontrado.get) {
          terapeutaEncontrado = terapeutaEncontrado.get({ plain: true });
        }

        if (!terapeutaEncontrado) {
          const errorMsg = `Error al crear reserva: Terapeuta "${
            reserva.terapeuta
          }" (ID: ${
            reserva.terapeutaId || "N/A"
          }) NO FUE ENCONTRADO EN LA BASE DE DATOS.`;
          console.error(errorMsg);
          await nuevaTransaccion.update(
            { estadoPago: "fallo_terapeuta_no_encontrado" },
            { transaction: t }
          );
          throw new Error(errorMsg);
        }

        const effectiveClientBookingId = reserva.id || uuidv4();
        await Reserva.create(
          {
            transaccionId: nuevaTransaccion.id,
            clientBookingId: effectiveClientBookingId,
            servicio: reserva.servicio,
            especialidad: reserva.especialidad,
            fecha: reserva.fecha,
            hora: reserva.hora,
            precio: reserva.precio,
            nombreCliente: reserva.nombreCliente,
            telefonoCliente: reserva.telefonoCliente,
            sesiones: reserva.sesiones || 1,
            cantidad: reserva.cantidad || 1,
            terapeuta: terapeutaEncontrado.nombre,
            terapeutaId: terapeutaEncontrado.id,
          },
          { transaction: t }
        );

        console.log(
          `Reserva ${reserva.servicio} (ID: ${effectiveClientBookingId}) guardada y asociada a Transaccion ID: ${nuevaTransaccion.id}`
        );

        // --- Logic to UPDATE AVAILABILITY (remove the reserved hour from array) ---
        try {
          console.log(
            `[DEBUG DISPONIBILIDAD] Buscando entrada de Disponibilidad para eliminar hora: Terapeuta ID: ${terapeutaEncontrado.id}, Fecha: ${reserva.fecha}, Hora: ${reserva.hora}`
          );
          const disponibilidadEntry = await Disponibilidad.findOne({
            where: {
              terapeutaId: terapeutaEncontrado.id,
              diasDisponibles: JSON.stringify([reserva.fecha]),
              estado: "disponible",
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (!disponibilidadEntry) {
            const msg = `CRÍTICO: La entrada de disponibilidad para ${terapeutaEncontrado.nombre} el ${reserva.fecha} (hora: ${reserva.hora}) con estado 'disponible' NO FUE ENCONTRADA o ya fue reservada/modificada.`;
            console.error(`[ERROR DISPONIBILIDAD] ${msg}`);
            throw new Error(`Fallo en la gestión de disponibilidad: ${msg}`);
          }

          let currentHours = disponibilidadEntry.horasDisponibles;
          if (!Array.isArray(currentHours)) {
            console.warn(
              `[WARN DISPONIBILIDAD] horasDisponibles no es un array para la entrada ${disponibilidadEntry.id}. Intentando corregir a vacío. Valor:`,
              currentHours
            );
            currentHours = [];
          }

          const initialHoursCount = currentHours.length;
          const updatedHours = currentHours.filter((h) => h !== reserva.hora);

          if (updatedHours.length === initialHoursCount) {
            const msg = `CRÍTICO: La hora ${reserva.hora} NO FUE ENCONTRADA en el array de horas disponibles para ${terapeutaEncontrado.nombre} el ${reserva.fecha}. Esto indica una inconsistencia.`;
            console.error(`[ERROR DISPONIBILIDAD] ${msg}`);
            throw new Error(`Fallo en la gestión de disponibilidad: ${msg}`);
          }

          if (updatedHours.length === 0) {
            await disponibilidadEntry.destroy({ transaction: t });
            console.log(
              `[INFO DISPONIBILIDAD] *** ÉXITO: Eliminada entrada de Disponibilidad (ID: ${disponibilidadEntry.id}) para ${terapeutaEncontrado.nombre} el ${reserva.fecha} (última hora ${reserva.hora} reservada). ***`
            );
          } else {
            await disponibilidadEntry.update(
              {
                horasDisponibles: updatedHours,
              },
              { transaction: t }
            );
            console.log(
              `[INFO DISPONIBILIDAD] *** ÉXITO: Hora ${reserva.hora} eliminada del array de horas disponibles (ID: ${disponibilidadEntry.id}) para ${terapeutaEncontrado.nombre} el ${reserva.fecha}. Restantes: ${updatedHours.length} horas. ***`
            );
          }
        } catch (dispError) {
          console.error(
            `[ERROR DISPONIBILIDAD] FALLO CRÍTICO en el bloque de actualización de disponibilidad para ${terapeutaEncontrado.nombre} (${terapeutaEncontrado.id}) el ${reserva.fecha} a las ${reserva.hora}:`,
            dispError.message || dispError
          );
          throw new Error(
            `Fallo en la gestión de disponibilidad: ${
              dispError.message || "Error desconocido"
            }`
          );
        }

        // --- Therapist Notification Logic ---
        try {
          console.log(
            "[DEBUG NOTIFY] Terapeuta encontrado de la DB (objeto completo para notificación):",
            terapeutaEncontrado ? terapeutaEncontrado : null
          );

          if (terapeutaEncontrado && terapeutaEncontrado.email) {
            let serviciosOfrecidosArray =
              terapeutaEncontrado.serviciosOfrecidos || [];

            const servicioReservaNormalizado = reserva.especialidad.trim();
            const servicioReservaLowerCase =
              servicioReservaNormalizado.toLowerCase();

            console.log(
              `[DEBUG NOTIFY] --- INICIANDO COMPARACIÓN DE SERVICIO (DETALLADO) ---`
            );
            console.log(
              `[DEBUG NOTIFY]   - Especialidad de la reserva (original): "${reserva.especialidad}"`
            );
            console.log(
              `[DEBUG NOTIFY]   - Especialidad de la reserva (normalizado): "${servicioReservaNormalizado}"`
            );
            console.log(
              `[DEBUG NOTIFY]   - Especialidad de la reserva (lowercase): "${servicioReservaLowerCase}"`
            );

            console.log(
              `[DEBUG NOTIFY]   - Servicios ofrecidos del terapeuta (Array):`,
              serviciosOfrecidosArray
            );

            let foundMatch = false;
            const ofreceServicio = serviciosOfrecidosArray.some((s, i) => {
              const servicioOfrecidoNormalizado = String(s).trim();
              const servicioOfrecidoLowerCase =
                servicioOfrecidoNormalizado.toLowerCase();

              console.log(
                `[DEBUG NOTIFY]     > Comparando (loop ${i}): "${servicioOfrecidoLowerCase}" (DB) con "${servicioReservaLowerCase}" (Reserva)`
              );
              console.log(
                `[DEBUG NOTIFY]        (DB Length: ${servicioOfrecidoLowerCase.length}, Reserva Length: ${servicioReservaLowerCase.length})`
              );
              console.log(
                `[DEBUG NOTIFY]        (DB char codes: ${[
                  ...servicioOfrecidoLowerCase,
                ].map((char) => char.charCodeAt(0))})`
              );
              console.log(
                `[DEBUG NOTIFY]        (Reserva char codes: ${[
                  ...servicioReservaLowerCase,
                ].map((char) => char.charCodeAt(0))})`
              );

              const isMatch =
                servicioOfrecidoLowerCase === servicioReservaLowerCase;
              if (isMatch) {
                foundMatch = true;
                console.log(`[DEBUG NOTIFY]     > ¡MATCH ENCONTRADO!`);
              }
              return isMatch;
            });

            console.log(
              `[DEBUG NOTIFY] ¿Hubo coincidencia FINAL?: ${ofreceServicio}`
            );
            console.log(
              `[DEBUG NOTIFY] --- FIN COMPARACIÓN DE SERVICIO (DETALLADO) ---`
            );

            if (ofreceServicio) {
              const subject = `¡Nueva Reserva Confirmada para ${reserva.especialidad}!`;
              const htmlContent = `
                <p>Hola ${terapeutaEncontrado.nombre || "Terapeuta"},</p>
                <p>¡Se ha confirmado una nueva reserva para ${
                  reserva.servicio
                }!</p>
                <ul>
                  <li><strong>Servicio:</strong> ${reserva.servicio}</li>
                  <li><strong>Especialidad:</strong> ${
                    reserva.especialidad || "N/A"
                  }</li>
                  <li><strong>Cliente:</strong> ${
                    reserva.nombreCliente || "N/A"
                  }</li>
                  <li><strong>Teléfono Cliente:</strong> ${
                    reserva.telefonoCliente || "N/A"
                  }</li>
                  <li><strong>Fecha:</strong> ${reserva.fecha || "N/A"}</li>
                  <li><strong>Hora:</strong> ${reserva.hora || "N/A"}</li>
                  <li><strong>Sesiones:</strong> ${reserva.sesiones || 1}</li>
                  <li><strong>Precio:</strong> $${
                    reserva.precio
                      ? reserva.precio.toLocaleString("es-CL")
                      : "N/A"
                  } CLP</li>
                </ul>
                <p>Por favor, revisa tu calendario y prepárate para la sesión.</p>
                <p>Atentamente,<br>El equipo de Encuentro de Sanación</p>
              `;
              await sendEmail(terapeutaEncontrado.email, subject, htmlContent);
              console.log(
                `[DEBUG NOTIFY] Notificación por correo enviada a ${terapeutaEncontrado.email}.`
              );
            } else {
              console.warn(
                `[DEBUG NOTIFY] Alerta: Terapeuta "${terapeutaEncontrado.nombre}" encontrado, pero la especialidad "${reserva.especialidad}" NO está en su lista de servicios ofrecidos. No se enviará notificación específica de servicio.`
              );
            }
          } else {
            console.warn(
              `[DEBUG NOTIFY] Terapeuta "${reserva.terapeuta}" no encontrado (o sin email registrado). No se enviará notificación.`
            );
          }
        } catch (emailError) {
          console.error(
            "[DEBUG NOTIFY] Error general en la lógica de notificación al terapeuta (sendEmail):",
            emailError
          );
        }

        // --- Google Calendar Event Creation Logic ---
        if (reserva.fecha && reserva.hora) {
          try {
            const startDateTime = new Date(
              `${reserva.fecha}T${reserva.hora}:00`
            );
            const endDateTime = new Date(
              startDateTime.getTime() + 60 * 60 * 1000
            );
            if (!isNaN(startDateTime.getTime())) {
              const resumenEvento = `Reserva: ${reserva.servicio} | Cliente: ${reserva.nombreCliente} | Teléfono: ${reserva.telefonoCliente}`;
              await crearEventoReserva(
                startDateTime.toISOString(),
                endDateTime.toISOString(),
                resumenEvento
              );
            } else {
              console.warn(
                `[DEBUG GOOGLE CALENDAR] Fecha u hora inválida para evento de Google Calendar: ${reserva.fecha} ${reserva.hora}`
              );
            }
          } catch (calError) {
            console.error(
              "[DEBUG GOOGLE CALENDAR] Error al intentar crear evento de Google Calendar:",
              calError
            );
          }
        } else {
          console.warn(
            "[DEBUG GOOGLE CALENDAR] No se puede crear evento de Google Calendar: Falta fecha u hora en la reserva."
          );
        }
      } // End of for loop through reservations

      await TemporalReserva.destroy({
        where: { token: tokenWs },
        transaction: t,
      });
      console.log("TemporalReserva eliminada.");
      await t.commit(); // Commit the transaction if everything was successful
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-confirmacion-exito?token=${tokenWs}&transactionId=${nuevaTransaccion.id}`
      );
    } else {
      // If payment is not authorized (rejected or failed by Transbank)
      console.warn("Pago no autorizado o fallido:", commitResponse);
      await nuevaTransaccion.update(
        {
          estadoPago: "rechazado",
          fechaPago: new Date(),
        },
        { transaction: t }
      );
      await t.rollback(); // Rollback the transaction for unauthorized payments
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${tokenWs}&status=${
          commitResponse.status
        }&code=${commitResponse.response_code || ""}`
      );
    }
  } catch (error) {
    // General catch for confirmarTransaccion
    if (t && t.finished !== "rollback" && t.finished !== "commit") {
      // Ensure rollback if 't' was defined and not yet committed/rolled back
      await t.rollback();
    }
    console.error("Error general al confirmar transacción:", error);
    let errorMessage = error.message || "Error desconocido.";

    // Lógica de actualización de estado de transacción en caso de error
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

    // Redirecciones basadas en el tipo de error
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
};
