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
      // --- CORRECCIÓN CLAVE EN LOS GETTERS ---
      diasDisponibles: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",
        field: "dias_disponibles", // Mapeo a la columna DB
        get() {
          const rawValue = this.getDataValue("diasDisponibles"); // Accede a la propiedad del modelo
          console.log(
            `DEBUG MODELO GETTER: diasDisponibles - rawValue: ${rawValue}, typeof: ${typeof rawValue}`
          );
          try {
            // Asegura que rawValue sea una cadena antes de intentar JSON.parse
            if (
              typeof rawValue === "string" &&
              rawValue.trim().startsWith("[") &&
              rawValue.trim().endsWith("]")
            ) {
              const parsed = JSON.parse(rawValue);
              if (Array.isArray(parsed)) {
                return parsed;
              }
            } else if (rawValue) {
              // Si es un string pero no JSON array (ej. "2025-07-04"), lo devuelve como array de un elemento
              return [rawValue];
            }
            return []; // Por defecto, array vacío
          } catch (e) {
            console.error(
              "[ERROR MODELO] Fallo en getter diasDisponibles al parsear JSON:",
              rawValue,
              e
            );
            return [];
          }
        },
        set(value) {
          if (Array.isArray(value)) {
            this.setDataValue("diasDisponibles", JSON.stringify(value));
          } else if (typeof value === "string") {
            this.setDataValue("diasDisponibles", value);
          } // Guarda string simple
          else {
            console.warn(
              "[WARN MODELO] Intentando setear diasDisponibles con valor no array/string, guardando '[]':",
              value
            );
            this.setDataValue("diasDisponibles", "[]");
          }
        },
      },
      horasDisponibles: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",
        field: "horas_disponibles", // Mapeo a la columna DB
        get() {
          const rawValue = this.getDataValue("horasDisponibles");
          console.log(
            `DEBUG MODELO GETTER: horasDisponibles - rawValue: ${rawValue}, typeof: ${typeof rawValue}`
          );
          try {
            if (
              typeof rawValue === "string" &&
              rawValue.trim().startsWith("[") &&
              rawValue.trim().endsWith("]")
            ) {
              const parsed = JSON.parse(rawValue);
              if (Array.isArray(parsed)) {
                return parsed;
              }
            } else if (rawValue) {
              // Si es un string pero no JSON array (ej. "19:00"), lo devuelve como array de un elemento
              return [rawValue];
            }
            return []; // Por defecto, array vacío
          } catch (e) {
            console.error(
              "[ERROR MODELO] Fallo en getter horasDisponibles al parsear JSON:",
              rawValue,
              e
            );
            return [];
          }
        },
        set(value) {
          if (Array.isArray(value)) {
            this.setDataValue("horasDisponibles", JSON.stringify(value));
          } else if (typeof value === "string") {
            this.setDataValue("horasDisponibles", value);
          } // Guarda string simple
          else {
            console.warn(
              "[WARN MODELO] Intentando setear horasDisponibles con valor no array/string, guardando '[]':",
              value
            );
            this.setDataValue("horasDisponibles", "[]");
          }
        },
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
          fields: ["terapeuta_id", "dias_disponibles", "horas_disponibles"],
          name: "unique_terapeuta_disponibilidad_slot",
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
