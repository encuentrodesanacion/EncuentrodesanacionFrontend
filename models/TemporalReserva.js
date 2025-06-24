// models/TemporalReserva.js
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
      // --- ¡NUEVA COLUMNA AÑADIDA! ---
      montoTotal: {
        type: DataTypes.INTEGER, // O el tipo de dato que uses para el monto (FLOAT/DECIMAL si manejas decimales)
        allowNull: false, // Es crucial que no sea nulo, ya que siempre lo esperamos
      },
      // --- ¡NUEVA COLUMNA AÑADIDA! ---
      clienteId: {
        type: DataTypes.STRING, // Tipo para almacenar el número de teléfono del cliente
        allowNull: true, // Puede ser nulo si el cliente no está autenticado o el teléfono no siempre se envía
      },
    },
    {
      tableName: "TemporalReservas", // Nombre de tabla explícito, por convención
      timestamps: true, // Añade createdAt y updatedAt
      underscored: true, // Usa snake_case
    }
  );

  return TemporalReserva;
};
