// backend/routes/marketing.routes.js
const express = require("express");
const router = express.Router();
const marketingController = require("../controllers/marketingController");

// Ruta para suscribir un correo electrónico
router.post("/subscribe", marketingController.subscribeEmail);

module.exports = router;
