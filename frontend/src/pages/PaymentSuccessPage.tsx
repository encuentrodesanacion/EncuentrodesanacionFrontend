// src/pages/PaymentSuccessPage.tsx

import { useEffect, useState, useCallback } from "react"; // Import useCallback if clearCart isn't memoized
import { useLocation } from "react-router-dom";
import { useCart } from "../pages/CartContext"; // Import useCart para acceder a clearCart

function PaymentSuccessPage() {
  const location = useLocation();
  const { clearCart } = useCart();
  const [token, setToken] = useState<string | null>(null);

  // Memoize clearCart call if it's not already memoized in CartContext
  // If useCart already uses useCallback for clearCart, this might not be strictly necessary,
  // but it's a good safety measure if you suspect clearCart itself is causing re-renders.
  const memoizedClearCart = useCallback(() => {
    clearCart();
  }, []);
  // Dependency array here ensures memoizedClearCart only changes if clearCart itself changes

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const receivedToken = params.get("token");
    if (receivedToken) {
      setToken(receivedToken);
    }

    // Call clearCart only once when the component mounts
    memoizedClearCart(); // Call the memoized version

    // Dependencias: location.search para que se ejecute si cambian los parámetros de la URL,
    // pero clearCart NO va aquí si lo queremos ejecutar una sola vez.
    // Si memoizedClearCart fuera definido *dentro* del useEffect, no se necesitaría en deps.
  }, [location.search, memoizedClearCart]); // Only depend on location.search and the memoized function

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ ¡Pago Exitoso!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Tu reserva ha sido confirmada con éxito.
        </p>
        {token && (
          <p className="text-sm text-gray-500">
            Número de referencia: <strong>{token}</strong>
          </p>
        )}
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

export default PaymentSuccessPage;
