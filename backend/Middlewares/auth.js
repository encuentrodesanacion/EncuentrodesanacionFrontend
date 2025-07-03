const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    console.warn("Intento de acceso a ruta protegida sin token.");
    return res
      .status(401)
      .json({
        mensaje: "No autenticado: Se requiere un token de autorización.",
      });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      console.warn(
        "Intento de acceso con token inválido o expirado:",
        err.message
      );
      return res
        .status(403)
        .json({ mensaje: "Token inválido: Acceso denegado." });
    }
    req.usuario = usuario;
    next();
  });
}

function esAdministrador(req, res, next) {
  if (req.usuario && req.usuario.role === "admin") {
    // Asegúrate de que 'admin' sea el rol exacto
    next();
  } else {
    console.warn(
      "Intento de acceso a ruta de administrador por usuario no autorizado. Usuario:",
      req.usuario ? req.usuario.id : "N/A"
    );
    return res
      .status(403)
      .json({
        mensaje: "Acceso denegado: Se requieren permisos de administrador.",
      });
  }
}

module.exports = {
  autenticarToken,
  esAdministrador,
};
