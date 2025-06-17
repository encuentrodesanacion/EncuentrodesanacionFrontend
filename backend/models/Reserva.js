// backend/models/Reserva.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Reserva = sequelize.define(
    "Reserva",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      transaccionId: {
        // <--- AGREGAR ESTO: Clave Foránea a Transacciones
        type: DataTypes.INTEGER,
        allowNull: true, // Debe coincidir con allowNull de tu migración para transaccion_id
      },
      terapeutaId: {
        // <--- AGREGAR ESTO: Clave Foránea a Terapeutas
        type: DataTypes.INTEGER,
        allowNull: true, // Debe coincidir con allowNull de tu migración para terapeuta_id
      },
      terapeuta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientBookingId: {
        type: DataTypes.BIGINT, // Asumo que el frontend envía un número grande
        unique: true,
        allowNull: false,
      },
      servicio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nombreCliente: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefonoCliente: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sesiones: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "Reservas",
    }
  );

  // No necesitas definir asociaciones aquí si ya las tienes en index.js
  // Reserva.associate = (models) => {
  //   Reserva.belongsTo(models.Transaccion, { foreignKey: 'transaccionId', as: 'transaccion' });
  //   Reserva.belongsTo(models.Terapeuta, { foreignKey: 'terapeutaId', as: 'terapeutaData' }); // Si deseas una relación directa
  // };

  return Reserva;
};
