// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development"; // Mantener env para logging o condicionales si los necesitas

// --- ¡MODIFICACIÓN CLAVE AQUÍ! ---
// Eliminar la carga de config.json y usar DATABASE_URL directamente.
let sequelize;
// Asumimos que DATABASE_URL siempre estará disponible en Heroku.
// La DATABASE_URL ya contiene dialecto, usuario, pass, host, puerto, dbname.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "Fallo crítico: La variable de entorno DATABASE_URL no está definida."
  );
}

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // Especificar directamente el dialecto para mayor claridad
  logging: false, // Puedes cambiar a console.log para ver las consultas SQL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Para Heroku PostgreSQL
    },
  },
});
// --- FIN MODIFICACIÓN ---

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
