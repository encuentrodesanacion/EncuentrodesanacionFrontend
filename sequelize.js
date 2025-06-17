// backend/config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Producción (Heroku u otro hosting con DATABASE_URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Heroku requiere esto para SSL
      },
    },
    logging: false, // Puedes activar logs SQL si lo deseas
  });
} else {
  // Desarrollo local
  sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false,
  });
}

module.exports = sequelize;
