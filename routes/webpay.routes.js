// backend/routes/webpay.routes.js
const express = require("express");
const router = express.Router();
const webpayController = require("../controllers/webpayController");

// Ruta POST para iniciar la transacción de Webpay
// ¡CAMBIAR ESTA LÍNEA PARA QUE COINCIDA CON EL FRONTEND!
router.post("/create-transaction", webpayController.crearTransaccionInicial); // <--- ¡CAMBIAR ESTA LÍNEA!

// Ruta para la confirmación de Webpay.
router.post("/confirmacion", webpayController.confirmarTransaccion);
router.get("/confirmacion", webpayController.confirmarTransaccion);

module.exports = router;
