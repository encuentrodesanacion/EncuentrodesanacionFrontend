// // backend/sequelize-config.js
// // Este archivo es solo para sequelize-cli y no debe inicializar Express.

// const { Sequelize } = require("sequelize");
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // Asegúrate de cargar tu .env

// // Cargar config.json
// const env = process.env.NODE_ENV || "development";
// const config = require(path.resolve(__dirname, "config", "config.json"))[env];

// let sequelizeInstance;

// // Lógica para inicializar Sequelize basada en el entorno (similar a tu index.js, pero sin la complejidad de los modelos directamente)
// if (env === "production" && process.env.DATABASE_URL) {
//   sequelizeInstance = new Sequelize(process.env.DATABASE_URL, {
//     dialect: "postgres",
//     protocol: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: false,
//   });
// } else {
//   // Usar las credenciales de config.json para desarrollo local
//   sequelizeInstance = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     {
//       host: config.host,
//       port: config.port,
//       dialect: config.dialect,
//       logging: console.log, // Mantener logs para depuración local de la CLI
//       dialectOptions: {
//         ssl: {
//           require: true,
//           rejectUnauthorized: false,
//         },
//       },
//     }
//   );
// }

// // Exportar la instancia de sequelize para que la CLI la use
// module.exports = sequelizeInstance;
