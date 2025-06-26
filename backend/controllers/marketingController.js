// backend/controllers/marketingController.js
const db = require("../models"); // Importa todos los modelos
const EmailSuscripcion = db.EmailSuscripcion; // Accede a tu nuevo modelo

const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "El correo electrónico es requerido." });
  }

  // Validación básica del formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "El formato del correo electrónico es inválido." });
  }

  try {
    // Intentar crear la suscripción
    const [suscripcion, created] = await EmailSuscripcion.findOrCreate({
      where: { email: email },
      defaults: {
        email: email,
        fechaSuscripcion: new Date(),
      },
    });

    if (created) {
      console.log(`[MARKETING] Nuevo correo suscrito: ${email}`);
      return res
        .status(201)
        .json({
          message: "¡Gracias por suscribirte! Recibirás nuestras novedades.",
        });
    } else {
      console.log(`[MARKETING] Correo ya suscrito: ${email}`);
      return res
        .status(200)
        .json({
          message: "Este correo ya está suscrito a nuestras novedades.",
        });
    }
  } catch (error) {
    console.error("Error al suscribir el correo:", error);
    // Manejar errores específicos, como la validación de email si falla el isEmail
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Este correo ya está registrado." });
    }
    return res
      .status(500)
      .json({
        message: "Error interno al procesar la suscripción.",
        error: error.message,
      });
  }
};

module.exports = {
  subscribeEmail,
};
