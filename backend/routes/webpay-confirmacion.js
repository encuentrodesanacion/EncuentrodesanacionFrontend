const { WebpayPlus, Options, Environment } = require("transbank-sdk");
const Reserva = require("./models/Reserva"); // Modelo Sequelize
const { google } = require("googleapis");
const path = require("path");

// Configurar acceso a Google Calendar
const calendar = google.calendar("v3");
//aas

async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(
      __dirname,
      "models",
      "Routes",
      "eastern-adapter-460517-n2-92b808b48f6c.json"
    ),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return await auth.getClient();
}

async function crearEventoReserva(fechaInicioISO, fechaFinISO, resumen) {
  const authClient = await authorize();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  const evento = {
    summary: resumen,
    start: { dateTime: fechaInicioISO },
    end: { dateTime: fechaFinISO },
  };

  const respuesta = await calendar.events.insert({
    auth: authClient,
    calendarId,
    requestBody: evento,
  });

  return respuesta.data;
}

// Ruta que confirma el pago y crea la reserva
app.post("/api/webpay-confirmacion", async (req, res) => {
  const { token, reservaInfo } = req.body;

  if (!token) return res.status(400).json({ mensaje: "Falta token" });

  try {
    const transaction = new WebpayPlus.Transaction(
      new Options(
        process.env.TBK_COMMERCE_CODE,
        process.env.TBK_API_KEY_ID || "default",
        process.env.TBK_API_KEY,
        Environment.Integration
      )
    );

    const respuesta = await transaction.commit(token);

    if (respuesta.status === "AUTHORIZED") {
      let evento = null;

      if (reservaInfo) {
        evento = await crearEventoReserva(
          reservaInfo.fechaInicio,
          reservaInfo.fechaFin,
          `Reserva de ${reservaInfo.servicio}`
        );

        await Reserva.create({
          usuarioId: reservaInfo.usuarioId,
          servicio: reservaInfo.servicio,
          fechaInicio: reservaInfo.fechaInicio,
          fechaFin: reservaInfo.fechaFin,
          googleEventId: evento.id,
          estado: "reservado",
        });
      }

      return res.status(200).json({
        mensaje: "Pago exitoso y reserva creada",
        datosPago: respuesta,
        token_ws: token,
        evento,
      });
    } else {
      return res.status(400).json({
        mensaje: "Pago no autorizado",
        datosPago: respuesta,
      });
    }
  } catch (error) {
    console.error("Error al confirmar transacción:", error);
    return res.status(500).json({
      mensaje: "Error al confirmar el pago",
      error: error.message,
    });
  }
});
