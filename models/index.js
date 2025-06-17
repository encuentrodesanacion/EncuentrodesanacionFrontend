// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// --- ¡MODIFICACIÓN CLAVE AQUÍ! ---
// Asegurarse de que el config.json se lea correctamente, incluso en producción
let configPath = path.resolve(__dirname, "..", "config", "config.json");
let config;
try {
  config = require(configPath)[env];
} catch (e) {
  console.error(
    `Error al cargar la configuración desde ${configPath} para el entorno ${env}:`,
    e
  );
  // Fallback o lanzar un error crítico si la configuración es esencial
  throw new Error(
    `Fallo crítico: No se pudo cargar la configuración de la base de datos para el entorno ${env}.`
  );
}
// --- FIN MODIFICACIÓN ---

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Usar config.database, config.username, etc. directamente del objeto config
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false, // Puedes cambiar a console.log para ver las consultas SQL
  });
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
db.Transaccion.hasMany(db.Reserva, {
  foreignKey: "transaccionId",
  as: "reservasAsociadas",
  onDelete: "CASCADE",
});

db.Reserva.belongsTo(db.Transaccion, {
  foreignKey: "transaccionId",
  as: "transaccion",
});

db.Reserva.belongsTo(db.Terapeuta, {
  foreignKey: "terapeutaId",
  as: "terapeutaData",
});

module.exports = db;
