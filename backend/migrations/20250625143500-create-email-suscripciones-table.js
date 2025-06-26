// backend/migrations/20250625142000-create-email-suscripciones-table.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("EmailSuscripciones", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Asegura que cada email sea único
      },
      fecha_suscripcion: {
        // Usar snake_case para consistencia con underscored: true
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      created_at: {
        // Columna que Sequelize añade automáticamente con timestamps: true
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        // Columna que Sequelize añade automáticamente con timestamps: true
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("EmailSuscripciones");
  },
};
