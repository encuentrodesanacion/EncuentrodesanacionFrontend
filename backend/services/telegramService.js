const axios = require('axios');

const enviarAlertaTelegram = async (mensaje) => {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: mensaje,
      parse_mode: 'HTML' // CAMBIADO de Markdown a HTML
    });
    console.log("[TELEGRAM SERVICE] Alerta enviada con éxito.");
  } catch (error) {
    // Si vuelve a fallar, este log nos dirá exactamente por qué
    console.error("[TELEGRAM ERROR] Detalle:", error.response?.data || error.message);
  }
};

module.exports = { enviarAlertaTelegram };