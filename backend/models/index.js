// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

let sequelize;

// Usar DATABASE_URL para Heroku
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Configuración para entorno LOCAL usando variables de backend/.env
  // Asegúrate de que DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT estén en tu backend/.env
  sequelize = new Sequelize(
    process.env.DB_NAME, // <-- Este valor debe ser una string, no undefined
    process.env.DB_USER, // <-- Este valor debe ser una string, no undefined
    process.env.DB_PASSWORD, // <-- Este valor debe ser una string, no undefined
    {
      host: process.env.DB_HOST, // <-- Este valor debe ser una string, no undefined
      dialect: process.env.DB_DIALECT || "postgres", // Usar 'postgres' como fallback si DB_DIALECT no está definido
      logging: true, // Logs de SQL para depuración local
      dialectOptions: {
        ssl: {
          require: false, // <-- Deshabilitar SSL para DB local
          rejectUnauthorized: false,
        },
      },
      port: process.env.DB_PORT, // Asegúrate de tener DB_PORT en tu .env si tu DB local no usa el puerto por defecto 5432
    }
  );
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
