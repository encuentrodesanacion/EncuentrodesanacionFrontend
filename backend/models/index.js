// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

let sequelize;
// Si config.json tiene la clave "use_env_variable", Sequelize la usará para la conexión.
// De lo contrario, usará las propiedades 'database', 'username', etc. directamente de 'config'.
if (config.use_env_variable) {
  // Cuando config.json incluye "use_env_variable", Sequelize busca la variable de entorno
  // con el nombre especificado (ej., "DATABASE_URL") y la usa para la conexión.
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Si config.json no usa "use_env_variable", entonces se esperan las propiedades
  // 'database', 'username', 'password', 'host', 'port', 'dialect' directamente.
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: console.log, // Habilitar logging para ver las consultas SQL
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
