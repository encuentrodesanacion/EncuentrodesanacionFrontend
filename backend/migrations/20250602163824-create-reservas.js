"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reservas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      transaccion_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Transacciones", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }, // FK
      client_booking_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      servicio: { type: Sequelize.STRING, allowNull: false },
      especialidad: { type: Sequelize.STRING, allowNull: true },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      hora: { type: Sequelize.STRING, allowNull: false },
      precio: { type: Sequelize.FLOAT, allowNull: false },
      nombre_cliente: { type: Sequelize.STRING, allowNull: false },
      telefono_cliente: { type: Sequelize.STRING, allowNull: false },
      sesiones: { type: Sequelize.INTEGER, defaultValue: 1 },
      cantidad: { type: Sequelize.INTEGER, defaultValue: 1 },
      terapeuta: { type: Sequelize.STRING, allowNull: false }, // Nombre del terapeuta (string)
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Reservas");
  },
};
