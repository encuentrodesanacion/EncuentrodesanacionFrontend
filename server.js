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
const path = require("path"); // Mantener por si acaso alguna dependencia lo necesita

const app = express(); // Inicialización de Express

// Declarar PORT globalmente y UNA SOLA VEZ
const PORT = process.env.PORT || 3000;

// Importaciones de Modelos de Base de Datos y Rutas
const db = require("./models"); // Importación de la DB
const webpayRoutes = require("./routes/webpay.routes"); // Importación de tus rutas de Webpay
// const googleAuthRoutes = require("./routes/googleAuth"); // Descomentar si usas Google Auth más tarde

// Middlewares globales (mantenerlos aquí y descomentados)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL_PROD, // Asegúrate de que esta variable de entorno esté correcta en Heroku
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- RUTAS DE LA API (solo habilitar las que necesites una por una) ---
// La ruta principal de webpay
app.use("/api/webpay", webpayRoutes); // Descomentar para habilitar tus rutas de webpay

// app.use("/", googleAuthRoutes); // Descomentar solo si lo necesitas

// --- Rutas Directas (Si tenías alguna aquí, descomentar o mover a sus routers si aplica) ---
// Ejemplo de cómo quedaría una ruta directa si la necesitas, ANTES del manejador de 404
/*
app.post("/api/enviar-reserva", (req, res) => {
  console.log("Reserva recibida:", req.body);
  res.status(200).send("Reserva recibida correctamente");
});
*/

// --- Manejador de 404 (Debe ser el ÚLTIMO app.use antes del manejador de errores) ---
app.use((req, res, next) => {
  console.error(
    `[HANDLER_404] 404 Not Found for: ${req.method} ${req.originalUrl}. Ninguna ruta manejó esta solicitud.`
  );
  res.status(404).json({
    message:
      "Recurso no encontrado. La ruta no existe o el método no está permitido.",
  });
});

// --- Manejador de errores global (Debe ser el ÚLTIMO app.use de todos) ---
app.use((err, req, res, next) => {
  console.error("[UNHANDLED_ERROR]:", err.stack || err.message || err);
  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
});

// --- Sincronización de DB e inicio del servidor (¡EL BLOQUE ÚNICO Y CORRECTO!) ---
db.sequelize
  .sync({ alter: true }) // Usa { alter: true } para actualizar tablas existentes sin borrar datos
  .then(async () => {
    console.log("Base de datos actualizada correctamente.");
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log("Node.js version:", process.version);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("--- SERVIDOR LISTO Y RUTAS CARGADAS ---"); // Mensaje final de éxito
    });
  })
  .catch((err) => {
    // Este catch manejará cualquier error durante la sincronización de la DB
    console.error(
      "Error crítico al sincronizar la base de datos y al iniciar el servidor."
    );
    if (err) {
      console.error("Detalles del objeto de error (si existe):", String(err));
    } else {
      console.error("El objeto de error es nulo o indefinido.");
    }
    process.exit(1); // Forzar la salida con un código de error para Heroku
  });
