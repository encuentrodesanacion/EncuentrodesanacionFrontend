// backend/models/Terapia.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Terapia = sequelize.define(
    "Terapia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      // Asegúrate de que esta columna exista en tu tabla 'terapias' en la DB
      terapeutaDefaultId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser nulo si no todas las terapias tienen un terapeuta por defecto
        references: {
          model: "terapeutas", // ¡Importante! Nombre de la tabla a la que referencia
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      // Si tienes 'opciones' como JSON, asegúrate de su definición aquí
      opciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "[]",
        get() {
          const rawValue = this.getDataValue("opciones");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("opciones", JSON.stringify(value));
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "terapias", // Nombre de la tabla
    }
  );

  // --- ¡ASOCIACIÓN CLAVE AQUÍ! ---
  Terapia.associate = (models) => {
    // Una Terapia pertenece a UN Terapeuta (por defecto)
    Terapia.belongsTo(models.Terapeuta, {
      foreignKey: "terapeutaDefaultId", // El nombre de la FK en la tabla 'terapias'
      as: "terapeutaData", // Alias para acceder a los datos del terapeuta (ej. terapia.terapeutaData.nombre)
    });
  };

  return Terapia;
};
