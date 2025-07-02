// backend/routes/terapiaRoutes.js
const express = require("express");
const router = express.Router();
const { Terapia, Terapeuta } = require("../models"); // Asegúrate de que esta ruta sea correcta para importar tus modelos

// GET /api/terapias
// Obtener todas las terapias
router.get("/", async (req, res) => {
  try {
    const terapias = await Terapia.findAll({
      include: [
        {
          model: Terapeuta,
          as: "terapeutaData", // This MUST match the 'as' alias in Terapia.associate
          attributes: ["nombre", "id"], // Only fetch the name and ID of the therapist
        },
      ],
    });

    const formattedTerapias = terapias.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      precio: t.precio,
      // If 'terapeutaDefaultId' exists and is associated:
      terapeuta: t.terapeutaData
        ? t.terapeutaData.nombre
        : "Terapeuta no asignado", // Access through the alias
      terapeuta_id: t.terapeutaData ? t.terapeutaData.id : null, // Access through the alias
      // You can also add 'img' here if stored in DB
      // img: t.img,
      // If 'opciones' is stored as JSON string in DB, ensure it's parsed here if needed
      opciones: Array.isArray(t.opciones)
        ? t.opciones
        : t.opciones
        ? JSON.parse(t.opciones)
        : [],
    }));

    res.json(formattedTerapias);
  } catch (error) {
    console.error("Error al obtener terapias:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al obtener terapias" });
  }
});

// Opcional: GET /api/terapias/:id
// Obtener una terapia por ID
router.get("/:id", async (req, res) => {
  try {
    const terapia = await Terapia.findByPk(req.params.id, {
      // include: [{
      //   model: Terapeuta,
      //   as: 'terapeutaDefecto',
      //   attributes: ['nombre']
      // }]
    });
    if (!terapia) {
      return res.status(404).json({ message: "Terapia no encontrada" });
    }
    res.json(terapia);
  } catch (error) {
    console.error("Error al obtener terapia por ID:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al obtener terapia" });
  }
});

// Opcional: POST /api/terapias
// Crear una nueva terapia (requeriría autenticación/autorización en una app real)
router.post("/", async (req, res) => {
  try {
    const nuevaTerapia = await Terapia.create(req.body);
    res.status(201).json(nuevaTerapia);
  } catch (error) {
    console.error("Error al crear terapia:", error);
    // Errores de validación de Sequelize (ej. unique: true o allowNull:false)
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeValidationError"
    ) {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Error interno del servidor al crear terapia" });
  }
});

// Opcional: PUT /api/terapias/:id
// Actualizar una terapia existente
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Terapia.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedTerapia = await Terapia.findByPk(req.params.id);
      return res.status(200).json(updatedTerapia);
    }
    throw new Error("Terapia no encontrada o no actualizada");
  } catch (error) {
    console.error("Error al actualizar terapia:", error);
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeValidationError"
    ) {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar terapia" });
  }
});

// Opcional: DELETE /api/terapias/:id
// Eliminar una terapia
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Terapia.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send("Terapia eliminada"); // 204 No Content para eliminación exitosa
    }
    throw new Error("Terapia no encontrada");
  } catch (error) {
    console.error("Error al eliminar terapia:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar terapia" });
  }
});

module.exports = router;
