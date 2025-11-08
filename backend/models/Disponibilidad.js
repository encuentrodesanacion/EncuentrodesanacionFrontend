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
      // --- ¡NUEVA COLUMNA AGREGADA! ---
      especialidad_servicio: {
        type: DataTypes.STRING, // Tipo de dato para el nombre del servicio/taller
        allowNull: false,
        field: "especialidad_servicio",
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
          unique: true, // Volvemos a activar la unicidad
          fields: ["terapeuta_id", "especialidad_servicio", "dias_disponibles"], // <--- CAMBIO CLAVE
          name: "unique_terapeuta_disponibilidad_servicio_dia", // Renombrado para claridad
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
