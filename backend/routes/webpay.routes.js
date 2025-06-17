// backend/routes/webpay.routes.js
const express = require("express");
const router = express.Router();
const webpayController = require("../controllers/webpayController");

// Ruta POST para iniciar la transacción de Webpay
router.post("/", webpayController.crearTransaccionInicial);

// Ruta para la confirmación de Webpay.
// Aceptará tanto POST (de Transbank) como GET (de la redirección del navegador).
router.post("/confirmacion", webpayController.confirmarTransaccion);
router.get("/confirmacion", webpayController.confirmarTransaccion); // <--- ¡ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ AQUÍ!

module.exports = router;
