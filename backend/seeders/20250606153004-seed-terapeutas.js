// backend/seeders/YYYYMMDDHHMMSS-seed-terapeutas.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const terapeutasData = [
      {
        nombre: "Betsy Bolivar",
        email: "spaholistico@encuentrodesanacion.com",
        servicios_ofrecidos: JSON.stringify([
          // Correcto: JSON.stringify
          "Workshop de Armonización de Chakras",
          "La limpieza de lealtades transgeneracionales",
          "Limpieza de Espacios",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Paulina Villablanca",
        email: "paulina.villablanca@ejemplo.com",
        servicios_ofrecidos: JSON.stringify([
          // Correcto: JSON.stringify
          "Constelaciones Familiares",
          "Taller de Meditación Profunda",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Paulina Villablanca",
        email: "paulina.villablanca@ejemplo.com",
        servicios_ofrecidos: JSON.stringify([
          // Correcto: JSON.stringify
          "Constelaciones Familiares",
          "Taller de Meditación Profunda",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert(
      "terapeutas", // <-- Asegúrate de que el nombre de la tabla sea 'terapeutas' (minúsculas)
      terapeutasData,
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("terapeutas", null, {});
  },
};
