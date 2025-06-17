// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

if (env === "development") {
  require("dotenv").config(); // Solo carga .env en local
}

// --- Conexión a base de datos ---
if (!process.env.DATABASE_URL) {
  throw new Error(
    "Fallo crítico: DATABASE_URL no está definida en las variables de entorno."
  );
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      env === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
  },
});

// --- Carga dinámica de modelos ---
const db = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js") &&
      !file.endsWith(".test.js")
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// --- Asociaciones automáticas si están definidas ---
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// --- Asociaciones manuales ---
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

// --- Exportación ---
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes;

module.exports = db;
