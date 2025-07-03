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
const path = require("path"); // Aunque importado, 'path' no se usa en el código proporcionado.
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Importación de modelos de la base de datos
const db = require("../models");
const Reserva = db.Reserva;
const TemporalReserva = db.TemporalReserva;
const Terapeuta = db.Terapeuta; // Aunque importado, 'Terapeuta' no se usa directamente en el código proporcionado, solo a través de db.sequelize.query
const Transaccion = db.Transaccion;
const Disponibilidad = db.Disponibilidad;

// Importación de Sequelize para transacciones
const { Op, Sequelize } = db.sequelize; // 'Op' y 'Sequelize' no se usan directamente aquí, pero se mantienen.
const sequelize = db.sequelize;

// Importación de servicios personalizados
const { sendEmail } = require("../services/emailService");

// -----------------------------------------------------------------
// 2. CONFIGURACIÓN INICIAL
// -----------------------------------------------------------------
console.log("-------------------------------------------------");
console.log("INICIALIZANDO WEBPAY CONTROLLER");
console.log(`[CONFIG] Código de Comercio: ${process.env.TBK_COMMERCE_CODE}`);
console.log(`[CONFIG] Entorno de Transbank: ${process.env.TBK_ENV}`);
console.log("-------------------------------------------------");

// Instancia del SDK de Transbank
const transaction = new WebpayPlus.Transaction(
  new Options(
    process.env.TBK_COMMERCE_CODE,
    process.env.TBK_API_KEY,
    process.env.TBK_ENV === "PRODUCCION"
      ? Environment.Production
      : Environment.Integration
  )
);

// -----------------------------------------------------------------
// 3. FUNCIONES AUXILIARES (GOOGLE CALENDAR)
// -----------------------------------------------------------------
/**
 * Autoriza el cliente de Google para acceder a la API de Calendar.
 * @returns {Promise<google.auth.OAuth2>} Cliente de autenticación de Google.
 */
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

/**
 * Crea un evento en Google Calendar.
 * @param {string} fechaInicioISO - Fecha y hora de inicio en formato ISO 8601.
 * @param {string} fechaFinISO - Fecha y hora de fin en formato ISO 8601.
 * @param {string} resumen - Resumen/título del evento.
 * @returns {Promise<object|null>} Datos del evento creado o null si falla.
 */
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
    console.log(
      `[CALENDAR] Evento creado exitosamente. ID: ${respuesta.data.id}`
    );
    console.log(`[CALENDAR] Link del evento: ${respuesta.data.htmlLink}`);
    return respuesta.data;
  } catch (calendarError) {
    console.error(
      "[CALENDAR-ERROR] No se pudo crear el evento en Google Calendar:",
      calendarError
    );
    return null;
  }
}

// -----------------------------------------------------------------
// 4. CONTROLADORES DE RUTA
// -----------------------------------------------------------------

/**
 * Inicia una transacción de Webpay Plus y guarda la información temporal de la reserva.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const crearTransaccionInicial = async (req, res) => {
  console.log(
    "\n--- [WEBPAY] INICIO: Solicitud para crear transacción inicial ---"
  );
  try {
    const { monto, returnUrl, reservas } = req.body;
    console.log(
      `[WEBPAY] Datos recibidos: Monto=${monto}, ReturnURL=${returnUrl}`
    );
    console.log(
      `[WEBPAY] Reservas en carrito:`,
      JSON.stringify(reservas, null, 2)
    );

    if (!monto || !returnUrl || !reservas || !reservas.length) {
      console.warn(
        "[VALIDATION-FAIL] Faltan parámetros esenciales en la solicitud."
      );
      return res
        .status(400)
        .json({ error: "Faltan parámetros: monto, returnUrl o reservas." });
    }

    const buyOrder = `orden_compra_${Date.now()}`;
    const sessionId = `sesion_${uuidv4()}`;
    console.log(
      `[WEBPAY] Generando transacción con BuyOrder: ${buyOrder} y SessionID: ${sessionId}`
    );

    const response = await transaction.create(
      buyOrder,
      sessionId,
      monto,
      returnUrl
    );
    console.log(
      `[WEBPAY] Transacción creada en Transbank. Token: ${response.token}`
    );

    console.log("[DB] Intentando crear registro en TemporalReserva...");
    await TemporalReserva.create({
      token: response.token,
      reservas: JSON.stringify(reservas),
      montoTotal: monto,
      clienteId: reservas[0]?.telefonoCliente || null,
      buyOrder: buyOrder, // Guardar buyOrder aquí también es útil para referencia
    });
    console.log("[DB] Registro en TemporalReserva creado exitosamente.");
    console.log("--- [WEBPAY] FIN: Redirigiendo al usuario a Webpay ---");

    res.json({ url: response.url, token: response.token });
  } catch (error) {
    console.error(
      "[FATAL-ERROR] Error fatal en `crearTransaccionInicial`:",
      error
    );
    res.status(500).json({
      mensaje: "Error al iniciar la transacción.",
      error: error.message,
    });
  }
};

/**
 * Confirma una transacción de Webpay Plus y procesa las reservas asociadas.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const confirmarTransaccion = async (req, res) => {
  const token = req.query.token_ws || req.body?.token_ws;
  console.log(
    `\n--- [WEBPAY] INICIO: Solicitud para confirmar transacción con Token: ${token} ---`
  );

  if (!token) {
    console.warn("[VALIDATION-FAIL] No se recibió token de Webpay.");
    return res.redirect(
      `${process.env.FRONTEND_URL}/pago-fallido?error=missing_token`
    );
  }

  let nuevaTransaccion;
  const t = await sequelize.transaction();
  console.log("[DB-TX] Transacción de base de datos iniciada.");

  try {
    console.log("[WEBPAY] Enviando token a Transbank para confirmación...");
    const commitResponse = await transaction.commit(token);
    console.log("[WEBPAY] Respuesta de Transbank recibida:", commitResponse);

    console.log(`[DB] Buscando TemporalReserva con token: ${token}`);
    const temporal = await TemporalReserva.findOne({ where: { token } });

    if (!temporal) {
      await t.rollback();
      console.error(
        "[DB-ERROR] No se encontró una reserva temporal para el token. La transacción será revertida."
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=no_temp_reservations&token=${token}`
      );
    }
    console.log("[DB] TemporalReserva encontrada.");

    console.log("[DB] Creando registro en la tabla Transaccion...");
    nuevaTransaccion = await Transaccion.create(
      {
        tokenTransaccion: token,
        buyOrder: temporal.buyOrder, // Asegúrate de guardar el buyOrder
        montoTotal: temporal.montoTotal,
        estadoPago:
          commitResponse.status === "AUTHORIZED" ? "aprobado" : "rechazado",
        fechaPago: new Date(),
        clienteId: temporal.clienteId,
      },
      { transaction: t }
    );
    console.log(
      `[DB] Registro de Transaccion creado con ID: ${nuevaTransaccion.id} y estado: ${nuevaTransaccion.estadoPago}`
    );

    if (commitResponse.status !== "AUTHORIZED") {
      await t.commit(); // Confirmar la transacción de DB para registrar el fallo
      console.warn(
        `[WEBPAY-FAIL] El pago fue rechazado por Transbank con estado: ${commitResponse.status}.`
      );
      console.log(
        "[DB-TX] Transacción de base de datos confirmada (commit) para registrar el fallo."
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${token}&status=${commitResponse.status}`
      );
    }

    console.log(
      "[SUCCESS] El pago fue autorizado. Iniciando procesamiento de la reserva..."
    );
    const reservasToProcess = JSON.parse(temporal.reservas);
    if (!Array.isArray(reservasToProcess) || reservasToProcess.length === 0) {
      throw new Error("Los datos de la reserva están corruptos o vacíos.");
    }

    for (const reserva of reservasToProcess) {
      console.log(
        `\n[PROCESSING] Procesando reserva para la especialidad: "${reserva.especialidad}"`
      );

      console.log(
        `[DB] Buscando terapeuta con ID: ${reserva.terapeutaId} usando una consulta directa.`
      );
      // Asumiendo que 'terapeutas' es el nombre de la tabla en la DB
      const [terapeutaEncontrado] = await db.sequelize.query(
        `SELECT * FROM terapeutas WHERE id = :terapeutaId LIMIT 1;`,
        {
          replacements: { terapeutaId: reserva.terapeutaId },
          type: db.sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (!terapeutaEncontrado) {
        throw new Error(
          `El terapeuta con ID ${reserva.terapeutaId} no fue encontrado en la base de datos.`
        );
      }
      console.log(`[DB] Terapeuta encontrado: ${terapeutaEncontrado.nombre}`);

      console.log("[DB] Creando registro en la tabla Reserva...");
      await Reserva.create(
        {
          transaccionId: nuevaTransaccion.id,
          clientBookingId: reserva.id || uuidv4(),
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
      console.log("[DB] Registro de Reserva creado exitosamente.");

      console.log(
        `[DB] Actualizando disponibilidad para fecha: ${reserva.fecha}, hora: ${reserva.hora}`
      );
      const disponibilidad = await Disponibilidad.findOne({
        where: {
          terapeutaId: terapeutaEncontrado.id,
          diasDisponibles: reserva.fecha,
        },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (disponibilidad) {
        const horasActuales = disponibilidad.horasDisponibles;
        const nuevasHorasDisponibles = horasActuales.filter(
          (h) => h !== reserva.hora
        );
        if (nuevasHorasDisponibles.length === 0) {
          await disponibilidad.destroy({ transaction: t });
          console.log(
            `[DB] Registro de Disponibilidad para la fecha ${reserva.fecha} eliminado (no quedan horas).`
          );
        } else {
          disponibilidad.horasDisponibles = nuevasHorasDisponibles;
          await disponibilidad.save({ transaction: t });
          console.log(
            `[DB] Horario ${reserva.hora} eliminado del registro de Disponibilidad.`
          );
        }
      } else {
        console.warn(
          `[DB-WARN] No se encontró un registro de disponibilidad para la fecha ${reserva.fecha}. Pudo ser el último horario disponible.`
        );
      }

      console.log(
        `[NOTIFY] Preparando notificación para terapeuta: ${terapeutaEncontrado.nombre}`
      );
      try {
        if (terapeutaEncontrado.email) {
          console.log(
            `[DEBUG-NOTIFY] Raw 'servicios_ofrecidos' from DB:`,
            terapeutaEncontrado.servicios_ofrecidos
          );

          let serviciosOfrecidos = [];
          try {
            if (terapeutaEncontrado.servicios_ofrecidos) {
              serviciosOfrecidos = JSON.parse(
                terapeutaEncontrado.servicios_ofrecidos
              );
            }
          } catch (e) {
            console.error(
              "[NOTIFY-ERROR] Error al parsear `servicios_ofrecidos` del terapeuta:",
              e
            );
          }

          const ofreceServicio =
            Array.isArray(serviciosOfrecidos) &&
            serviciosOfrecidos.some(
              (s) =>
                s.trim().toLowerCase() ===
                reserva.especialidad.trim().toLowerCase()
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
                  <li><strong>Teléfono:</strong> ${
                    reserva.telefonoCliente || "N/A"
                  }</li>
                  <li><strong>Fecha:</strong> ${reserva.fecha || "N/A"}</li>
                  <li><strong>Hora:</strong> ${reserva.hora || "N/A"}</li>
                  <li><strong>Precio:</strong> $${
                    reserva.precio
                      ? reserva.precio.toLocaleString("es-CL")
                      : "N/A"
                  } CLP</li>
                </ul>
                <p>Atentamente,<br>El equipo de Encuentro de Sanación</p>
              `;
            await sendEmail(terapeutaEncontrado.email, subject, htmlContent);
            console.log(
              `[NOTIFY] Notificación por correo enviada a ${terapeutaEncontrado.email}.`
            );
          } else {
            console.warn(
              `[NOTIFY-WARN] El terapeuta no ofrece la especialidad "${reserva.especialidad}". No se enviará correo.`
            );
          }
        } else {
          console.warn(
            "[NOTIFY-WARN] El terapeuta no tiene un email registrado. No se puede notificar."
          );
        }
      } catch (emailError) {
        console.error(
          "[NOTIFY-ERROR] Error general en la lógica de notificación al terapeuta (sendEmail):",
          emailError
        );
      }

      console.log(
        "[CALENDAR] Preparando creación de evento en Google Calendar."
      );
      if (reserva.fecha && reserva.hora) {
        const startDateTime = new Date(`${reserva.fecha}T${reserva.hora}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Asume 1 hora de duración
        if (!isNaN(startDateTime.getTime())) {
          const resumenEvento = `Reserva: ${reserva.especialidad} | Cliente: ${reserva.nombreCliente}`;
          await crearEventoReserva(
            startDateTime.toISOString(),
            endDateTime.toISOString(),
            resumenEvento
          );
        } else {
          console.warn(
            `[CALENDAR-WARN] Fecha u hora inválida para crear evento de calendario: ${reserva.fecha} ${reserva.hora}`
          );
        }
      } else {
        console.warn(
          `[CALENDAR-WARN] Falta fecha u hora para crear evento de calendario para reserva de ${reserva.especialidad}.`
        );
      }
    }

    console.log("[DB] Eliminando registro de TemporalReserva...");
    await TemporalReserva.destroy({ where: { token } });
    console.log("[DB] TemporalReserva eliminada.");

    await t.commit();
    console.log(
      "[DB-TX] Transacción de base de datos confirmada (commit). ¡Flujo completado!"
    );
    console.log("--- [WEBPAY] FIN: Redirigiendo a página de éxito ---");

    return res.redirect(
      `${process.env.FRONTEND_URL}/pago-confirmacion-exito?token=${token}&transactionId=${nuevaTransaccion.id}`
    );
  } catch (error) {
    await t.rollback();
    console.error(
      "[FATAL-ERROR] Error crítico durante la confirmación, la transacción ha sido revertida (rollback).",
      error
    );

    if (nuevaTransaccion) {
      // Si la transacción ya se había creado en DB, actualiza su estado a error
      await Transaccion.update(
        { estadoPago: "error_procesamiento" },
        { where: { id: nuevaTransaccion.id } }
      );
      console.log(
        `[DB] Transacción ${nuevaTransaccion.id} actualizada a estado 'error_procesamiento'.`
      );
    }
    console.log("--- [WEBPAY] FIN: Redirigiendo a página de fallo ---");
    return res.redirect(
      `${process.env.FRONTEND_URL}/pago-fallido?token=${
        token || "n/a"
      }&error=${encodeURIComponent(error.message)}`
    );
  }
}; // <-- Esta es la llave de cierre correcta para confirmarTransaccion

// =================================================================
// NUEVO CONTROLADOR: ANULAR TRANSACCIÓN
// =================================================================

/**
 * Anula una transacción de Webpay Plus (total o parcial) y revierte la disponibilidad si es anulación total.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const anularTransaccion = async (req, res) => {
  // Se espera el token de la transacción y, opcionalmente, el monto a anular
  const { tokenTransaccion, amount } = req.body;
  const t = await sequelize.transaction();
  console.log(
    `\n--- [WEBPAY] INICIO: Solicitud de anulación para Token: ${tokenTransaccion} ---`
  );

  let transaccionOriginal; // Declarar aquí para que sea accesible en el catch

  try {
    if (!tokenTransaccion) {
      console.warn("[VALIDATION-FAIL] Falta el tokenTransaccion para anular.");
      await t.rollback();
      return res
        .status(400)
        .json({ mensaje: "Falta el token de la transacción a anular." });
    }

    // 1. Buscar la transacción original en tu base de datos por el token
    console.log(`[DB] Buscando Transaccion con token: ${tokenTransaccion}`);
    transaccionOriginal = await Transaccion.findOne({
      where: { tokenTransaccion: tokenTransaccion }, // Usar camelCase
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!transaccionOriginal) {
      console.warn(
        `[DB-WARN] Transacción no encontrada para el token: ${tokenTransaccion}`
      );
      await t.rollback();
      return res
        .status(404)
        .json({ mensaje: "Transacción original no encontrada." });
    }

    // Validar que la transacción original esté en un estado que permita anulación
    if (
      transaccionOriginal.estadoPago !== "aprobado" &&
      transaccionOriginal.estadoPago !== "parcialmente_anulado"
    ) {
      // Usar camelCase
      console.warn(
        `[VALIDATION-WARN] Transacción ${tokenTransaccion} no está en estado 'aprobado' o 'parcialmente_anulado'. Estado actual: ${transaccionOriginal.estadoPago}`
      ); // Usar camelCase
      await t.rollback();
      return res.status(400).json({
        mensaje:
          "Solo se pueden anular transacciones con estado 'aprobado' o 'parcialmente_anulado'.",
      });
    }

    // 2. Anular la transacción con Transbank
    const tokenToRefund = transaccionOriginal.tokenTransaccion; // Usar el token guardado (camelCase)
    const originalAmount = transaccionOriginal.montoTotal; // Usar el monto guardado (camelCase)

    if (!tokenToRefund) {
      console.error(
        "[ERROR] No se encontró el tokenTransaccion en la transacción de la DB para anular."
      );
      await t.rollback();
      return res.status(500).json({
        mensaje: "Token de transacción no encontrado en la base de datos.",
      });
    }

    let refundResponse;
    console.log(
      `[WEBPAY] Enviando solicitud de anulación a Transbank para token: ${tokenToRefund}`
    );

    try {
      if (amount !== undefined && amount !== null) {
        // Anulación parcial si se especifica un monto
        if (amount <= 0 || amount > originalAmount) {
          console.warn(
            `[VALIDATION-WARN] Monto de anulación (${amount}) inválido o excede el monto original (${originalAmount}).`
          );
          await t.rollback();
          return res
            .status(400)
            .json({ mensaje: "Monto de anulación inválido." });
        }
        console.log(
          `[WEBPAY] Realizando anulación parcial de ${amount} para token: ${tokenToRefund}`
        );
        refundResponse = await transaction.refund(tokenToRefund, amount);
      } else {
        console.log(
          `[WEBPAY] Realizando anulación total para token: ${tokenToRefund}`
        );
        refundResponse = await transaction.refund(tokenToRefund);
      }
    } catch (transbankError) {
      console.error(
        "[WEBPAY-ERROR] Error al comunicarse con Transbank para anular:",
        transbankError
      );
      await t.rollback();
      return res.status(500).json({
        mensaje:
          "Error al comunicarse con Transbank para anular la transacción.",
        error: transbankError.message,
      });
    }

    console.log(
      "[WEBPAY] Respuesta de Transbank para anulación:",
      refundResponse
    );

    // 3. Actualizar el estado en tu base de datos
    if (refundResponse && refundResponse.type === "REVERSED") {
      const nuevoEstado =
        amount !== undefined && amount !== null
          ? "parcialmente_anulado"
          : "anulado";
      const montoAnuladoActualizado =
        (transaccionOriginal.montoAnulado || 0) + (amount || originalAmount); // Usar camelCase

      await transaccionOriginal.update(
        {
          estadoPago: nuevoEstado, // Usar camelCase
          fechaAnulacion: new Date(), // Usar camelCase
          montoAnulado: montoAnuladoActualizado, // Usar camelCase
        },
        { transaction: t }
      );
      console.log(
        `[DB] Transacción ${tokenTransaccion} actualizada a estado: ${nuevoEstado}`
      );

      // --- 4. Lógica de Reversión de Disponibilidad (Solo si es anulación total) ---
      if (nuevoEstado === "anulado") {
        console.log(
          `[PROCESSING] Iniciando reversión de disponibilidad para las reservas asociadas a la transacción ID: ${transaccionOriginal.id}.`
        );
        const reservasAsociadas = await Reserva.findAll({
          // Usar Reserva
          where: { transaccionId: transaccionOriginal.id }, // Usar camelCase
          transaction: t,
        });

        for (const reserva of reservasAsociadas) {
          const terapeutaId = reserva.terapeutaId; // Usar camelCase
          const fechaReserva = reserva.fecha;
          const horaReserva = reserva.hora;

          console.log(
            `[DB] Buscando disponibilidad para terapeuta ID: ${terapeutaId} en fecha: ${fechaReserva}.`
          );
          let disponibilidad = await Disponibilidad.findOne({
            // Usar Disponibilidad
            where: {
              terapeutaId: terapeutaId, // Usar camelCase
              diasDisponibles: fechaReserva, // Usar camelCase
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (disponibilidad) {
            let horasActuales = disponibilidad.horasDisponibles || []; // Usar camelCase
            // Asegurarse de que horasActuales sea un array
            if (!Array.isArray(horasActuales)) {
              try {
                horasActuales = JSON.parse(horasActuales);
              } catch (e) {
                console.error(
                  "[ERROR] No se pudo parsear horasDisponibles en Disponibilidad para reversión:",
                  horasActuales,
                  e
                );
                horasActuales = []; // Reiniciar a un array vacío si hay un error de parseo
              }
            }
            if (!horasActuales.includes(horaReserva)) {
              horasActuales.push(horaReserva);
              horasActuales.sort(); // Mantener las horas ordenadas
              await disponibilidad.update(
                { horasDisponibles: horasActuales },
                { transaction: t }
              ); // Usar camelCase
              console.log(
                `[DB] Hora ${horaReserva} revertida a Disponibilidad para fecha: ${fechaReserva}.`
              );
            } else {
              console.log(
                `[DB-WARN] Hora ${horaReserva} ya estaba disponible para fecha: ${fechaReserva}. No se requiere acción.`
              );
            }
          } else {
            console.log(
              `[DB] Creando nueva entrada de Disponibilidad para terapeuta ID: ${terapeutaId} en fecha: ${fechaReserva} con hora: ${horaReserva}.`
            );
            await Disponibilidad.create(
              {
                // Usar Disponibilidad
                terapeutaId: terapeutaId, // Usar camelCase
                diasDisponibles: fechaReserva, // Sequelize debería manejar esto si es un tipo de dato de fecha
                horasDisponibles: [horaReserva], // Usar camelCase
              },
              { transaction: t }
            );
          }

          console.log(
            `[NOTIFY] Considerar enviar email de anulación de reserva para: ${reserva.nombreCliente}, Servicio: ${reserva.servicio}, Fecha: ${reserva.fecha}, Hora: ${reserva.hora}`
          );
          // Aquí podrías añadir la lógica para enviar un correo al cliente informando la anulación
        }
      }

      await t.commit();
      console.log(
        "[DB-TX] Transacción de base de datos confirmada (commit) para anulación."
      );
      console.log("--- [WEBPAY] FIN: Anulación exitosa ---");
      return res.status(200).json({
        mensaje: `Transacción ${
          amount ? "parcialmente" : ""
        } anulada exitosamente.`,
        transaccion: transaccionOriginal,
        transbankResponse: refundResponse,
      });
    } else {
      console.error(
        "[WEBPAY-FAIL] Transbank rechazó o falló la anulación:",
        refundResponse
      );
      // Actualizar el estado de la transacción a fallo_anulacion
      await transaccionOriginal.update(
        {
          estadoPago: "fallo_anulacion", // Usar camelCase
        },
        { transaction: t }
      );
      await t.rollback();
      console.log(
        "[DB-TX] Transacción de base de datos revertida (rollback) debido a fallo de anulación."
      );
      console.log("--- [WEBPAY] FIN: Anulación fallida ---");
      return res.status(400).json({
        error: "La anulación de la transacción fue rechazada por Transbank.",
        transbankResponse: refundResponse,
      });
    }
  } catch (error) {
    await t.rollback();
    console.error(
      "[FATAL-ERROR] Error general al anular transacción (catch principal):",
      error
    );

    let redirectErrorType = "internal_server_error";
    let redirectErrorMessage = error.message || "Error desconocido.";

    // Mejorar la categorización de errores si es necesario
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
    }
    // Para errores inesperados, se envía un 500 y se redirige si es posible
    return res.status(500).json({
      mensaje: "Error interno del servidor al intentar anular la transacción.",
      error: redirectErrorMessage,
      type: redirectErrorType,
      token: tokenTransaccion || "n/a",
    });
  }
};

console.log(
  "Tipo de crearTransaccionInicial antes de exportar:",
  typeof crearTransaccionInicial
);
console.log(
  "Tipo de confirmarTransaccion antes de exportar:",
  typeof confirmarTransaccion
);
console.log(
  "Tipo de anularTransaccion antes de exportar:",
  typeof anularTransaccion
);
module.exports = {
  crearTransaccionInicial,
  confirmarTransaccion,
  anularTransaccion,
};
