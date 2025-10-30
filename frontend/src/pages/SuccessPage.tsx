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
  clienteNombre: string;
  clienteTelefono: string;
  remitenteNombre?: string;
  remitenteTelefono?: string;
  mensajePersonalizado?: string;
}

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");

  // ESTADOS para el envío de confirmación
  const [clientEmailInput, setClientEmailInput] = useState<string>("");
  const [emailStatus, setEmailStatus] = useState<string>("");

  // ESTADOS CLAVE para la corrección
  const [purchaseDetails, setPurchaseDetails] =
    useState<PurchaseDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Nuevo estado de carga

  // FUNCIÓN CLAVE: Obtiene detalles del backend en caso de recarga o estado perdido
  const fetchPurchaseDetails = async (token: string, transactionId: string) => {
    if (token === "N/A" || transactionId === "N/A") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      // Llama al endpoint /api/webpay/details
      const response = await fetch(
        `${backendUrl}/api/webpay/details?token=${token}&transactionId=${transactionId}`
      );

      if (response.ok) {
        const data = await response.json();
        setPurchaseDetails(data);
      } else {
        console.error(
          "No se pudieron recuperar los detalles de la compra desde el servidor."
        );
        setEmailStatus(
          "⚠️ Error: No se pudieron cargar los detalles de la compra al recargar la página."
        );
      }
    } catch (error) {
      console.error(
        "Error de red al recuperar los detalles de la compra:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token") || "N/A";
    const urlTransactionId = params.get("transactionId") || "N/A";

    setToken(urlToken);
    setTransactionId(urlTransactionId);

    // 1. Intentar recuperar el estado de la navegación (datos al instante)
    if (
      location.state &&
      typeof location.state === "object" &&
      Object.keys(location.state).length > 0
    ) {
      setPurchaseDetails(location.state as PurchaseDetails);
      setIsLoading(false); // Detener la carga si los datos están presentes
    } else {
      // 2. Si el estado se perdió (p. ej., recarga), obtener los detalles del backend
      fetchPurchaseDetails(urlToken, urlTransactionId);
    }
  }, [location]);

  // Función para copiar el texto (sin cambios)
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

  // FUNCIÓN ACTUALIZADA: Envía el correo de confirmación al cliente
  const handleSendConfirmationEmail = async () => {
    if (!clientEmailInput) {
      setEmailStatus("Por favor, ingresa tu correo electrónico.");
      return;
    }

    // Validación que ahora depende de que los datos se hayan cargado correctamente
    if (!purchaseDetails) {
      setEmailStatus(
        "Error: Faltan detalles de la compra para enviar el correo. Por favor, recarga la página o inténtalo más tarde."
      );
      return;
    }

    setEmailStatus("Enviando correo de confirmación...");

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      // Prepara los datos a enviar.
      const emailData = {
        email: clientEmailInput,
        token: token,
        transactionId: transactionId,
        details: purchaseDetails, // Los detalles cargados (ya sea por state o fetch)
      };

      const response = await fetch(
        `${backendUrl}/api/marketing/send-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmailStatus(data.message || "¡Confirmación enviada con éxito!");
        setClientEmailInput("");
      } else {
        setEmailStatus(
          data.error || "Hubo un error al enviar el correo. Intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al enviar el correo de confirmación:", error);
      setEmailStatus("Error de conexión. Inténtalo de nuevo más tarde.");
    }
    setTimeout(() => setEmailStatus(""), 5000);
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

      {/* Nuevo: Bloque de carga */}
      {isLoading && (
        <div style={{ marginTop: "20px", color: "#02807d" }}>
          Cargando detalles de la compra...
        </div>
      )}
      {/* Nuevo div para el resumen de la compra */}
      {!isLoading && purchaseDetails && (
        <div
          style={{
            background: "#f0f8f8",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e0f2f2",
            maxWidth: "400px",
            width: "100%",
            marginBottom: "20px",
            marginTop: "20px",
            boxSizing: "border-box",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              color: "#02807d",
              fontSize: "1.5em",
              marginBottom: "15px",
              textAlign: "center",
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
          {/* Secciones de Fecha y Hora solo si no es Gift Card */}
          {purchaseDetails.servicio !== "GiftCard" && (
            <>
              <p>
                <strong>Fecha:</strong> {purchaseDetails.fecha}
              </p>
              <p>
                <strong>Hora:</strong> {purchaseDetails.hora}
              </p>
            </>
          )}
          <p>
            <strong>Sesiones:</strong> {purchaseDetails.sesiones}
          </p>
          <p>
            <strong>Precio:</strong> {purchaseDetails.precio}
          </p>

          {/* Cliente/Receptor */}
          {purchaseDetails.clienteNombre && (
            <p>
              <strong>Cliente/Receptor:</strong> {purchaseDetails.clienteNombre}
            </p>
          )}
          {purchaseDetails.clienteTelefono && (
            <p>
              <strong>Teléfono Cliente/Receptor:</strong>{" "}
              {purchaseDetails.clienteTelefono}
            </p>
          )}

          {/* --- DATOS DEL REMITENTE / TARJETA DE REGALO --- */}
          {purchaseDetails.remitenteNombre && (
            <>
              <h3
                style={{
                  marginTop: "15px",
                  color: "#02807d",
                  fontSize: "1.2em",
                  borderTop: "1px dashed #c0e0e0",
                  paddingTop: "15px",
                }}
              >
                Detalles de la Tarjeta de Regalo
              </h3>
              <p>
                <strong>Remitente:</strong> {purchaseDetails.remitenteNombre}
              </p>
              {purchaseDetails.remitenteTelefono && (
                <p>
                  <strong>Teléfono Remitente:</strong>{" "}
                  {purchaseDetails.remitenteTelefono}
                </p>
              )}
              {purchaseDetails.mensajePersonalizado && (
                <p>
                  <strong>Mensaje Personalizado:</strong>
                  <span
                    style={{
                      display: "block",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      marginTop: "5px",
                      backgroundColor: "#ffffff",
                      whiteSpace: "pre-wrap", // Conservar saltos de línea y espacios
                    }}
                  >
                    {purchaseDetails.mensajePersonalizado}
                  </span>
                </p>
              )}
            </>
          )}
          {/* --------------------------------------------- */}

          <p>
            <strong>Código de Confirmación:</strong> {token}
          </p>
          <p>
            <strong>ID de Transacción:</strong> {transactionId}
          </p>
        </div>
      )}

      {/* SECCIÓN DE CONFIRMACIÓN DE EMAIL */}
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
        <p
          style={{ fontSize: "1em", marginBottom: "10px", fontWeight: "bold" }}
        >
          ¿Necesitas una copia de la confirmación?
        </p>
        <p style={{ fontSize: "0.9em", marginBottom: "10px" }}>
          Ingresa tu correo electrónico para recibir un resumen de tu reserva y
          los códigos de transacción:
        </p>
        <input
          type="email"
          placeholder="tu_correo@ejemplo.com"
          value={clientEmailInput}
          onChange={(e) => setClientEmailInput(e.target.value)}
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
          onClick={handleSendConfirmationEmail}
          // Deshabilitar si está cargando o no hay detalles
          disabled={isLoading || !purchaseDetails}
          style={{
            padding: "10px 20px",
            fontSize: "1em",
            backgroundColor:
              isLoading || !purchaseDetails ? "#a0a0a0" : "#02807d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading || !purchaseDetails ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Mail size={20} /> Enviar Confirmación por Email
        </button>
        {emailStatus && (
          <p
            style={{
              fontSize: "0.9em",
              marginTop: "10px",
              color: emailStatus.includes("Error") ? "red" : "green",
            }}
          >
            {emailStatus}
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
