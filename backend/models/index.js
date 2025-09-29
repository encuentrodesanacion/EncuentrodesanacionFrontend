// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

let sequelize;

// Usar DATABASE_URL para Heroku (producción)
if (process.env.DATABASE_URL) {
  const useSSL = process.env.DB_HOST?.includes("rds.amazonaws.com");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || "postgres",
      port: process.env.DB_PORT || 5432,
      logging: true,
      dialectOptions: useSSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: true,
              ca: fs
                .readFileSync(
                  path.join(__dirname, "../certs/rds-ca-bundle.pem")
                )
                .toString(),
            },
          }
        : {},
    }
  );
}

module.exports = { sequelize, Sequelize, DataTypes };

const db = {};

// Cargar automáticamente todos los modelos de la carpeta actual ('models')
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Ignorar archivos ocultos
      file !== basename && // Ignorar index.js
      file.slice(-3) === ".js" && // Solo archivos .js
      file.indexOf(".test.js") === -1 // Ignorar archivos de prueba
    );
  })
  .forEach((file) => {
    // Importar cada modelo y definirlo con sequelize
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Llamar a los métodos .associate() de cada modelo (si existen)
// Aquí es donde se definen las relaciones entre modelos (ej. BelongsTo, HasMany)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exportar la instancia de Sequelize y el objeto db con todos los modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes; // También exportamos DataTypes para consistencia

// --- ¡IMPORTANTE! Eliminamos las definiciones de asociaciones que estaban aquí abajo. ---
// Estas asociaciones (Transaccion.hasMany(Reserva), Reserva.belongsTo(Transaccion),
// y Reserva.belongsTo(Terapeuta)) deben estar definidas DENTRO de sus respectivos
// archivos de modelo (ej. en Reserva.js o Transaccion.js) usando el método 'associate'.
// Esto evita duplicidades y conflictos como los que tenías.
// Si el modelo Transaccion no existe aún, sus asociaciones deberán definirse cuando lo crees.

module.exports = db;
