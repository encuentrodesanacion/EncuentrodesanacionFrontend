// backend/server.js

// Carga de variables de entorno (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
} else {
  console.log(
    "Modo producción: variables de entorno cargadas desde el ambiente de Heroku."
  );
}

// Dependencias principales
const express = require("express");
const cors = require("cors");
const path = require("path"); // Aunque path no se usa directamente en esta parte, se mantiene

const app = express(); // Inicialización de Express

// Importaciones de Modelos de Base de Datos y Rutas
const db = require("./models");
const webpayRoutes = require("./routes/webpay.routes");
const googleAuthRoutes = require("./routes/googleAuth"); // Asegúrate de que esta ruta sea correcta

// --- ¡ORDEN DE MIDDLEWARES CRÍTICO PARA CORS! ---
// 1. Middlewares para parsear el cuerpo de la solicitud (Express.json y urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. MIDDLEWARE CORS (DEBE ESTAR AQUÍ, DESPUÉS DE LOS PARSERS PERO ANTES DE LAS RUTAS)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL_PROD],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 3. Rutas de la API (DEBEN IR DESPUÉS DEL MIDDLEWARE DE CORS)
app.use("/api/webpay", webpayRoutes);
app.use("/", googleAuthRoutes);

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

// Sincronización de DB e inicio del servidor
db.sequelize
  .sync({ alter: true })
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
