const { Sequelize } = require("sequelize");
require("dotenv").config(); // Esto carga las variables de .env para desarrollo local

let sequelize;

// Detectar si estamos en Heroku o si DATABASE_URL está definida
if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL proporcionada por Heroku (para PostgreSQL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres", // Especificar el protocolo
    dialectOptions: {
      ssl: {
        require: true, // Requerir SSL para conexiones seguras
        rejectUnauthorized: false, // Importante para evitar errores de certificado en Heroku
      },
    },
    logging: false, // Desactiva el log de SQL en la consola para producción
  });
} else {
  // Configuración para entorno local (usa tus variables de .env)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || "mysql", // Usa DB_DIALECT de .env, con fallback a mysql
      logging: true, // Activa el log de SQL para depuración local
    }
  );
}

module.exports = sequelize;
