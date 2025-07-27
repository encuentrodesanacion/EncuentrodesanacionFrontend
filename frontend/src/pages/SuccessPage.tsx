// frontend/src/pages/SuccessPage.tsx
import { Heart, Copy, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Define una interfaz para los detalles de la compra para mayor tipado y claridad
interface PurchaseDetails {
  servicio: string;
  especialidad: string;
  nombreTerapeuta: string;
  fecha: string;
  hora: string;
  sesiones: number;
  precio: string; // O number, dependiendo de cómo lo manejes
  clienteNombre: string; // Agregado según tu ejemplo
  clienteTelefono: string; // Agregado según tu ejemplo
}

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [emailMarketingInput, setEmailMarketingInput] = useState<string>("");
  const [marketingSubscribeStatus, setMarketingSubscribeStatus] =
    useState<string>("");

  // Nuevo estado para los detalles de la compra
  const [purchaseDetails, setPurchaseDetails] =
    useState<PurchaseDetails | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "N/A");
    setTransactionId(params.get("transactionId") || "N/A");

    // Recuperar el estado de la navegación
    if (location.state && typeof location.state === "object") {
      setPurchaseDetails(location.state as PurchaseDetails);
    }
  }, [location]);

  // Función para copiar el texto
  const copyToClipboard = async (textToCopy: string, fieldName: string) => {
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

      {/* Nuevo div para el resumen de la compra */}
      {purchaseDetails && (
        <div
          style={{
            background: "#f0f8f8",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e0f2f2",
            maxWidth: "400px",
            width: "100%",
            marginBottom: "20px",
            marginTop: "20px", // Añade un poco de espacio
            boxSizing: "border-box",
            textAlign: "left", // Alinea el texto a la izquierda para el resumen
          }}
        >
          <h2
            style={{
              color: "#02807d",
              fontSize: "1.5em",
              marginBottom: "15px",
              textAlign: "center", // Centra el título del resumen
            }}
          >
            Resumen de tu Compra
          </h2>
          <p>
            <strong>Servicio:</strong> {purchaseDetails.servicio}
          </p>
          <p>
            <strong>Especialidad:</strong> {purchaseDetails.especialidad}
          </p>
          <p>
            <strong>Terapeuta:</strong> {purchaseDetails.nombreTerapeuta}
          </p>
          <p>
            <strong>Fecha:</strong> {purchaseDetails.fecha}
          </p>
          <p>
            <strong>Hora:</strong> {purchaseDetails.hora}
          </p>
          <p>
            <strong>Sesiones:</strong> {purchaseDetails.sesiones}
          </p>
          <p>
            <strong>Precio:</strong> {purchaseDetails.precio}
          </p>
          {/* Datos del cliente si están disponibles */}
          {purchaseDetails.clienteNombre && (
            <p>
              <strong>Cliente:</strong> {purchaseDetails.clienteNombre}
            </p>
          )}
          {purchaseDetails.clienteTelefono && (
            <p>
              <strong>Teléfono Cliente:</strong>{" "}
              {purchaseDetails.clienteTelefono}
            </p>
          )}
          <p>
            <strong>Código de Confirmación:</strong> {token}
          </p>
          <p>
            <strong>ID de Transacción:</strong> {transactionId}
          </p>
        </div>
      )}

      {/* Bloque existente para Código de Confirmación y ID de Transacción (puedes decidir si mantenerlo duplicado o solo en el resumen) */}
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
