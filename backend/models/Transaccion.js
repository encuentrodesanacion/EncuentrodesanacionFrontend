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
      buyOrder: {
        // <-- Añadir este campo para el `buy_order` de Transbank
        type: DataTypes.STRING,
        allowNull: true, // `true` si una transacción antigua podría no tenerlo
        unique: false,
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
      fechaAnulacion: {
        // <-- Nuevo campo para la fecha de anulación
        type: DataTypes.DATE,
        allowNull: true,
      },
      montoAnulado: {
        // <-- Nuevo campo para el monto anulado (para anulaciones parciales)
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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

  Transaccion.associate = (models) => {
    Transaccion.hasMany(models.Reserva, {
      foreignKey: "transaccion_id", // Asegúrate de que este foreignKey exista en Reserva
      as: "reservas",
    });
  };

  return Transaccion;
};
