// backend/models/TemporalReserva.js
module.exports = (sequelize, DataTypes) => {
  const TemporalReserva = sequelize.define(
    "TemporalReserva",
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      reservas: {
        type: DataTypes.TEXT, // Esto es correcto y maneja el JSON automáticamente
        allowNull: false,
      },
      montoTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clienteId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buyOrder: {
        // <-- Añadir este campo
        type: DataTypes.STRING,
        allowNull: true, // Puede ser nulo o no requerido inicialmente
      },
    },
    {
      tableName: "TemporalReservas",
      timestamps: true,
      underscored: true,
    }
  );

  return TemporalReserva;
};
