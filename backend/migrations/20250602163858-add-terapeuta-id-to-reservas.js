"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reservas", "terapeuta_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "terapeutas", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Reservas", "terapeuta_id");
  },
};
