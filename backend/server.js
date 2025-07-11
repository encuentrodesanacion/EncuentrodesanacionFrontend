// backend/server.js

// 1. Cargar variables de entorno al inicio y depurar su carga
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  const result = dotenv.config();

  if (result.error) {
    console.error("Error al cargar .env:", result.error);
  } else {
    // console.log(".env cargado correctamente. Variables cargadas:", result.parsed); // Comentar en producción
  }
}
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// --- Importaciones de Modelos de Base de Datos ---
const db = require("./models");
const disponibilidadRoutes = require("./routes/disponibilidadRoutes");
// --- Importaciones de Rutas ---
const webpayRoutes = require("./routes/webpay.routes");
const marketingRoutes = require("./routes/marketing.routes");
const googleAuthRoutes = require("./routes/googleAuth"); // Asegúrate de que esta ruta sea correcta

// --- Middlewares Globales ---
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Para tu desarrollo local
      "https://www.encuentrodesanacion.com", // Tu dominio principal en Netlify (con HTTPS)
      "https://encuentrodesanacion.com", // Opcional: si tu sitio también resuelve sin 'www'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas de la API ---
app.use("/api/webpay", webpayRoutes);
app.use("/", googleAuthRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/disponibilidades", disponibilidadRoutes);

// Crear reserva autenticada (ejemplo de ruta directa) - Asegúrate de que esto siga siendo relevante
app.post("/api/reservar", async (req, res) => {
  try {
    const { fechaInicio, fechaFin, usuarioId, servicio } = req.body;

    const reservaExistente = await db.Reserva.findOne({
      where: { fechaInicio, fechaFin, estado: "reservado" },
    });

    if (reservaExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ese horario ya está reservado." });
    }

    await db.Reserva.create({
      usuarioId,
      servicio,
      fechaInicio,
      fechaFin,
      estado: "reservado",
    });

    res.status(200).json({ mensaje: "Reserva creada y hora bloqueada" });
  } catch (error) {
    console.error("Error creando reserva:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear la reserva", error: error.message });
  }
});

// Obtener terapeutas
app.get("/api/terapeutas", async (req, res) => {
  try {
    const terapeutas = await db.Terapeuta.findAll();
    res.json(terapeutas);
  } catch (error) {
    console.error("Error al obtener los terapeutas:", error);
    res.status(500).json({ error: "Error al obtener los terapeutas" });
  }
});
// Obtener reservas
app.get("/api/reservas", async (req, res) => {
  try {
    const reservas = await db.Reserva.findAll();
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
});

// Crear terapeuta
app.post("/api/terapeutas", async (req, res) => {
  const { nombre, email, servicio } = req.body;
  try {
    const nuevo = await db.Terapeuta.create({ nombre, email, servicio });
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error al agregar terapeuta:", err);
    res.status(500).send("Error al guardar terapeuta");
  }
});

// --- Sincronizar base de datos e iniciar servidor ---
// ¡Importante! Para producción, se recomienda ejecutar 'npx sequelize db:migrate' manualmente.
// Si usas 'alter: true' en producción, puede haber riesgos de datos.
db.sequelize
  .sync() // <--- Considera remover o cambiar esto para producción a db:migrate manual
  .then(async () => {
    console.log("Base de datos actualizada correctamente.");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
