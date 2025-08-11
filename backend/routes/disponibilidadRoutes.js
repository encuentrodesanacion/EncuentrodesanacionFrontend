// backend/routes/disponibilidadRoutes.js

const express = require("express");
const router = express.Router();
const { Disponibilidad, Terapeuta } = require("../models");

router.get("/", async (req, res) => {
  try {
    const disponibilidades = await Disponibilidad.findAll({
      where: {
        estado: "disponible",
      },
      attributes: [
        "id",
        "terapeutaId",
        "especialidad_servicio",
        "diasDisponibles",
        "horasDisponibles",
        "estado",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Terapeuta,
          as: "infoTerapeuta",
          attributes: ["nombre", "id"],
        },
      ],
      raw: true, // <-- ¡CAMBIO CLAVE! Esto devuelve objetos de datos sin procesar.
      nest: true, // <-- ¡CAMBIO CLAVE! Esto anida los datos del 'include'.
    });

    const formattedDisponibilidades = disponibilidades.map((d) => {
      const nombreTerapeuta = d.infoTerapeuta
        ? d.infoTerapeuta.nombre
        : "Terapeuta Desconocido";

      // El campo ahora será accesible directamente porque el objeto es 'raw'.
      const especialidad = d.especialidad_servicio;

      return {
        id: d.id,
        nombreTerapeuta: nombreTerapeuta,
        terapeutaId: d.terapeutaId,
        especialidad_servicio: especialidad,
        diasDisponibles: d.diasDisponibles,
        horasDisponibles: d.horasDisponibles,
        estado: d.estado,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    });

    res.json(formattedDisponibilidades);
  } catch (error) {
    console.error("Error al obtener disponibilidades:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener disponibilidades",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;
