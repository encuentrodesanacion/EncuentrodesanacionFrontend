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
        unique: true, // El token de Transbank ahora es único en esta tabla
      },
      montoTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estadoPago: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pendiente", // Podría ser 'pendiente', 'aprobado', 'rechazado', etc.
      },
      fechaPago: {
        type: DataTypes.DATE,
        allowNull: true, // Se registrará cuando el pago se confirme
      },
      // El clienteId será el número de teléfono del cliente (si es único o el identificador principal)
      clienteId: {
        type: DataTypes.STRING, // Usamos STRING para números de teléfono
        allowNull: true, // Podría ser nulo si el cliente no está registrado o no se captura aquí
      },
      // Puedes añadir más campos de Transbank para depuración o referencia
      buyOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Otros campos de la respuesta de Transbank si son útiles para el registro
      // authorizationCode: { type: DataTypes.STRING, allowNull: true },
      // paymentType: { type: DataTypes.STRING, allowNull: true },
      // responseCode: { type: DataTypes.STRING, allowNull: true },
      // vci: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "Transacciones", // Nombre de la tabla en la DB
      timestamps: true, // createdAt y updatedAt
      underscored: true, // snake_case para nombres de columnas
    }
  );

  return Transaccion;
};
