// routes/googleAuth.js
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { google } = require("googleapis");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const router = express.Router();

// Sesión para mantener el login
router.use(
  session({
    secret: "secreto_super_seguro",
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());

// Configuración de Passport
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Estrategia de autenticación con Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://encuentrodesanacion.com/auth/google/callback",
      scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
      accessType: "offline",
      prompt: "consent",
    },
    (accessToken, refreshToken, profile, done) => {
      // Aquí puedes guardar el token en la DB si lo necesitas
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      return done(null, profile);
    }
  )
);

// Ruta de login
router.get("/auth/google", passport.authenticate("google"));

// Ruta de callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/auth/success"); // o donde desees redirigir después del login
  }
);

// Ruta protegida para ver si el usuario está autenticado
router.get("/auth/success", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  res.send(`
    <h2>Sesión iniciada correctamente</h2>
    <p>Nombre: ${req.user.displayName}</p>
    <p>Email: ${req.user.emails[0].value}</p>
    <a href="/logout">Cerrar sesión</a>
  `);
});

// Cerrar sesión
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
