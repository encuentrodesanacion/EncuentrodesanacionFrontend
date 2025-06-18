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

// --- ¡NUEVO LOG DE DEBUG DE CADA SOLICITUD! (Moverlo a la primera línea después de app = express()) ---
// Este middleware se ejecutará para CADA solicitud que llegue a Express, independientemente del método.
// app.use((req, res, next) => {
//   console.log(
//     `[VERY_EARLY_HTTP_REQUEST] Method: ${req.method}, Path: ${
//       req.originalUrl
//     }, Body: ${JSON.stringify(req.body)}`
//   );
//   next(); // Pasa al siguiente middleware
// });
// // --- FIN NUEVO LOG ---
// // Importaciones de Modelos de Base de Datos y Rutas
const db = require("./models");
// // const webpayRoutes = require("./routes/webpay.routes");
// // const googleAuthRoutes = require("./routes/googleAuth");

// // --- ¡ORDEN DE MIDDLEWARES Y RUTAS - CRÍTICO PARA EL 404! ---

// // 1. Middlewares para parsear el cuerpo de la solicitud (JSON y URL-encoded)
// //    Estos deben ir PRIMERO en los app.use()
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 2. MIDDLEWARE CORS (DEBE ESTAR AQUÍ, DESPUÉS DE LOS PARSERS PERO ANTES DE LAS RUTAS)
// //    Este es el punto más importante para las cabeceras CORS

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL_PROD, // 'https://www.encuentrodesanacion.com'
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permitir explícitamente todos los métodos REST
//     allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras que el frontend puede enviar
//     credentials: true, // Permite que el frontend envíe cookies o cabeceras de autorización
//   })
// );

// // 3. RUTAS DE LA API (DEBEN IR DESPUÉS DEL MIDDLEWARE DE CORS)
// //    Cualquier app.use() o app.get/post/put/delete debe ir DESPUÉS de cors
// // app.use("/api/webpay", webpayRoutes); // <-- ¡ESTA ES LA RUTA QUE DEBE MATCHEAR!
// // app.use("/", googleAuthRoutes); // Asegúrate de que esta ruta no intercepte solicitudes inesperadas

// app.all("*", (req, res) => {
//   console.warn(
//     `[CATCH_ALL_DEBUG] Solicitud no manejada por rutas: ${req.method} ${req.originalUrl}`
//   );
//   console.warn(`[CATCH_ALL_DEBUG] Headers: ${JSON.stringify(req.headers)}`);
//   console.warn(`[CATCH_ALL_DEBUG] Body (raw): ${JSON.stringify(req.body)}`);
//   res
//     .status(404)
//     .send("Ruta no encontrada por la aplicación. Debugging en curso.");
// });
// // --- ¡MANEJADOR DE 404 (DESPUÉS DE TODAS LAS RUTAS)! ---
// app.use((req, res, next) => {
//   console.error(
//     `[HANDLER_404] 404 Not Found for: ${req.method} ${req.originalUrl}. Ninguna ruta manejó esta solicitud.`
//   );
//   res.status(404).json({
//     message:
//       "Recurso no encontrado. La ruta no existe o el método no está permitido.",
//   });
// });
// // /// Manejador de errores global
// app.use((err, req, res, next) => {
//   console.error("[UNHANDLED_ERROR]:", err.stack || err.message || err);
//   res
//     .status(500)
//     .json({ message: "Error interno del servidor", error: err.message });
// });

// // app.post("/api/enviar-reserva", (req, res) => {
// //   console.log("Reserva recibida:", req.body);
// //   res.status(200).send("Reserva recibida correctamente");
// // });

// // Crear reserva autenticada (ejemplo de ruta directa)
// // app.post("/api/reservar", async (req, res) => {
// //   try {
// //     const { fechaInicio, fechaFin, usuarioId, servicio } = req.body;

// // --- ACCESO CORREGIDO AL MODELO RESERVA ---
// // const reservaExistente = await db.Reserva.findOne({
// //   where: { fechaInicio, fechaFin, estado: "reservado" },
// // });

// // if (reservaExistente) {
// //   return res
// //     .status(400)
// //     .json({ mensaje: "Ese horario ya está reservado." });
// // }

// // --- ACCESO CORREGIDO AL MODELO RESERVA ---
// // await db.Reserva.create({
// //   usuarioId,
// //   servicio,
// //   fechaInicio,
// //   fechaFin,
// //   estado: "reservado",
// // });

// //     res.status(200).json({ mensaje: "Reserva creada y hora bloqueada" });
// //   } catch (error) {
// //     console.error("Error creando reserva:", error);
// //     res
// //       .status(500)
// //       .json({ mensaje: "Error al crear la reserva", error: error.message });
// //   }
// // });

// // Obtener terapeutas
// // app.get("/api/terapeutas", async (req, res) => {
// //   try {
// //     // --- ACCESO CORREGIDO AL MODELO TERAPEUTA ---
// //     const terapeutas = await db.Terapeuta.findAll();
// //     res.json(terapeutas);
// //   } catch (error) {
// //     console.error("Error al obtener los terapeutas:", error);
// //     res.status(500).json({ error: "Error al obtener los terapeutas" });
// //   }
// // });
// // // Obtener reservas
// // app.get("/api/reservas", async (req, res) => {
// //   try {
// //     // --- ACCESO CORREGIDO AL MODELO RESERVA ---
// //     const reservas = await db.Reserva.findAll();
// //     res.json(reservas);
// //   } catch (error) {
// //     console.error("Error al obtener las reservas:", error);
// //     res.status(500).json({ error: "Error al obtener las reservas" });
// //   }
// // });

// // // Crear terapeuta
// // app.post("/api/terapeutas", async (req, res) => {
// //   const { nombre, email, servicio } = req.body;
// //   try {
// //     // --- ACCESO CORREGIDO AL MODELO TERAPEUTA ---
// //     const nuevo = await db.Terapeuta.create({ nombre, email, servicio });
// //     res.status(201).json(nuevo);
// //   } catch (err) {
// //     console.error("Error al agregar terapeuta:", err);
// //     res.status(500).send("Error al guardar terapeuta");
// //   }
// // });
// //Prueba

db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Base de datos actualizada correctamente");
    // //NUEVO CODIGO
    const PORT = process.env.PORT || 3000;
    app.get("/", (req, res) => {
      res.send("Hello from Heroku backend! (Barebones App - DB disabled)");
    });
    app.listen(PORT, () => {
      console.log(`Minimal server listening on port ${PORT}`);
      console.log("Node.js version:", process.version);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("--- DB INITIALIZATION DISABLED ---"); // Mensaje claro
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
// --- FIN NUEVO CÓDIGO ---

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     // <--- El logging de rutas se moverá DENTRO de esta función de callback
//     console.log(`Servidor escuchando en puerto ${PORT}`);

//     // --- ¡NUEVO LUGAR PARA EL BLOQUE DE LOGGING DE RUTAS! ---
//     // Se ejecuta solo UNA VEZ cuando el servidor comienza a escuchar.
//     // Y se asegura de que app._router exista antes de intentar acceder a .stack
//     // if (app && app._router && app._router.stack) {
//     // Agrega verificación de app y _router
//     // app._router.stack.forEach(function (middleware) {
//     //   if (middleware.route) {
//     // Es una ruta directa
//     //   console.log(
//     //     `[ROUTE_DEBUG] ${Object.keys(middleware.route.methods)
//     //       .join(", ")
//     //       .toUpperCase()} ${middleware.route.path}`
//     //   );
//     // } else if (middleware.name === "router") {
//     // Es un router (como webpayRoutes)
//     //       middleware.handle.stack.forEach(function (handler) {
//     //         if (handler.route) {
//     //           console.log(
//     //             `[ROUTE_DEBUG] ${Object.keys(handler.route.methods)
//     //               .join(", ")
//     //               .toUpperCase()} ${middleware.regexp.source.replace(
//     //               /\\/g,
//     //               ""
//     //             )}${handler.route.path}`
//     //           );
//     //         }
//     //       });
//     //     }
//     //   });
//     //   console.log("------------------------------------------");
//     //   console.log("Rutas de la API cargadas y verificadas.");
//     //   console.log("------------------------------------------");
//     // } else {
//     //   console.warn(
//     //     "[ROUTE_DEBUG] No se pudo acceder a app._router.stack para loggear rutas."
//     //   );
//     // }
//     // --- FIN NUEVO LUGAR PARA EL BLOQUE DE LOGGING ---
//   });
// })
// .catch((err) => {
//   // Ya tienes el catch seguro aquí que loggea el error y fuerza la salida.
//   console.error(
//     "Error crítico al sincronizar la base de datos y al iniciar el servidor."
//   );
//   if (err) {
//     console.error("Detalles del objeto de error (si existe):", String(err));
//   } else {
//     console.error("El objeto de error es nulo o indefinido.");
//   }
//   process.exit(1);
// });
