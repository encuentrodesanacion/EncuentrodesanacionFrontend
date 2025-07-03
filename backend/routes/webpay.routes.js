const express = require("express");
const router = express.Router();
const webpayController = require("../controllers/webpayController"); // Asegúrate de que la ruta sea correcta

// Define la ruta POST para crear una transacción
router.post("/create-transaction", webpayController.crearTransaccionInicial);

// Define la ruta GET para confirmar una transacción
router.get("/confirmacion", webpayController.confirmarTransaccion);

// Si tienes el endpoint de anulación, asegúrate de que también esté aquí
const { autenticarToken, esAdministrador } = require("../Middlewares/auth.js"); // O la ruta correcta
router.post(
  "/refund",
  autenticarToken,
  esAdministrador,
  webpayController.anularTransaccion
);

// Asegúrate de exportar el router
module.exports = router; // <--- ¡Esta línea debe ser la única exportación principal!
