// backend/routes/disponibilidadRoutes.js

const express = require("express");
const router = express.Router();
const { Disponibilidad, Terapeuta } = require("../models"); // Asegúrate de que esta ruta sea correcta

router.get("/", async (req, res) => {
  try {
    const disponibilidades = await Disponibilidad.findAll({
      where: {
        estado: "disponible",
      },
      attributes: [
        // <--- ¡MANTÉN ESTO ASÍ, usando nombres de propiedad del modelo!
        "id",
        "terapeutaId",
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
    });

    // --- Tus LOGS DETALLADOS (estos ya están bien y confirmaron el problema) ---
    console.log("DEBUG BACKEND: Raw data from DB (d.dataValues):");
    disponibilidades.forEach((d, index) => {
      const rawDataValues = d.dataValues;
      console.log(`  Fila ${index} (ID: ${rawDataValues.id || "N/A"}):`);
      console.log(`    - terapeuta_id (raw): ${rawDataValues.terapeuta_id}`); // Esto es undefined, pero el getter funciona
      console.log(
        `    - dias_disponibles (raw DB string): ${rawDataValues.dias_disponibles}`
      );
      console.log(
        `    - horas_disponibles (raw DB string): ${rawDataValues.horas_disponibles}`
      );
      console.log(`    - estado (raw): ${rawDataValues.estado}`);
      console.log(
        `    - diasDisponibles (via model getter):`,
        d.diasDisponibles
      );
      console.log(
        `    - horasDisponibles (via model getter):`,
        d.horasDisponibles
      );
      console.log(
        `    - Tipo de d.diasDisponibles: ${typeof d.diasDisponibles}, es Array: ${Array.isArray(
          d.diasDisponibles
        )}`
      );
      console.log(
        `    - Tipo de d.horasDisponibles: ${typeof d.horasDisponibles}, es Array: ${Array.isArray(
          d.horasDisponibles
        )}`
      );
    });

    const formattedDisponibilidades = disponibilidades.map((d) => {
      const nombreTerapeuta = d.infoTerapeuta
        ? d.infoTerapeuta.nombre
        : "Terapeuta Desconocido";
      // CORRECCIÓN CLAVE AQUÍ: Usamos d.terapeutaId que viene de la propiedad del modelo
      const terapeutaIdParaFrontend = d.terapeutaId;

      const dias = Array.isArray(d.diasDisponibles) ? d.diasDisponibles : [];
      const horas = Array.isArray(d.horasDisponibles) ? d.horasDisponibles : [];

      return {
        id: d.id,
        nombreTerapeuta: nombreTerapeuta,
        terapeutaId: terapeutaIdParaFrontend, // <-- ¡ASIGNAR ESTA VARIABLE!
        diasDisponibles: dias,
        horasDisponibles: horas,
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
