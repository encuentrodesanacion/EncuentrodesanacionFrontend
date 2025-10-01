// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const process = require("process");
const fs = require("fs");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

let sequelize;
// --- INICIO: Nuevo Bloque de Conexión Unificado ---
// Usaremos DB_HOST como condición principal. Si existe, asumimos que estamos en producción/staging.
if (process.env.DB_HOST) {
  console.log("DEBUG: Usando conexión detallada (DB_HOST detectado).");
  const useSSL = process.env.DB_HOST.includes("rds.amazonaws.com");

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || "postgres",
      port: process.env.DB_PORT || 5432,
      logging: true,
      // Aquí puedes añadir la configuración de pool si no la tienes ya.

      dialectOptions: useSSL
        ? {
            ssl: {
              // Forzamos SSL
              require: true,
              // El rechazo de unauthorized puede ser problemático si el certificado no está perfecto.
              // Lo dejamos como estaba en tu código, pero es la línea más sensible:
              rejectUnauthorized: true,
              ca: fs
                .readFileSync(
                  path.join(__dirname, "../certs/rds-ca-bundle.pem")
                )
                .toString(),
            },
          }
        : {}, // Si no es SSL (ej. localhost), no se usa dialectOptions.
    }
  );
} else {
  // Aquí puedes añadir tu configuración de desarrollo local (ej. SQLite o una DB local simple)
  // O simplemente dejarlo vacío si confías en que DB_HOST siempre estará en prod.
  // IMPORTANTE: Para desarrollo local con Postgres/MySQL, se debe definir aquí.
  console.warn(
    "ADVERTENCIA: No se encontró DB_HOST. Usando modo de desarrollo (o fallará si no está configurado)."
  );
  // Si estás usando un archivo de configuración para desarrollo (config.json) puedes cargarlo aquí.
}
// --- FIN: Nuevo Bloque de Conexión Unificado ---

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
