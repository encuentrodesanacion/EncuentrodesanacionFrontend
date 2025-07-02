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
        references: {
          model: "terapeutas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // *** CAMBIO CLAVE AQUÍ para diasDisponibles ***
      diasDisponibles: {
        type: DataTypes.TEXT, // Almacenar la fecha como un string 'YYYY-MM-DD'
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("diasDisponibles");
          // Devolver siempre un array que contenga la fecha, o un array vacío si no hay valor
          // Esto es para que el frontend pueda iterar sobre él, incluso si solo hay un día.
          return rawValue ? [rawValue] : [];
        },
        set(value) {
          // El 'value' que viene del frontend puede ser:
          // 1. Un array como `['YYYY-MM-DD']` (del DatePicker si se usa `includeDates` con una única fecha)
          // 2. Un string `YYYY-MM-DD` (si lo seteas directamente)
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "string"
          ) {
            // Si es un array y su primer elemento es string, toma ese string
            this.setDataValue("diasDisponibles", value[0]);
          } else if (typeof value === "string") {
            // Si es directamente un string (esperamos 'YYYY-MM-DD')
            this.setDataValue("diasDisponibles", value);
          } else {
            console.warn(
              "[WARN MODELO] Intentando setear diasDisponibles con un valor no string o array de strings:",
              value
            );
            this.setDataValue("diasDisponibles", null); // O a un string vacío ''
          }
        },
      },
      // *** FIN CAMBIO CLAVE para diasDisponibles ***

      horasDisponibles: {
        type: DataTypes.TEXT, // Almacena como JSON string: ej. '["10:00", "11:00"]'
        allowNull: false,
        defaultValue: "[]",
        get() {
          const rawValue = this.getDataValue("horasDisponibles");
          try {
            if (rawValue && typeof rawValue === "string") {
              let cleanedValue = rawValue;
              // Intenta des-stringificar una posible capa exterior de comillas si existe
              if (
                rawValue.startsWith('"') &&
                rawValue.endsWith('"') &&
                rawValue.length > 2
              ) {
                try {
                  // Solo parseamos si realmente parece un JSON string que fue stringificado
                  // y no si es un string literal con comillas al inicio/fin (como "10:00")
                  if (
                    rawValue.slice(1, -1).startsWith("[") ||
                    rawValue.slice(1, -1).startsWith("{")
                  ) {
                    cleanedValue = JSON.parse(rawValue);
                  }
                } catch (e) {
                  console.warn(
                    "Disponibilidad.js Getter: Error al parsear capa extra de comillas, asumiendo string simple:",
                    rawValue
                  );
                }
              }
              const parsed = JSON.parse(cleanedValue);
              if (Array.isArray(parsed)) {
                return parsed;
              }
            }
            return [];
          } catch (e) {
            console.error(
              "[ERROR MODELO] Error al parsear horasDisponibles en getter (valor posiblemente malformado en DB):",
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
          } else {
            console.warn(
              "[WARN MODELO] Intentando setear horasDisponibles con un valor no array ni string:",
              value
            );
            this.setDataValue("horasDisponibles", JSON.stringify([]));
          }
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "Disponibilidades",
    }
  );

  Disponibilidad.associate = (models) => {
    Disponibilidad.belongsTo(models.Terapeuta, {
      foreignKey: "terapeuta_id",
      as: "terapeuta",
    });
  };

  return Disponibilidad;
};
