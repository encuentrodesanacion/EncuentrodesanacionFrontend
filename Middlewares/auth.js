const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ mensaje: "No autenticado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido" });
    req.usuario = usuario;
    next();
  });
}

module.exports = { autenticarToken };
