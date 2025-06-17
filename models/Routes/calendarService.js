const { google } = require("googleapis");
const path = require("path");
const KEYFILEPATH = path.join(
  __dirname,
  "eastern-adapter-460517-n2-92b808b48f6c.json"
);

// Autenticación con cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

async function crearEvento({ summary, description, startTime, endTime }) {
  const client = await auth.getClient();
  const calendar = google.calendar({ version: "v3", auth: client });

  const event = {
    summary,
    description,
    start: {
      dateTime: startTime, // formato: '2025-05-22T15:00:00-04:00'
      timeZone: "America/Santiago",
    },
    end: {
      dateTime: endTime,
      timeZone: "America/Santiago",
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary", // o el ID de tu calendario si usas uno compartido
    resource: event,
  });

  console.log("✅ Evento creado: ", response.data.htmlLink);
  return response.data;
}

module.exports = { crearEvento };
