module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define(
    "Comentario",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Valida que sea un formato de email
        },
      },
      mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "Comentarios", // Nombre de la tabla en la base de datos
      timestamps: true, // Habilita `createdAt` y `updatedAt` automáticos
      underscored: false, // Tus tablas parecen usar camelCase para las timestamps, pero snake_case para las columnas.
      // Si tus columnas DB son 'nombre', 'email', 'mensaje' (camelCase), deja false.
      // Si son 'nombre', 'email', 'mensaje' y tus timestamps son 'created_at', 'updated_at' (snake_case), usa true.
      // Por la imagen que muestras, la tabla es "Comentarios" y las columnas son "nombre", "email", "mensaje".
      // Y las timestamps "createdAt", "updatedAt" (camelCase por defecto de Sequelize) están en la DB como "created_at", "updated_at" (snake_case).
      // Por lo tanto, `underscored: true` es lo más probable que necesites para la consistencia global con tus otros modelos.
      // Recomiendo `underscored: true` aquí si tus columnas `created_at` y `updated_at` en la DB son snake_case.
    }
  );

  return Comentario;
};
