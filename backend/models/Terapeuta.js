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
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("servicios_ofrecidos");
          try {
            return rawValue ? JSON.parse(rawValue) : [];
          } catch (e) {
            console.error(
              "[ERROR MODELO] Error parsing serviciosOfrecidos from DB:",
              rawValue,
              e
            );
            return [];
          }
        },
        set(value) {
          // Asegúrate de que 'value' es un array antes de stringify
          if (Array.isArray(value)) {
            this.setDataValue("servicios_ofrecidos", JSON.stringify(value));
          } else {
            console.warn(
              "[WARN MODELO] Intentando setear serviciosOfrecidos con un valor no array:",
              value
            );
            this.setDataValue("servicios_ofrecidos", JSON.stringify([])); // Guardar array vacío si no es array
          }
        },
      },
    },
    { timestamps: true, underscored: true, tableName: "terapeutas" }
  );
  return Terapeuta;
};
