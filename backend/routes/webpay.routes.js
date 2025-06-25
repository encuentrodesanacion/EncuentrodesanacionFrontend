const express = require("express");
const router = express.Router();
const webpayController = require("../controllers/webpayController"); // Asegúrate de que la ruta sea correcta

// Define la ruta POST para crear una transacción
router.post("/create-transaction", webpayController.crearTransaccionInicial);

// Define la ruta GET para confirmar una transacción
router.get("/confirmacion", webpayController.confirmarTransaccion);

// Asegúrate de exportar el router
module.exports = router;
