const db = require("../models");
const Comentario = db.Comentario;

const crearComentario = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return res
        .status(400)
        .json({ mensaje: "Nombre, email y mensaje son campos obligatorios." });
    }
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({ mensaje: "El nombre no es válido." });
    }
    if (typeof email !== "string" || !email.includes("@")) {
      // Validación simple de email
      return res
        .status(400)
        .json({ mensaje: "El formato del email no es válido." });
    }
    if (typeof mensaje !== "string" || mensaje.trim() === "") {
      return res
        .status(400)
        .json({ mensaje: "El mensaje no puede estar vacío." });
    }

    const nuevoComentario = await Comentario.create({
      nombre,
      email,
      mensaje,
    });

    console.log(
      `[INFO] Nuevo comentario guardado: ID ${nuevoComentario.id}, Email: ${nuevoComentario.email}`
    );
    res
      .status(201)
      .json({
        mensaje: "Comentario enviado con éxito.",
        comentario: nuevoComentario,
      });
  } catch (error) {
    console.error("[ERROR] Error al guardar el comentario:", error);
    // Manejo de errores específicos de Sequelize, si es necesario
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({
          mensaje:
            "Error de validación: " +
            error.errors.map((e) => e.message).join(", "),
        });
    }
    res
      .status(500)
      .json({
        mensaje: "Error interno del servidor al guardar el comentario.",
        error: error.message,
      });
  }
};

module.exports = {
  crearComentario,
};
