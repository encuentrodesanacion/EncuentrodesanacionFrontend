// backend/models/Disponibilidad.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Disponibilidad = sequelize.define(
    "Disponibilidad",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      terapeutaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Terapeutas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "terapeuta_id",
      },
      diasDisponibles: {
        type: DataTypes.ARRAY(DataTypes.STRING), // <--- CAMBIO CLAVE
        allowNull: false,
        defaultValue: [],
        field: "dias_disponibles",
        // ELIMINAR LOS GETTERS Y SETTERS PERSONALIZADOS DE AQUÍ
      },
      horasDisponibles: {
        type: DataTypes.ARRAY(DataTypes.STRING), // <--- CAMBIO CLAVE
        allowNull: false,
        defaultValue: [],
        field: "horas_disponibles",
        // ELIMINAR LOS GETTERS Y SETTERS PERSONALIZADOS DE AQUÍ
      },
      estado: {
        type: DataTypes.ENUM("disponible", "reservado", "cancelado"),
        defaultValue: "disponible",
        allowNull: false,
      },
    },
    {
      tableName: "Disponibilidades",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["terapeuta_id", "dias_disponibles"], // Ajustado
          name: "unique_terapeuta_disponibilidad_dia",
        },
      ],
    }
  );

  Disponibilidad.associate = function (models) {
    Disponibilidad.belongsTo(models.Terapeuta, {
      foreignKey: "terapeuta_id",
      as: "infoTerapeuta",
    });
  };

  return Disponibilidad;
};
