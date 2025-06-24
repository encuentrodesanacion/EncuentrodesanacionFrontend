// backend/models/transaccion.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Transaccion = sequelize.define(
    "Transaccion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tokenTransaccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      montoTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estadoPago: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pendiente",
      },
      fechaPago: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      clienteId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buyOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Transacciones",
      timestamps: true,
      underscored: true,
    }
  );

  return Transaccion;
};
