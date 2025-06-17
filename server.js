// 1. Cargar variables de entorno al inicio y depurar su carga
// --- ¡ESTE BLOQUE DEBE ESTAR ASÍ! ---
if (process.env.NODE_ENV !== "production") {
  // Solo cargar dotenv en desarrollo
  require("dotenv").config();
  console.log(".env cargado correctamente (solo en desarrollo)."); // Log para desarrollo
} else {
  // Este log solo aparece en producción. Las variables ya vienen de Heroku Config Vars.
  console.log(
    "Modo producción: variables de entorno cargadas desde el ambiente de Heroku."
  );
}
// --- FIN DEL BLOQUE CONDICIONAL DOTENV ---

// --- TODAS LAS IMPORTACIONES Y DECLARACIONES DE EXPRESS Y LA APLICACIÓN DEBEN ESTAR AQUÍ ---
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express(); // LA APLICACIÓN EXPRESS SIEMPRE SE DEFINE

// --- Importaciones de Modelos de Base de Datos ---
const db = require("./models"); // DB SIEMPRE SE IMPORTA

// --- Importaciones de Rutas ---
const webpayRoutes = require("./routes/webpay.routes");
const googleAuthRoutes = require("./routes/googleAuth"); // ESTA RUTA DEBE ESTAR FUERA DE CONDICIONALES

// --- Middlewares Globales ---
app.use(
  cors({
    origin: [process.env.FRONTEND_URL_PROD],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas de la API ---
app.use("/api/webpay", webpayRoutes);
app.use("/", googleAuthRoutes); // Asegúrate de que este archivo no tenga problemas internos

app.post("/api/enviar-reserva", (req, res) => {
  console.log("Reserva recibida:", req.body);
  res.status(200).send("Reserva recibida correctamente");
});

// Crear reserva autenticada (ejemplo de ruta directa)
app.post("/api/reservar", async (req, res) => {
  try {
    const { fechaInicio, fechaFin, usuarioId, servicio } = req.body;

    // --- ACCESO CORREGIDO AL MODELO RESERVA ---
    const reservaExistente = await db.Reserva.findOne({
      where: { fechaInicio, fechaFin, estado: "reservado" },
    });

    if (reservaExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ese horario ya está reservado." });
    }

    // --- ACCESO CORREGIDO AL MODELO RESERVA ---
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
    // --- ACCESO CORREGIDO AL MODELO TERAPEUTA ---
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
    // --- ACCESO CORREGIDO AL MODELO RESERVA ---
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
    // --- ACCESO CORREGIDO AL MODELO TERAPEUTA ---
    const nuevo = await db.Terapeuta.create({ nombre, email, servicio });
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error al agregar terapeuta:", err);
    res.status(500).send("Error al guardar terapeuta");
  }
});

// --- Sincronizar base de datos e iniciar servidor ---
db.sequelize
  .sync({ alter: true }) // Mantenemos alter: true para producción
  .then(async () => {
    console.log("Base de datos actualizada correctamente");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
