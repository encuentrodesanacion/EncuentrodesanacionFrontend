// backend/.sequelizerc
const path = require("path");

module.exports = {
  // Apunta a tu nuevo archivo de configuración CLI
  config: path.resolve(__dirname, "sequelize-config.js"), // <-- ¡CAMBIO AQUÍ!
  "models-path": path.resolve(__dirname, "models"),
  "seeders-path": path.resolve(__dirname, "seeders"),
  "migrations-path": path.resolve(__dirname, "migrations"),
};
