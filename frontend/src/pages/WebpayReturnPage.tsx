// src/pages/WebpayReturnPage.tsx

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WebpayReturnPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Define la URL base de la API aquí ---
  // const API_BASE_URL =
  //   process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"; // Usa la variable de entorno o localhost como fallback
  // Si usas Vite, sería:
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  // --- FIN Definición URL base ---

  useEffect(() => {
    const confirmPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token_ws = queryParams.get("token_ws");
      const tbk_token = queryParams.get("TBK_TOKEN");

      const finalToken = token_ws || tbk_token;

      if (!finalToken) {
        navigate("/pago-fallido?error=no_token", { replace: true });
        return;
      }

      try {
        // --- CAMBIO AQUÍ: Usar API_BASE_URL para la llamada fetch ---
        const response = await fetch(
          `${API_BASE_URL}/api/webpay/confirmacion?token_ws=${finalToken}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const htmlResponse = await response.text();

        // --- FIX: Check for relevant paths instead of full URLs with process.env ---
        if (htmlResponse.includes("/pago-confirmacion-exito")) {
          navigate(`/pago-confirmacion-exito?token=${finalToken}`, {
            replace: true,
          });
        } else if (htmlResponse.includes("/pago-fallido")) {
          navigate(`/pago-fallido?token=${finalToken}&status=rejected`, {
            replace: true,
          });
        } else {
          if (response.ok) {
            navigate(`/pago-confirmacion-exito?token=${finalToken}`, {
              replace: true,
            });
          } else {
            navigate(
              `/pago-fallido?error=unknown_backend_response&token=${finalToken}`,
              { replace: true }
            );
          }
        }
      } catch (error) {
        console.error(
          "Error al comunicarse con el backend para confirmar pago:",
          error
        );
        navigate(
          `/pago-fallido?error=communication_error&message=${encodeURIComponent(
            error instanceof Error ? error.message : String(error)
          )}`,
          { replace: true }
        );
      }
    };

    confirmPayment();
  }, [location.search, navigate]);

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="text-2xl text-blue-600">
        <p>Procesando tu pago y confirmando la transacción...</p>
        <p>Por favor, espera.</p>
      </div>
    </div>
  );
};

export default WebpayReturnPage;
