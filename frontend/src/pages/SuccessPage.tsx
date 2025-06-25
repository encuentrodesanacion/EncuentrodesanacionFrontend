// frontend/src/pages/SuccessPage.js (ejemplo en React)
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SuccessPage() {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "N/A");
    setTransactionId(params.get("transactionId") || "N/A");
  }, [location]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>¡Pago Confirmado con Éxito!</h1>
      <p>Tu transacción ha sido procesada correctamente.</p>
      <p>Gracias por tu reserva.</p>
      <p>Número de Confirmación (Token): {token}</p>
      <p>ID de Transacción: {transactionId}</p>
      <p>
        Revisa tu correo para los detalles de la reserva y notificación al
        terapeuta.
      </p>
      <button onClick={() => (window.location.href = "/")}>
        Volver al inicio
      </button>
    </div>
  );
}

export default SuccessPage;
