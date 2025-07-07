"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Disponibilidades", "estado", {
      type: Sequelize.ENUM("disponible", "reservado", "cancelado"),
      defaultValue: "disponible",
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Disponibilidades", "estado");
  },
};
