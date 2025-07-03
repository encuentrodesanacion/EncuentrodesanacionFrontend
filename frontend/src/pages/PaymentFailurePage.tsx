// src/pages/PaymentFailurePage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate para redirigir programáticamente

function PaymentFailurePage() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para la navegación
  const [token, setToken] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Para el status de Transbank
  const [displayMessage, setDisplayMessage] = useState(
    "Lo sentimos, tu pago no pudo ser procesado."
  ); // Mensaje principal

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const receivedToken = params.get("token");
    const receivedStatus = params.get("status"); // <-- Leer el parámetro 'status'
    const receivedError = params.get("error"); // Para errores generales pasados desde el backend
    const receivedErrorCode = params.get("code"); // Si tu backend envía un 'code' adicional

    if (receivedToken) {
      setToken(receivedToken);
    }
    if (receivedStatus) {
      setPaymentStatus(receivedStatus);
      // Ajustar el mensaje basado en el status
      switch (receivedStatus) {
        case "REJECTED":
          setDisplayMessage(
            "Tu pago fue rechazado por el banco. Por favor, verifica los datos de tu tarjeta o inténtalo con otro método."
          );
          break;
        case "ABORTED":
          setDisplayMessage(
            "El pago fue cancelado por ti. Puedes intentarlo de nuevo si lo deseas."
          );
          break;
        case "FAILED":
          setDisplayMessage(
            "La transacción ha fallado. Por favor, inténtalo más tarde o contacta a soporte."
          );
          break;
        case "EXPIRED":
          setDisplayMessage(
            "El tiempo para completar el pago ha expirado. Por favor, inténtalo de nuevo."
          );
          break;
        case "NULLIFIED": // Posible estado de anulación interna de Transbank
          setDisplayMessage(
            "La transacción ha sido anulada. Si esto fue inesperado, contacta a soporte."
          );
          break;
        // Puedes añadir más casos según los estados de Transbank o tu lógica.
        // Por ejemplo, si el backend pasa 'error=missing_token'
        default:
          setDisplayMessage(
            `Tu pago no pudo ser procesado. Estado: ${receivedStatus}.`
          );
          break;
      }
    } else if (receivedError === "missing_token") {
      // Manejar el caso específico de missing_token si llega como 'error'
      setDisplayMessage(
        "No se recibió la información de la transacción. Esto puede ocurrir si cierras la ventana de pago antes de tiempo o si hubo un problema de conexión. Por favor, inténtalo de nuevo."
      );
    } else if (receivedError) {
      // Mensaje de error general si el backend lo envía
      setDisplayMessage(
        `Ocurrió un error inesperado: ${decodeURIComponent(
          receivedError
        )}. Por favor, contacta a soporte.`
      );
    } else if (receivedErrorCode) {
      // Si solo se pasa un código de error sin un 'status' o 'error' descriptivo
      setDisplayMessage(
        `Tu pago no pudo ser procesado. Código: ${receivedErrorCode}.`
      );
    }
  }, [location.search]);

  const handleVolverAlInicio = () => {
    navigate("/"); // Usar navigate para una navegación más limpia
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          ❌ ¡Pago Fallido!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          {displayMessage} {/* Mostrar el mensaje dinámico */}
        </p>
        {paymentStatus &&
          paymentStatus !== "missing_token" && ( // Mostrar el status si existe y no es el de missing_token
            <p className="text-sm text-gray-600 mb-2">
              Estado de Transbank: <strong>{paymentStatus}</strong>
            </p>
          )}
        {token && ( // Mostrar el token de referencia
          <p className="text-sm text-gray-500">
            Referencia de transacción: <strong>{token}</strong>
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">
          Si el problema persiste, contacta a soporte.
        </p>
        <div className="mt-8">
          <button // Usar un button con onClick y navigate
            onClick={handleVolverAlInicio}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailurePage;
