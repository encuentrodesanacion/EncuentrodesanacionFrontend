// backend/routes/googleAuth.js

const express = require("express");
const router = express.Router();

const {
  getAuthUrl,
  setCredentialsFromCode,
  getOAuthClient,
} = require("../googleAuth");

// Ruta para iniciar el flujo OAuth y redirigir a Google
router.get("/auth/google", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Callback que Google redirige después de autenticación
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokens = await setCredentialsFromCode(code);
    console.log("Tokens recibidos:", tokens);

    // Aquí podrías guardar tokens en DB para usar después

    // Redirigir al frontend en caso de éxito (cambia la URL a la tuya)
    res.redirect("https://www.encuentrodesanacion.com/success");
  } catch (error) {
    console.error("Error en callback de Google:", error);
    res.status(500).send("Error de autenticación");
  }
});

module.exports = router;
