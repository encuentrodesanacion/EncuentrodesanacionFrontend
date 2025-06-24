// const {
//   Options,
//   IntegrationApiKeys,
//   IntegrationCommerceCodes,
//   WebpayPlus,
//   Environment, // ✅ Agregado
// } = require("transbank-sdk");

// const options = new Options(
//   IntegrationCommerceCodes.WEBPAY_PLUS,
//   IntegrationApiKeys.WEBPAY,
//   Environment.Integration // ✅ Este es el valor correcto
// );

// const transaction = new WebpayPlus.Transaction(options);

// exports.crearTransaccion = async ({
//   amount,
//   sessionId,
//   buyOrder,
//   returnUrl,
// }) => {
//   try {
//     const response = await transaction.create(
//       buyOrder,
//       sessionId,
//       amount,
//       returnUrl
//     );
//     return response;
//   } catch (error) {
//     console.error("Error al crear transacción:", error);
//     throw error;
//   }
// };

// exports.confirmarTransaccion = async (token) => {
//   try {
//     const response = await transaction.commit(token);
//     return response;
//   } catch (error) {
//     console.error("Error al confirmar transacción:", error);
//     throw error;
//   }
// };
