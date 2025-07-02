// backend/migrations/20250627202200-create-disponibilidades-table.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Disponibilidades", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      terapeuta_id: {
        // Usar snake_case para la FK
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Un terapeuta debería tener una única entrada de disponibilidad
        references: {
          model: "terapeutas", // Nombre de la tabla de terapeutas en tu DB (minúsculas)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Si eliminas al terapeuta, elimina su disponibilidad
      },
      dias_disponibles: {
        // Usar snake_case
        type: Sequelize.TEXT, // Almacenar como JSON string: ej. "[1, 2, 3]"
        allowNull: false,
        defaultValue: "[]",
      },
      horas_disponibles: {
        // Usar snake_case
        type: Sequelize.TEXT, // Almacenar como JSON string: ej. '["10:00", "11:00"]'
        allowNull: false,
        defaultValue: "[]",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Disponibilidades");
  },
};
