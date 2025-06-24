// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// NO CARGAREMOS config.json en producción para la DB.
// Asumimos que DATABASE_URL siempre estará disponible en Heroku.
let sequelize;
if (process.env.DATABASE_URL) {
  // <-- ¡IMPORTANTE! Usar DATABASE_URL directamente
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres", // Especificar directamente el dialecto
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Para Heroku PostgreSQL
      },
    },
  });
} else {
  // Solo cargar config.json y usar sus propiedades en desarrollo o si DATABASE_URL no existe
  let config;
  try {
    config = require(path.resolve(__dirname, "..", "config", "config.json"))[
      env
    ];
    // Si estás aquí, pero aún no se usa env_variable, usa las propiedades directas
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: false,
      }
    );
  } catch (e) {
    console.error(
      `Error al cargar la configuración de DB desde config.json para el entorno ${env}:`,
      e
    );
    throw new Error(
      `Fallo crítico: No se pudo cargar la configuración de la base de datos o DATABASE_URL no está definida.`
    );
  }
}

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes;

// --- Definir Asociaciones ---
// Asegúrate de que db.Transaccion, db.Reserva, db.Terapeuta existan antes de definir asociaciones
if (db.Transaccion && db.Reserva) {
  db.Transaccion.hasMany(db.Reserva, {
    foreignKey: "transaccionId",
    as: "reservasAsociadas",
    onDelete: "CASCADE",
  });
  db.Reserva.belongsTo(db.Transaccion, {
    foreignKey: "transaccionId",
    as: "transaccion",
  });
}

if (db.Reserva && db.Terapeuta) {
  db.Reserva.belongsTo(db.Terapeuta, {
    foreignKey: "terapeutaId",
    as: "terapeutaData",
  });
}

module.exports = db;
