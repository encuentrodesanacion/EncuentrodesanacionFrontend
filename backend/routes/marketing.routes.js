// backend/routes/marketing.routes.js
const express = require("express");
const router = express.Router();
const marketingController = require("../controllers/marketingController"); // Asegúrate de que esta importación sea correcta

// Ruta para suscribir un correo electrónico
router.post("/send-confirmation", marketingController.sendConfirmationEmail);
module.exports = router;
