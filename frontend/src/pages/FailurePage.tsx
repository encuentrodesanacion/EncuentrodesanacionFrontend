// src/pages/PaymentFailurePage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Necesitarás instalar react-router-dom

function PaymentFailurePage() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el token y el código de error de la URL asd
    const params = new URLSearchParams(location.search);
    const receivedToken = params.get("token");
    const receivedErrorCode = params.get("code"); // Si tu backend envía un 'code'
    if (receivedToken) {
      setToken(receivedToken);
    }
    if (receivedErrorCode) {
      setErrorCode(receivedErrorCode);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          ❌ ¡Pago Fallido!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Lo sentimos, tu pago no pudo ser procesado.
        </p>
        {errorCode && (
          <p className="text-sm text-gray-600 mb-2">
            Código de error: <strong>{errorCode}</strong>
          </p>
        )}
        {token && (
          <p className="text-sm text-gray-500">
            Referencia de transacción: <strong>{token}</strong>
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">
          Por favor, inténtalo de nuevo o contacta a soporte.
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailurePage;
