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
app.use((req, res, next) => {
  console.log(
    `[DEBUG_ROUTE] ${req.method} request to ${req.originalUrl} from ${req.ip}`
  );
  next(); // Pasa al siguiente middleware
});
// Importaciones de Modelos de Base de Datos y Rutas
const db = require("./models");
const webpayRoutes = require("./routes/webpay.routes");
const googleAuthRoutes = require("./routes/googleAuth");

// --- ¡ORDEN DE MIDDLEWARES Y RUTAS - CRÍTICO PARA EL 404! ---

// 1. Middlewares para parsear el cuerpo de la solicitud (JSON y URL-encoded)
//    Estos deben ir PRIMERO en los app.use()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. MIDDLEWARE CORS (DEBE ESTAR AQUÍ, DESPUÉS DE LOS PARSERS PERO ANTES DE LAS RUTAS)
//    Este es el punto más importante para las cabeceras CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL_PROD, // 'https://www.encuentrodesanacion.com'
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permitir explícitamente todos los métodos REST
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras que el frontend puede enviar
    credentials: true, // Permite que el frontend envíe cookies o cabeceras de autorización
  })
);

// 3. RUTAS DE LA API (DEBEN IR DESPUÉS DEL MIDDLEWARE DE CORS)
//    Cualquier app.use() o app.get/post/put/delete debe ir DESPUÉS de cors
app.use("/api/webpay", webpayRoutes); // <-- ¡ESTA ES LA RUTA QUE DEBE MATCHEAR!
app.use("/", googleAuthRoutes); // Asegúrate de que esta ruta no intercepte solicitudes inesperadas

// --- ¡IMPORTANTE! Manejador de 404 (OPCIONAL, pero ayuda a debuggear) ---
// Si la solicitud llega hasta aquí, significa que ninguna ruta anterior la manejó.
app.use((req, res, next) => {
  console.error(`404 Not Found for: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Recurso no encontrado" });
});

// Manejador de errores global (OPCIONAL)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
});

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

db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Base de datos actualizada correctamente");

    // --- BLOQUE DE LOGGING DE RUTAS (ya lo tienes, déjalo aquí) ---
    app._router.stack.forEach(function (middleware) {
      if (middleware.route) {
        // Es una ruta directa
        console.log(
          `[ROUTE_DEBUG] ${Object.keys(middleware.route.methods)
            .join(", ")
            .toUpperCase()} ${middleware.route.path}`
        );
      } else if (middleware.name === "router") {
        // Es un router (como webpayRoutes)
        middleware.handle.stack.forEach(function (handler) {
          if (handler.route) {
            console.log(
              `[ROUTE_DEBUG] ${Object.keys(handler.route.methods)
                .join(", ")
                .toUpperCase()} ${middleware.regexp.source.replace(/\\/g, "")}${
                handler.route.path
              }`
            );
          }
        });
      }
    });
    console.log("------------------------------------------");
    console.log("Rutas de la API cargadas.");
    console.log("------------------------------------------");
    // --- FIN BLOQUE DE LOGGING ---

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    // --- ¡MODIFICACIÓN CRÍTICA AQUÍ: LOGGEAR EL ERROR DIRECTAMENTE! ---
    // Esto es para la línea 148 de server.js que da TypeError: Cannot read properties of undefined (reading 'stack')
    console.error(
      "Error crítico al sincronizar la base de datos y al iniciar el servidor:",
      err
    );
    // No intentes leer 'stack' o 'message' para evitar el TypeError si 'err' es null/undefined.
    // Simplemente loguea el objeto completo.
    // Heroku crasheará la app si hay un error en el startup, que es lo que queremos.
    // --- FIN MODIFICACIÓN CRÍTICA ---
  });
