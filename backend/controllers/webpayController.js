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

const confirmarTransaccion = async (req, res) => {
  const token = req.query.token_ws || req.body?.token_ws;

  console.log("------------------------------------------");
  console.log("Entrando a confirmarTransaccion");
  console.log("req.method:", req.method);
  console.log("req.body:", req.body);
  console.log("req.query:", req.query);
  console.log("Token obtenido:", token);
  console.log("------------------------------------------");

  if (!token) {
    console.warn("Falta token de confirmación en req.body o req.query.");
    return res.redirect(
      `${process.env.FRONTEND_URL}/pago-fallido?error=missing_token`
    );
  }

  let nuevaTransaccion;
  try {
    const commitResponse = await transaction.commit(token);

    const temporal = await TemporalReserva.findOne({ where: { token } });

    if (!temporal) {
      console.warn("TemporalReserva no encontrada para el token:", token);
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?error=no_temp_reservations&token=${token}`
      );
    }

    const montoTotal = temporal.montoTotal;

    nuevaTransaccion = await Transaccion.create({
      tokenTransaccion: token,
      montoTotal: montoTotal,
      estadoPago:
        commitResponse.status === "AUTHORIZED" ? "aprobado" : "rechazado",
      fechaPago: new Date(),
      clienteId: temporal.clienteId,
    });

    if (commitResponse.status === "AUTHORIZED") {
      if (nuevaTransaccion.estadoPago !== "aprobado") {
        await nuevaTransaccion.update({
          estadoPago: "aprobado",
          fechaPago: new Date(),
        });
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
          await nuevaTransaccion.update({
            estadoPago: "fallo_datos_corruptos",
          });
          return res.redirect(
            `${process.env.FRONTEND_URL}/pago-fallido?error=json_parse_error&token=${token}`
          );
        }
      }

      if (!Array.isArray(reservasToProcess) || reservasToProcess.length === 0) {
        console.warn(
          "TemporalReserva encontrada pero 'reservas' no es un array o está vacío después de parsear:",
          reservasToProcess
        );
        await nuevaTransaccion.update({ estadoPago: "fallo_sin_reservas" });
        return res.redirect(
          `${process.env.FRONTEND_URL}/pago-fallido?error=no_valid_reservations&token=${token}`
        );
      }

      let criticalReservationError = false;
      // --- INICIO DE MODIFICACIONES WEB PAY CONTROLLER - VERIFICAR LOGS ---
      // Estos logs te ayudarán a identificar que esta es la versión correcta
      console.log(
        "*************************************************************"
      );
      console.log(
        "*** WEB PAY CONTROLLER: Versión con consulta RAW de Terapeuta ***"
      );
      console.log(
        "*************************************************************"
      );

      for (const reserva of reservasToProcess) {
        if (criticalReservationError) break;

        let errorMessages = [];
        let terapeutaEncontrado = null;

        // ... Tus validaciones de reserva existentes ...
        if (
          typeof reserva.servicio !== "string" ||
          reserva.servicio.trim() === ""
        ) {
          errorMessages.push(`'servicio' inválido.`);
        }
        if (
          typeof reserva.precio !== "number" ||
          isNaN(reserva.precio) ||
          reserva.precio <= 0
        ) {
          errorMessages.push(`'precio' inválido.`);
        }
        if (
          typeof reserva.terapeuta !== "string" ||
          reserva.terapeuta.trim() === ""
        ) {
          errorMessages.push(`'terapeuta' inválido.`);
        }
        if (
          typeof reserva.especialidad !== "string" ||
          reserva.especialidad.trim() === ""
        ) {
          errorMessages.push(`'especialidad' inválida.`);
        }
        if (typeof reserva.fecha !== "string" || reserva.fecha.trim() === "") {
          errorMessages.push(`'fecha' inválida.`);
        }
        if (typeof reserva.hora !== "string" || reserva.hora.trim() === "") {
          errorMessages.push(`'hora' inválida.`);
        }
        if (
          typeof reserva.nombreCliente !== "string" ||
          reserva.nombreCliente.trim() === ""
        ) {
          errorMessages.push(`'nombreCliente' inválido.`);
        }
        if (
          typeof reserva.telefonoCliente !== "string" ||
          reserva.telefonoCliente.trim() === ""
        ) {
          errorMessages.push(`'telefonoCliente' inválido.`);
        }
        if (
          typeof reserva.sesiones !== "number" ||
          isNaN(reserva.sesiones) ||
          reserva.sesiones <= 0
        ) {
          if (reserva.sesiones === undefined || reserva.sesiones === null) {
            reserva.sesiones = 1;
          } else {
            errorMessages.push(`'sesiones' inválida.`);
          }
        }
        if (
          typeof reserva.cantidad !== "number" ||
          isNaN(reserva.cantidad) ||
          reserva.cantidad <= 0
        ) {
          if (reserva.cantidad === undefined || reserva.cantidad === null) {
            reserva.cantidad = 1;
          } else {
            errorMessages.push(`'cantidad' inválida.`);
          }
        }

        if (errorMessages.length > 0) {
          console.error(
            "Error: Datos de reserva inválidos detectados. Detalles:",
            errorMessages,
            "Objeto:",
            reserva
          );
          await nuevaTransaccion.update({ estadoPago: "fallo_datos_reserva" });
          criticalReservationError = true;
          break;
        }

        // --- Bloque para buscar el terapeuta con consulta RAW ---
        const terapeutaNombreNormalizado = reserva.terapeuta.trim();
        let terapeutaRawResult;

        if (reserva.terapeutaId) {
          console.log(
            `[DEBUG CREATERESERVA] Intento 1 (RAW): Buscando terapeuta por ID: ${reserva.terapeutaId}.`
          );
          terapeutaRawResult = await db.sequelize.query(
            `SELECT id, nombre, email, servicios_ofrecidos, created_at, updated_at FROM terapeutas WHERE id = :terapeutaId LIMIT 1;`,
            {
              replacements: { terapeutaId: reserva.terapeutaId },
              type: db.sequelize.QueryTypes.SELECT,
            }
          );
        } else if (terapeutaNombreNormalizado) {
          console.log(
            `[DEBUG CREATERESERVA] Intento 2 (RAW): Buscando terapeuta por nombre: "${terapeutaNombreNormalizado}".`
          );
          terapeutaRawResult = await db.sequelize.query(
            `SELECT id, nombre, email, servicios_ofrecidos, created_at, updated_at FROM terapeutas WHERE nombre = :nombre LIMIT 1;`,
            {
              replacements: { nombre: terapeutaNombreNormalizado },
              type: db.sequelize.QueryTypes.SELECT,
            }
          );
        }

        // Procesar el resultado de la consulta RAW
        terapeutaEncontrado =
          terapeutaRawResult && terapeutaRawResult.length > 0
            ? terapeutaRawResult[0]
            : null;

        // Si el terapeuta fue encontrado por RAW query, parsea servicios_ofrecidos
        if (
          terapeutaEncontrado &&
          typeof terapeutaEncontrado.servicios_ofrecidos === "string"
        ) {
          try {
            terapeutaEncontrado.serviciosOfrecidos = JSON.parse(
              terapeutaEncontrado.servicios_ofrecidos.trim()
            );
          } catch (parseError) {
            console.error(
              "[ERROR NOTIFY] Error parseando serviciosOfrecidos desde RAW query:",
              terapeutaEncontrado.serviciosOfrecidos,
              parseError
            );
            terapeutaEncontrado.serviciosOfrecidos = [];
          }
        } else if (terapeutaEncontrado) {
          // Si la columna está null o no es string, inicialízala
          terapeutaEncontrado.serviciosOfrecidos = [];
        }

        console.log(
          `[DEBUG - webpayController] VERIFICACIÓN FINAL: terapeutaEncontrado es:`,
          terapeutaEncontrado ? terapeutaEncontrado : "NULL o UNDEFINED"
        );

        if (!terapeutaEncontrado) {
          const errorMsg = `Error al crear reserva: Terapeuta "${
            reserva.terapeuta
          }" (ID: ${
            reserva.terapeutaId || "N/A"
          }) NO FUE ENCONTRADO EN LA BASE DE DATOS.`;
          console.error(errorMsg);
          await nuevaTransaccion.update({
            estadoPago: "fallo_terapeuta_no_encontrado",
          });
          criticalReservationError = true;
          break;
        }

        const effectiveClientBookingId = reserva.id || uuidv4();
        const createdReserva = await Reserva.create({
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
          terapeutaId: terapeutaEncontrado.id, // Se usa el ID del terapeuta encontrado
        });

        console.log(
          `Reserva ${reserva.servicio} (ID: ${createdReserva.id}) guardada y asociada a Transaccion ID: ${nuevaTransaccion.id}`
        );

        // --- Lógica de Notificación al Terapeuta ---
        try {
          console.log(
            "[DEBUG NOTIFY] Terapeuta encontrado de la DB (objeto completo para notificación):",
            terapeutaEncontrado ? terapeutaEncontrado : null
          );

          if (terapeutaEncontrado && terapeutaEncontrado.email) {
            // Asegúrate de usar directamente el array que ya creamos en terapeutaEncontrado
            // y que sabemos que está correctamente parseado a un array.
            let serviciosOfrecidosArray =
              terapeutaEncontrado.serviciosOfrecidos || [];

            // NO NECESITAS LA SIGUIENTE SECCIÓN, YA QUE SABEMOS QUE ES UN ARRAY AHORA:
            // if (!Array.isArray(serviciosOfrecidosArray)) {
            //   console.warn(
            //     `[DEBUG NOTIFY] serviciosOfrecidosArray no es un array después de parseo RAW:`,
            //     serviciosOfrecidosArray
            //   );
            //   serviciosOfrecidosArray = [];
            // }

            // Uso de reserva.especialidad para la comparación
            const servicioReservaNormalizado = reserva.especialidad.trim();

            console.log(
              `[DEBUG NOTIFY] --- INICIANDO COMPARACIÓN DE SERVICIO ---`
            );
            console.log(
              `[DEBUG NOTIFY] Especialidad de la reserva (normalizado - frontend): "${servicioReservaNormalizado}" (Length: ${servicioReservaNormalizado.length})`
            );
            console.log(
              `[DEBUG NOTIFY] Especialidad de la reserva (lowercase - frontend): "${servicioReservaNormalizado.toLowerCase()}"`
            );

            let foundMatch = false;
            const ofreceServicio = serviciosOfrecidosArray.some((s) => {
              const servicioOfrecidoNormalizado = s.trim();

              console.log(
                `[DEBUG NOTIFY]   - Comparando con servicio ofrecido (de DB, normalizado): "${servicioOfrecidoNormalizado}" (Length: ${servicioOfrecidoNormalizado.length})`
              );
              console.log(
                `[DEBUG NOTIFY]   - Comparando con servicio ofrecido (de DB, normalizado, lowercase): "${servicioOfrecidoNormalizado.toLowerCase()}"`
              );

              const isMatch =
                servicioOfrecidoNormalizado.toLowerCase() ===
                servicioReservaNormalizado.toLowerCase();
              if (isMatch) {
                foundMatch = true;
              }
              return isMatch;
            });

            console.log(`[DEBUG NOTIFY] ¿Hubo coincidencia?: ${foundMatch}`);
            console.log(
              `[DEBUG NOTIFY] Contenido de serviciosOfrecidosArray desde DB:`,
              serviciosOfrecidosArray // Esto ahora debería mostrar el array completo
            );
            console.log(`[DEBUG NOTIFY] --- FIN COMPARACIÓN DE SERVICIO ---`);

            if (ofreceServicio) {
              const subject = `¡Nueva Reserva Confirmada para ${reserva.especialidad}!`;
              const htmlContent = `
                <p>Hola ${terapeutaEncontrado.nombre || "Terapeuta"},</p>
                <p>¡Se ha confirmado una nueva reserva para tu servicio!</p>
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
                `[DEBUG NOTIFY] Notificación por correo enviada a ${terapeutaEncontrado.nombre} (${terapeutaEncontrado.email})`
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

        // --- Lógica de Creación de Evento en Google Calendar ---
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
      } // Fin del bucle for

      if (criticalReservationError) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/pago-fallido?error=terapeuta_no_encontrado_en_reserva&token=${token}`
        );
      } else {
        await TemporalReserva.destroy({ where: { token } });
        console.log("TemporalReserva eliminada.");
        return res.redirect(
          `${process.env.FRONTEND_URL}/pago-confirmacion-exito?token=${token}&transactionId=${nuevaTransaccion.id}`
        );
      }
    } else {
      console.warn("Pago no autorizado o fallido:", commitResponse);
      if (nuevaTransaccion.estadoPago !== "rechazado") {
        await nuevaTransaccion.update({
          estadoPago: "rechazado",
          fechaPago: new Date(),
        });
        console.log("Transaccion actualizada a RECHAZADO.");
      }
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${token}&status=${
          commitResponse.status
        }&code=${commitResponse.response_code || ""}`
      );
    }
  } catch (error) {
    console.error("Error general al confirmar transacción:", error);
    let errorMessage = error.message || "Error desconocido.";

    if (nuevaTransaccion) {
      try {
        await nuevaTransaccion.update({
          estadoPago: "error_procesamiento",
          fechaPago: new Date(),
        });
        console.log("Transacción en DB actualizada a 'error_procesamiento'.");
      } catch (updateError) {
        console.error(
          "Error al intentar actualizar el estado de la transacción a 'error_procesamiento':",
          updateError
        );
      }
    } else if (token) {
      try {
        const transaccionEnDB = await Transaccion.findOne({
          where: { tokenTransaccion: token },
        });
        if (transaccionEnDB) {
          await transaccionEnDB.update({
            estadoPago: "error_procesamiento",
            fechaPago: new Date(),
          });
          console.log(
            "Transacción encontrada por token y actualizada a 'error_procesamiento'."
          );
        }
      } catch (searchUpdateError) {
        console.error(
          "Error al buscar/actualizar transacción por token en caso de error:",
          searchUpdateError
        );
      }
    }

    if (error.constructor && error.constructor.name === "TransbankError") {
      console.error("Detalles del error de Transbank:", errorMessage);
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          token || "n/a"
        }&error=${encodeURIComponent(errorMessage)}&type=transbank_error`
      );
    } else if (error.name === "SequelizeValidationError") {
      console.error(
        "Detalles del error de validación de Sequelize:",
        error.errors.map((e) => e.message).join(", ")
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          token || "n/a"
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
          token || "n/a"
        }&error=${encodeURIComponent(
          "Error de clave única: " +
            error.errors.map((e) => e.message).join(", ")
        )}&type=unique_constraint_error`
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/pago-fallido?token=${
          token || "n/a"
        }&error=${encodeURIComponent(errorMessage)}&type=internal_server_error`
      );
    }
  }
};

module.exports = {
  crearTransaccionInicial,
  confirmarTransaccion,
};
