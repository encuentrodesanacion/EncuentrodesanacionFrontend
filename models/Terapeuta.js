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
      // Asegúrate de que el nombre del atributo en el modelo sea camelCase (serviciosOfrecidos)
      serviciosOfrecidos: {
        type: DataTypes.TEXT, // La columna en la DB es de tipo TEXT para almacenar JSON string
        allowNull: true,
      },
    },
    { timestamps: true, underscored: true, tableName: "terapeutas" }
  );
  return Terapeuta;
};
