// backend/models/terapeuta.js
module.exports = (sequelize, DataTypes) => {
  const Terapeuta = sequelize.define(
    "Terapeuta",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      serviciosOfrecidos: {
        // Nombre del atributo en el modelo
        type: DataTypes.TEXT, // El tipo de columna en la base de datos
        allowNull: true,
        defaultValue: "[]", // Valor por defecto como string JSON
        field: "servicios_ofrecidos", // Nombre de la columna en la DB (snake_case)

        // *** ESTOS GETTERS Y SETTERS SON VITALES SI LA COLUMNA ES DataTypes.TEXT PERO ALMACENA JSON ARRAYS ***
        get() {
          const rawValue = this.getDataValue("serviciosOfrecidos");
          // console.log(`[DEBUG Terapeuta Model Getter] rawValue for serviciosOfrecidos: ${rawValue}, typeof: ${typeof rawValue}`);
          try {
            if (
              typeof rawValue === "string" &&
              rawValue.trim().startsWith("[") &&
              rawValue.trim().endsWith("]")
            ) {
              const parsed = JSON.parse(rawValue);
              return Array.isArray(parsed) ? parsed : [];
            } else if (rawValue) {
              // Si es un string simple que no es un array JSON, lo trata como un elemento
              return [rawValue];
            }
            return []; // Retorna un array vacío si el valor es nulo o no válido
          } catch (e) {
            console.error(
              "[ERROR Terapeuta Model Getter] Fallo al parsear serviciosOfrecidos:",
              rawValue,
              e
            );
            return [];
          }
        },
        set(value) {
          // Asegura que siempre se guarde como un string JSON si es un array, o como string simple
          if (Array.isArray(value)) {
            this.setDataValue("serviciosOfrecidos", JSON.stringify(value));
          } else if (typeof value === "string") {
            this.setDataValue("serviciosOfrecidos", value);
          } else {
            this.setDataValue("serviciosOfrecidos", "[]"); // Fallback seguro
          }
        },
      },
    },
    { timestamps: true, underscored: true, tableName: "terapeutas" }
  );
  Terapeuta.associate = (models) => {
    Terapeuta.hasMany(models.Disponibilidad, {
      foreignKey: "terapeuta_id",
      as: "disponibilidades",
    });
  };
  return Terapeuta;
};
