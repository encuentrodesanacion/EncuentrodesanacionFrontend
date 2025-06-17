"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transacciones", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token_transaccion: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      monto_total: { type: Sequelize.FLOAT, allowNull: false },
      estado_pago: {
        // <--- CAMBIO AQUÍ: de estadoPago a estado_pago
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pendiente",
      },
      fecha_pago: {
        // <--- CAMBIO AQUÍ: de fechaPago a fecha_pago
        type: Sequelize.DATE,
        allowNull: true,
      },
      cliente_id: {
        // <--- CAMBIO AQUÍ: de clienteId a cliente_id
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Asegúrate de que estos campos estén si los usas en el modelo
      buy_order: {
        // <--- AGREGAR ESTOS SI NO ESTABAN Y SE USAN EN EL MODELO
        type: Sequelize.STRING,
        allowNull: true,
      },
      session_id: {
        // <--- AGREGAR ESTOS SI NO ESTABAN Y SE USAN EN EL MODELO
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Transacciones");
  },
};
