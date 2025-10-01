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
const webpayController = require("./controllers/webpayController");
const comentarioController = require("./controllers/comentarioController");
// --- Middlewares Globales ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", // Para tu desarrollo local
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
app.post("/api/reservar-directa", webpayController.crearReservaDirecta);
app.post("/api/comentarios", comentarioController.crearComentario);

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
  .authenticate() // Solo prueba la conexión (no crea ni altera tablas)
  .then(async () => {
    console.log(
      "Conexión a la base de datos establecida correctamente (Servidor iniciado en modo 'Solo Conexión')."
    );

    // Lógica de DEBUG para mostrar disponibilidades (se mantiene aquí)
    try {
      const allDisponibilidades = await db.Disponibilidad.findAll({
        attributes: [
          "id",
          "terapeutaId",
          "diasDisponibles",
          "especialidad_servicio",
          "horasDisponibles",
          "estado",
        ],
        raw: true, // Obtener datos puros sin instancias de Sequelize para depurar
      });
      console.log(
        "\nDEBUG BACKEND: Datos 'raw' de la tabla Disponibilidades al inicio:"
      );
      allDisponibilidades.forEach((disp) => {
        console.log(
          `  - ID: ${disp.id}, terapeutaId: ${disp.terapeutaId}, dias_disponibles: ${disp.diasDisponibles}, horas_disponibles: ${disp.horasDisponibles}`
        );
      });
    } catch (debugErr) {
      console.warn(
        "WARNING DEBUG: Fallo al leer disponibilidades (La tabla debe ser gestionada con migraciones):",
        debugErr.message // Usar solo el mensaje para evitar logs excesivos
      );
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos: ", err);
    process.exit(1); // Detener la aplicación si la conexión falla
  });
