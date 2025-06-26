// backend/models/EmailSuscripcion.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EmailSuscripcion = sequelize.define(
    "EmailSuscripcion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegura que cada email sea único
        validate: {
          isEmail: true, // Valida que sea un formato de email válido
        },
      },
      fechaSuscripcion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // Puedes añadir más campos si lo necesitas, ej:
      // fuenteSuscripcion: {
      //   type: DataTypes.STRING,
      //   defaultValue: 'SuccessPage',
      // },
    },
    {
      timestamps: true, // Añade createdAt y updatedAt
      underscored: true, // Usa snake_case para los nombres de columnas automáticamente
      tableName: "EmailSuscripciones", // Nombre de la tabla en la DB
    }
  );

  return EmailSuscripcion;
};
