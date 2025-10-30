// backend/controllers/marketingController.js

const { sendEmail } = require("../services/emailService"); // Necesitas importar tu servicio de correo
const db = require("../models"); // Importa todos los modelos
const Transaccion = db.Transaccion; // Importa el modelo Transaccion
// Asumimos que EmailSuscripcion existe en db.
const EmailSuscripcion = db.EmailSuscripcion;

// --- 1. FUNCIÓN EXISTENTE: Suscripción a Marketing ---
const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "El correo electrónico es requerido." });
  }

  // Validación básica del formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "El formato del correo electrónico es inválido." });
  }

  try {
    const [suscripcion, created] = await EmailSuscripcion.findOrCreate({
      where: { email: email },
      defaults: {
        email: email,
        fechaSuscripcion: new Date(),
      },
    });

    if (created) {
      console.log(`[MARKETING] Nuevo correo suscrito: ${email}`);
      return res.status(201).json({
        message: "¡Gracias por suscribirte! Recibirás nuestras novedades.",
      });
    } else {
      console.log(`[MARKETING] Correo ya suscrito: ${email}`);
      return res.status(200).json({
        message: "Este correo ya está suscrito a nuestras novedades.",
      });
    }
  } catch (error) {
    console.error("Error al suscribir el correo:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Este correo ya está registrado." });
    }
    return res.status(500).json({
      message: "Error interno al procesar la suscripción.",
      error: error.message,
    });
  }
};

// --- 2. FUNCIÓN AUXILIAR: Generar HTML para el Correo de Confirmación ---
const generateConfirmationHtml = (details, token, transactionId) => {
  // Desestructuración limpia, usando el fallback 'N/A'
  const {
    clienteNombre: destinatario, // Renombramos clienteNombre a destinatario
    clienteTelefono: telefonoDestinatario, // Renombramos clienteTelefono
    remitenteNombre: remitente = "N/A", // Usamos un fallback si es undefined/null
    remitenteTelefono: telefonoRemitente = "N/A",
    mensajePersonalizado: mensaje = "No se adjuntó mensaje.",
    servicio,
    especialidad,
    sesiones,
    precio,
    fecha,
    hora,
    nombreTerapeuta,
  } = details;

  let clienteDisplay = "";
  let mensajePersonalizadoHtml = "";

  const esGiftCard = servicio === "GiftCard";
  const servicioTipo = esGiftCard ? "Gift Card / Paquete" : "Sesión de Terapia";

  // Si el servicio es GiftCard, la estructura cambia
  if (esGiftCard) {
    clienteDisplay = `
            <p><strong>Destinatario del Regalo:</strong> ${destinatario}</p>
            <p><strong>Remitente (Quien Regala):</strong> ${remitente}</p>
            <p><strong>Teléfono del Remitente:</strong> ${telefonoRemitente}</p>
        `;
    mensajePersonalizadoHtml = `
            <h4 style="color: #02807d; margin: 15px 0 5px 0;">Mensaje Personalizado</h4>
            <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9; border-radius: 4px; margin-bottom: 15px;">
                <p style="margin: 0; white-space: pre-wrap;">${mensaje}</p>
            </div>
        `;
  }

  // Condicional para mostrar info de agendamiento
  const agendamientoInfo = esGiftCard
    ? `<p><strong>IMPORTANTE:</strong> Esta es una Gift Card. El Terapeuta se pondra en contacto para coordinar la toma de hora.</p>`
    : `<p><strong>Fecha y Hora Agendada:</strong> ${fecha} a las ${hora} con ${nombreTerapeuta}</p>`;
  return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #02807d; text-align: center;">¡Tu Compra en Encuentro de Sanación ha sido Confirmada!</h2>
            <p>Hola,</p>
            <p>Gracias por tu reserva. Aquí tienes los detalles de tu compra y los códigos de confirmación:</p>
            
            <div style="background: #f0f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #02807d; margin-top: 0;">Resumen de la Compra (${servicioTipo})</h3>
                <p><strong>Servicio:</strong> ${details.servicio}</p>
                <p><strong>Especialidad:</strong> ${details.especialidad}</p>
                <p><strong>Paquete:</strong> ${details.sesiones} sesiones</p>
                ${agendamientoInfo}
                <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
                <p><strong>Monto Pagado:</strong> ${details.precio}</p>
            </div>
            
            <div style="background: #fff; padding: 15px; border-radius: 5px; border: 1px dashed #ccc; margin-bottom: 20px;">
                <h3 style="color: #02807d; margin-top: 0;">Códigos de Transacción</h3>
                <p><strong>Código de Confirmación (Token):</strong> ${token}</p>
                <p><strong>ID de Transacción:</strong> ${transactionId}</p>
                <p style="font-size: 0.9em; color: #666;">Guarda estos códigos, son tu comprobante de pago.</p>
            </div>
            
         <div style="background: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #02807d; margin-top: 0;">Detalles del Cliente</h3>
                ${
    esGiftCard
      ? clienteDisplay // Ya incluye todos los datos de destinatario/remitente
      : `<p><strong>Cliente:</strong> ${details.clienteNombre}</p>
                       <p><strong>Teléfono de Contacto:</strong> ${details.clienteTelefono}</p>` // Solo muestra nombre y teléfono para reservas normales
  }
                ${esGiftCard ? mensajePersonalizadoHtml : ""}
            </div>
            
            <p style="text-align: center;">El equipo de Encuentro de Sanación te contactará pronto.</p>
        </div>
    `;
};

// --- 3. FUNCIÓN PRINCIPAL NUEVA: Enviar Correo de Confirmación (con guardado) ---
const sendConfirmationEmail = async (req, res) => {
  // Desestructurar: email, token, transactionId y el objeto anidado 'details'
  const { email, token, transactionId, details } = req.body;

  if (!email || !token || !transactionId || !details) {
    // Validamos que los 4 estén presentes
    return res
      .status(400)
      .json({ error: "Faltan datos requeridos para enviar la confirmación." });
  }

  try {
    const subject = "✅ Confirmación de Compra en Encuentro de Sanación";
    // Genera el HTML de confirmación
    const htmlContent = generateConfirmationHtml(details, token, transactionId);

    // 1. Enviar el correo al email proporcionado por el cliente
    await sendEmail(email, subject, htmlContent);

    // 2. BUSCAR Y ACTUALIZAR LA TRANSACCIÓN CON EL EMAIL
    try {
      // Buscamos por el ID interno de la tabla Transacciones
      const transaccion = await Transaccion.findByPk(transactionId);
      if (transaccion) {
        // Solo actualiza si el campo está vacío o es nulo (para no sobreescribir)
        if (!transaccion.clienteEmail) {
          await transaccion.update({ clienteEmail: email });
          console.log(
            `[EMAIL COMPROBANTE] Transacción ${transactionId} actualizada con el correo del cliente: ${email}`
          );
        }
      } else {
        console.warn(
          `[EMAIL COMPROBANTE] Transacción ${transactionId} no encontrada para guardar el email.`
        );
      }
    } catch (dbError) {
      console.error(
        "[EMAIL COMPROBANTE] Error al guardar el email en Transacciones:",
        dbError
      );
      // El error de DB no impide que se devuelva el éxito al cliente.
    }
    // -----------------------------------------------------------------

    return res
      .status(200)
      .json({ message: `Correo de confirmación enviado a ${email}.` });
  } catch (error) {
    console.error(
      "Error al enviar el correo de confirmación al cliente:",
      error
    );
    // Devolvemos el error si el envío del email falló
    return res
      .status(500)
      .json({ error: "Fallo en el servidor al intentar enviar el correo." });
  }
};

// --- 4. EXPORTACIONES CORREGIDAS (Final del archivo) ---
module.exports = {
  subscribeEmail,
  sendConfirmationEmail,
};
