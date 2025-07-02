const express = require("express");
const router = express.Router();
const { Disponibilidad, Terapeuta } = require("../models"); // Asegúrate de que esta ruta sea correcta para importar tus modelos

// GET /api/disponibilidades
// Obtener todas las disponibilidades, incluyendo información del terapeuta
router.get("/", async (req, res) => {
  try {
    const disponibilidades = await Disponibilidad.findAll({
      include: [
        {
          model: Terapeuta,
          as: "terapeuta",
          attributes: ["nombre", "id"], // Solo trae el nombre y el id del terapeuta
        },
      ],
    });

    // Formatear la respuesta para que coincida con la estructura que espera tu frontend
    const formattedDisponibilidades = disponibilidades.map((d) => ({
      nombreTerapeuta: d.terapeuta.nombre,
      diasDisponibles: d.diasDisponibles, // Ya se parsea en el getter del modelo
      horasDisponibles: d.horasDisponibles, // Ya se parsea en el getter del modelo
    }));

    res.json(formattedDisponibilidades);
  } catch (error) {
    console.error("Error al obtener disponibilidades:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener disponibilidades",
    });
  }
});

module.exports = router;
