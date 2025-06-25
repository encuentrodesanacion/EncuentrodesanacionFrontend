// backend/migrations/YYYYMMDDHHMMSS-add-servicios-ofrecidos-to-terapeutas.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Añadir la columna servicios_ofrecidos a la tabla 'terapeutas'
    await queryInterface.addColumn(
      "terapeutas", // nombre de la tabla (en minúscula, como acordamos)
      "servicios_ofrecidos", // nombre de la columna a añadir
      {
        type: Sequelize.TEXT, // El tipo de dato debe ser TEXT para almacenar JSON strings
        allowNull: true, // Debe coincidir con tu modelo Terapeuta.js
        defaultValue: "[]", // Opcional: un valor por defecto si lo deseas, para que no sea NULL inicialmente
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Si se deshace la migración, eliminar la columna
    await queryInterface.removeColumn("terapeutas", "servicios_ofrecidos");
  },
};
