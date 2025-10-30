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
        type: DataTypes.STRING,
        allowNull: true, // Debe coincidir con allowNull de tu migración para transaccion_id
      },
      terapeutaId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Debe coincidir con allowNull de tu migración para terapeuta_id
      },
      terapeuta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientBookingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        field: "client_booking_id",
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
      // ---> CAMPOS DE REGALO AGREGADOS CON MAPPING
      remitenteNombre: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "remitentenombre", // Mapeo exacto a la columna existente
      },
      remitenteTelefono: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "remitentetelefono", // Mapeo exacto a la columna existente
      },
      mensajePersonalizado: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "mensajepersonalizado", // Mapeo exacto a la columna existente
      },
      // <--- FIN DE CAMPOS DE REGALO
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
  return Reserva;
};
