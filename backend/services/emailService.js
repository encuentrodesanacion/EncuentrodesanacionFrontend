// backend/services/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Asegúrate de que dotenv esté cargado aquí también

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // <-- IMPORTANTE: debe ser 'false' para el puerto 587 (STARTTLS)
  requireTLS: true, // <-- Esto fuerza la encriptación
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Esto solo para depuración si todo lo demás falla y necesitas probar certificados
  // tls: {
  //   rejectUnauthorized: false
  // }
});
// Specify minimum TLS version (optional, try without first)
// minVersion: 'TLSv1.2' // You might need to uncomment and try this if it still fails

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.CORREO_GMAIL, // Remitente (tu correo)
      to: to, // Destinatario (correo del terapeuta)
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to} con asunto: ${subject}`);
    return true;
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, error);
    return false;
  }
};

module.exports = { sendEmail };
