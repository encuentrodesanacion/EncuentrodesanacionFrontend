// frontend/src/pages/SuccessPage.tsx
import { Heart, Copy, Mail } from "lucide-react";
import React, { useEffect, useState } from "react"; // Mantén React si usas JSX/TSX directamente
import { useLocation, useNavigate } from "react-router-dom";

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>(""); // Añade tipo string
  const [transactionId, setTransactionId] = useState<string>(""); // Añade tipo string
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [emailMarketingInput, setEmailMarketingInput] = useState<string>("");
  const [marketingSubscribeStatus, setMarketingSubscribeStatus] =
    useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "N/A");
    setTransactionId(params.get("transactionId") || "N/A");
  }, [location]);

  // Función para copiar el texto con tipos definidos
  const copyToClipboard = async (textToCopy: string, fieldName: string) => {
    // <-- CORRECCIÓN AQUÍ: Añadir tipos
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(`¡${fieldName} copiado!`);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Error al copiar.");
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  // Función para manejar la suscripción al marketing
  const handleMarketingSubscribe = async () => {
    if (!emailMarketingInput) {
      setMarketingSubscribeStatus("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setMarketingSubscribeStatus("Suscribiendo...");

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/api/marketing/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailMarketingInput }),
      });

      const data = await response.json();

      if (response.ok) {
        setMarketingSubscribeStatus(
          data.message || "¡Gracias por suscribirte!"
        );
        setEmailMarketingInput("");
      } else {
        setMarketingSubscribeStatus(
          data.error || "Hubo un error al suscribirte."
        );
      }
    } catch (error) {
      console.error("Error al suscribirse al marketing:", error);
      setMarketingSubscribeStatus(
        "Error de conexión. Inténtalo de nuevo más tarde."
      );
    }
    setTimeout(() => setMarketingSubscribeStatus(""), 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "20px",
        textAlign: "center",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: "900px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Ícono de éxito */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
          color: "green",
          width: "80px",
          height: "80px",
          marginBottom: "20px",
        }}
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>

      <h1
        style={{
          color: "#02807d",
          fontSize: "2.5em",
          marginBottom: "10px",
          wordBreak: "break-word",
        }}
      >
        ¡Reserva Confirmada con Éxito!
      </h1>
      <p style={{ fontSize: "1.2em", margin: "0" }}>
        Tu camino de sanación ha comenzado.
      </p>

      <p style={{ fontSize: "1.1em", margin: "15px 0" }}>
        ¡Hemos procesado tu solicitud!
      </p>

      <div
        style={{
          background: "#f0f8f8",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #e0f2f2",
          maxWidth: "400px",
          width: "100%",
          marginBottom: "20px",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: "5px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <strong>Código de Confirmación:</strong> {token}
          <button
            onClick={() => copyToClipboard(token, "Token")}
            style={{
              marginLeft: "10px",
              padding: "5px 8px",
              fontSize: "0.8em",
              backgroundColor: "#e0f2f2",
              border: "1px solid #c0e0e0",
              borderRadius: "3px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              flexShrink: 0,
            }}
            aria-label="Copiar token"
          >
            <Copy size={16} /> Copiar
          </button>
        </p>
        <p
          style={{
            margin: "5px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <strong>ID de Transacción:</strong> {transactionId}
          <button
            onClick={() => copyToClipboard(transactionId, "ID de Transacción")}
            style={{
              marginLeft: "10px",
              padding: "5px 8px",
              fontSize: "0.8em",
              backgroundColor: "#e0f2f2",
              border: "1px solid #c0e0e0",
              borderRadius: "3px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              flexShrink: 0,
            }}
            aria-label="Copiar ID de Transacción"
          >
            <Copy size={16} /> Copiar
          </button>
        </p>
        {copySuccess && (
          <p style={{ color: "green", fontSize: "0.9em", marginTop: "10px" }}>
            {copySuccess}
          </p>
        )}
      </div>
      {/* Sección para el input de correo de Marketing */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "1em", marginBottom: "10px" }}>
          Si deseas recibir ofertas o nuevas instancias para eventos de tiempo
          limitado deja tu correo aqui :
        </p>
        <input
          type="email"
          placeholder="tu_correo@ejemplo.com"
          value={emailMarketingInput}
          onChange={(e) => setEmailMarketingInput(e.target.value)}
          style={{
            width: "calc(100% - 22px)",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1em",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleMarketingSubscribe}
          style={{
            padding: "10px 20px",
            fontSize: "1em",
            backgroundColor: "#02807d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Mail size={20} /> Suscribirme
        </button>
        {marketingSubscribeStatus && (
          <p
            style={{
              fontSize: "0.9em",
              marginTop: "10px",
              color: marketingSubscribeStatus.includes("Error")
                ? "red"
                : "green",
            }}
          >
            {marketingSubscribeStatus}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <p
          style={{ fontSize: "1.1em", marginBottom: "25px", lineHeight: "1.6" }}
        >
          <span style={{ fontWeight: "bold" }}>¿Qué sigue?</span> Espera la
          confirmación de tu terapeuta. Se pondrá en contacto contigo y te
          entregará toda la información de la elección que has hecho para tu
          proceso de SANACIÓN. ¡Eres tan VALIENTE! Te admiramos por eso.
        </p>
        {/* Icono Heart de Lucide React, con estilos ajustados */}
        <Heart size={30} style={{ marginBottom: "30px", color: "#ff69b4" }} />
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 25px",
            fontSize: "1.1em",
            backgroundColor: "#02807d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            minWidth: "180px",
          }}
        >
          Volver al Inicio
        </button>
      </div>

      <p style={{ fontSize: "0.9em", color: "#666" }}>
        Si tienes alguna pregunta, no dudes en contactarnos.
      </p>
    </div>
  );
}

export default SuccessPage;
