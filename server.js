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
const path = require("path");

const app = express(); // Inicialización de Express

// Declarar PORT globalmente
const PORT = process.env.PORT || 3000; // <--- ¡ESTA ES LA ÚNICA DECLARACIÓN DE PORT!

// Importaciones de Modelos de Base de Datos y Rutas
const db = require("./models"); // Mantener descomentado
const webpayRoutes = require("./routes/webpay.routes"); // Mantener descomentado
const googleAuthRoutes = require("./routes/googleAuth"); // Descomentar solo si lo necesitas, o mantenerlo comentado

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL_PROD,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rutas de la API
// Asegúrate de que solo se usen una vez y que los patrones sean correctos
app.use("/api/webpay", webpayRoutes);
app.use("/", googleAuthRoutes); // Descomentar solo si lo necesitas

// --- Manejador de 404 (Mantenerlo al final de todas las rutas) ---
app.use((req, res, next) => {
  console.error(
    `[HANDLER_404] 404 Not Found for: ${req.method} ${req.originalUrl}. Ninguna ruta manejó esta solicitud.`
  );
  res.status(404).json({
    message:
      "Recurso no encontrado. La ruta no existe o el método no está permitido.",
  });
});

// Manejador de errores global (Mantenerlo al final de todo)
app.use((err, req, res, next) => {
  console.error("[UNHANDLED_ERROR]:", err.stack || err.message || err);
  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
});

// Sincronización de DB e inicio del servidor (¡EL BLOQUE CORRECTO Y ÚNICO!)
db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Base de datos actualizada correctamente.");
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log("Node.js version:", process.version);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("--- TODAS LAS RUTAS Y DB HABILITADAS ---"); // Mensaje claro
    });
  })
  .catch((err) => {
    console.error(
      "Error crítico al sincronizar la base de datos y al iniciar el servidor."
    );
    if (err) {
      console.error("Detalles del objeto de error (si existe):", String(err));
    } else {
      console.error("El objeto de error es nulo o indefinido.");
    }
    process.exit(1);
  });
