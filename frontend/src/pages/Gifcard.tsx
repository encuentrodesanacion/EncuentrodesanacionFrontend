// frontend/src/pages/TratamientoHolistico.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Asegúrate de que esta ruta sea correcta
import { useCart, Reserva } from "../pages/CartContext";

import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes (se mantienen igual)
import radionica from "../assets/radionica.png";
import cuencotibet from "../assets/cuencotibet.png";
import limpieza from "../assets/Limpiezaa.png";
import paola from "../assets/lecturadelalma.png";
import recalibracion from "../assets/recalibracion.png";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import raices from "../assets/sanarraiz.jpeg";
import limpiezaene from "../assets/Limpiezaenerg.png";
import ejerciciostre from "../assets/ejtre.png";
import biomagnetismocon from "../assets/biomagne.jpg";
import constfam from "../assets/Sanandopatrones.png";
import purificacion from "../assets/limppene.png";
import arteterapia from "../assets/arttt.jpg";
import tarotter from "../assets/tarotter.jpg";
import ruido from "../assets/ruido.jpg";
import terapiaresp from "../assets/Trespiri.png";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  terapeutaId: number;
  description: string;
  opciones: { sesiones: number; precio: number }[];
}

export default function TratamientoHolistico() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showContactModal, setShowContactModal] = useState(false);
  // --- ESTADOS ACTUALIZADOS PARA REMITENTE Y DESTINATARIO ---
  const [senderName, setSenderName] = useState(""); // Nombre de quien regala
  const [senderPhone, setSenderPhone] = useState(""); // Número de quien regala
  const [recipientName, setRecipientName] = useState(""); // Nombre del destinatario
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [personalMessage, setPersonalMessage] = useState(""); // Número del destinatario

  const [currentTerapiaData, setCurrentTerapiaData] = useState<{
    terapiaTitle: string;
    sesiones: number;
    precio: number;
    terapeutaNombre: string;
    terapeutaId: number;
  } | null>(null);

  const terapias: TerapiaItem[] = [
    {
      img: limpiezaene,
      title: "Limpieza energética",
      terapeuta: "Ana Aros",
      terapeutaId: 23,
      description:
        "Cierra el año 2025 de la mejor manera, limpia toda aquella energía que necesitas transmutar para elevar y renovar tu bienestar integral.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },

    {
      img: ruido,
      title: "Limpieza de Ruido Mental y Emocional",
      terapeuta: "Beatriz Lagos",
      terapeutaId: 39,
      description:
        "Mi terapia de limpieza de ruido mental y emocional es para valientes que sienten saturación, ansiedad, confusión o simplemente “demasiado dentro de la cabeza”. A través de escucha consciente, lectura intuitiva y reordenamiento energético, disolvemos bloqueos, limpiamos tu campo y abrimos un espacio de calma profunda. Sales con claridad, descanso interior y la sensación real de volver a tu esencia.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: terapiaresp,
      title: "Terapia de Respuesta Espiritual (TRE)",
      terapeuta: "Claudia Diaz",
      terapeutaId: 41,
      description:
        "La terapia de respuesta espiritual:es un meticuloso proceso de los archivos del subconsciente y del alma.Con la ayuda de tus guías espirituales y a través del uso del péndulo y gráficos de trabajo, investigamos bloqueos de programas o energías discordantes que afecten tu vida en el área espiritual, física o emocional de esta vida o vidas pasadas. Te liberas para poder vivir con todo tu potencial y para poder expresar tu mejor “yo espiritual”",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },

    {
      img: cuencotibet,
      title: "Limpieza energética con cuenco tibetano",
      terapeuta: "Annette Wanninger",
      terapeutaId: 43,
      description:
        "El maravilloso sonido del cuenco tibetano nos llega al alma. Hace vibrar nuestra alma. El sonido libera tensiones, moviliza las fuerzas de autocuración, alinear los chakras y libera energía creativa.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: arteterapia,
      title: "Arteterapia Identidad que renace",
      terapeuta: "Belén Vera",
      terapeutaId: 44,
      description:
        "¿Sientes que tolerado relaciones poco sanas, tienes autocrítica excesiva, dificultad para poner límites, comparación constante, miedo a equivocarte y necesidad de aprobación externa? Al finalizar la sesión, no solo serás capaz de reconocer tu propia valía, sino que además podrás adquirir herramientas valiosas para seguir fortaleciendo tu autoestima y amor propio. Utilizo la Arteterapia como medio terapéutico para poder guiarte a descubrir esos maravillosos recursos internos que te harán brillar en tu máximo potencial.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: constfam,
      title: "Constelaciones Familiares",
      terapeuta: "Paola Quintero",
      terapeutaId: 11,
      description:
        "La constelación familiar es una terapia que nos permite comprender cómo nuestra historia y la de nuestros ancestros influye en nuestra vida. A través de ella, reconocemos nuestro lugar dentro del árbol genealógico, sanamos heridas de la infancia, liberamos patrones emocionales heredados, fortalecemos el autoestima,  integramos la energía de mamá y papá de forma adecuada.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },

    {
      img: tarotter,
      title: "Tarot Terapéutico",
      terapeuta: "Luisa Manríquez",
      terapeutaId: 42,
      description:
        "Regala una experiencia de claridad y bienestar. Esta sesión de tarot terapéutico ofrece orientación en momentos donde se necesita luz, fortaleciendo la autoestima, las habilidades y las competencias personales. A través de tiradas dinámicas y participativas, la persona atendida forma parte activa del proceso, conectando las cartas con su historia y su crecimiento. Un espacio seguro para encontrarse, reflexionar y avanzar con confianza.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: purificacion,
      title: "Purificación y Limpieza de Energías Negativas",
      terapeuta: "Sandra Da Silva",
      terapeutaId: 9,
      description:
        "Es una Terapia de Limpieza profunda que nos permite remover de tu ADN energético toda la contaminación absorbida y enviada por otras personas hacia ti, liberando tu energía de cargas que te estancan e impiden tu evolución de vida. Nos permite liberar energías negativas producidas por tus propios pensamientos y emociones, magia negra, brujerías, hechicería, maldiciones, envidia y cualquier energía densa enviada por alguien más.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },

    {
      img: raices,
      title: "Sanación de Raíces",
      terapeuta: "Sarita Infante",
      terapeutaId: 26,
      description:
        "Esta terapia te ayuda a limpiar toda la energía que está estancada en ti y no te permite avanzar en diferentes aspectos de tu vida, a través de esta terapia lograrás identificar lo que hay en ti y luego poder elevar tu vibración alcanzando un bienestar físico, emocional y mental.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: biomagnetismocon,
      title: "Biomagnetismo con bioenergía",
      terapeuta: "Pamela Benavides",
      terapeutaId: 31,
      description:
        "Biomagnetismo, terapia basada en las vibraciones magnéticas que generan los imanes, enviada a distancia, para influir beneficiosamente en los órganos, sumada la Bioenergía, que ayuda a equilibrar, ordenar y reestablecer el flujo energético y vital del organismo.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: ejerciciostre,
      title: "TRE (Ejercicios para liberar estrés/tensión y trauma del cuerpo)",
      terapeuta: "Gabriela Pinto",
      terapeutaId: 34,
      description:
        "Son ejercicios guiados que ayudan a liberar el estrés acumulado, a través, de la vibración natural producida en nuestro cuerpo, libera la tension física y emocional, y te permite volver a un estado de equilibrio.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },

    // {
    //   img: delalma,
    //   title: "La Lectura de Alma",
    //   terapeuta: "Paola Rioseco",
    //   terapeutaId: 37,
    //   description:
    //     "Revela la misión de vida, los aprendizajes esenciales y los bloqueos emocionales que limitan tu camino, ofreciendo claridad profunda para alinearte con tu propósito. Basada en la fecha de nacimiento.",
    //   opciones: [{ sesiones: 1, precio: 20000 }],
    // },
    {
      img: paola,
      title: "La Lectura de Alma",
      terapeuta: "Paola Rioseco",
      terapeutaId: 37,
      description:
        "La lectura de alma revela la misión de vida, los aprendizajes esenciales y los bloqueos emocionales que limitan tu camino, ofreciendo claridad profunda para alinearte con tu propósito. Basada en la fecha de nacimiento.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },

    // {
    //   img: creadorvirtual,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeutaId: 10,
    //   description:
    //     "Esta maravillosa Técnica de Sanación te permitirá una conexión intima con tu Ser, nos ayudará a realizar una investigación para conocer todo aquello que quedo grabado en tu Alma y en tu mente subconsciente, que impide que evoluciones en esta vida y que puedas soltar que le pesa. Puedes solicitar este Tratamiento si quieres: Limpiar sentimientos, actitudes y emociones toxicas. (Ansiedad, Depresión, etc.) Limpiar patrones emocionales familiares, de pareja, laborales. Remover bloqueos de cualquier índole, incluyendo energías de bajo astral  (hechicería, magia negra, envidia, etc.). Re-conectarás con tu esencia para que puedas iniciar cambios positivos en tu vida.",
    //   opciones: [{ sesiones: 1, precio: 20000 }],
    // },
    // Se mantiene la plantilla de terapias omitida por brevedad
  ];

  const reservarSesion = (
    terapiaTitle: string,
    sesiones: number,
    precio: number,
    terapeutaNombre: string,
    terapeutaId: number
  ) => {
    if (
      !terapiaTitle ||
      typeof terapiaTitle !== "string" ||
      terapiaTitle.trim() === ""
    ) {
      alert("Error: El nombre del servicio no es válido.");
      console.error("Servicio inválido detectado:", terapiaTitle);
      return;
    }
    if (typeof precio !== "number" || isNaN(precio) || precio <= 0) {
      alert("Error: El precio no es válido o es cero.");
      console.error("Precio inválido detectado:", precio);
      return;
    }

    setCurrentTerapiaData({
      terapiaTitle,
      sesiones,
      precio,
      terapeutaNombre,
      terapeutaId,
    });
    setShowContactModal(true);
    // Resetear los 4 estados al abrir el modal
    setSenderName("");
    setSenderPhone("");
    setRecipientName("");
    setRecipientPhone("");
    console.log("--- DEBUG: Modal de contacto abierto para reservarSesion ---");
  };

  // --- FUNCIÓN DE CONFIRMACIÓN MODIFICADA PARA REMITENTE/DESTINATARIO ---
  const handleConfirmAndAddToCart = async () => {
    if (!currentTerapiaData) {
      console.error("Error: currentTerapiaData es nulo al confirmar.");
      alert("Hubo un error al procesar tu reserva. Intenta de nuevo.");
      return;
    }

    // --- NUEVAS VALIDACIONES DE LOS CUATRO CAMPOS ---
    if (
      senderName.trim() === "" ||
      senderPhone.trim() === "" ||
      recipientName.trim() === "" ||
      recipientPhone.trim() === ""
    ) {
      alert(
        "Por favor, ingresa el nombre y número de teléfono de quien regala y de quien recibe."
      );
      return;
    }

    const senderPhoneNumber = parsePhoneNumberFromString(senderPhone.trim());
    const recipientPhoneNumber = parsePhoneNumberFromString(
      recipientPhone.trim()
    );

    if (!senderPhoneNumber || !senderPhoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono VÁLIDO para quien regala (remitente), incluyendo el código de país (ej. +56912345678)."
      );
      return;
    }

    if (!recipientPhoneNumber || !recipientPhoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono VÁLIDO para quien recibe (destinatario), incluyendo el código de país (ej. +56912345678)."
      );
      return;
    }
    // --------------------------------------------------

    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0];
    const horaGenerica = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: undefined,
      hour12: false,
    });

    // 1. El nombre del cliente es SÓLO el destinatario
    const nombreDestinatario = recipientName.trim();
    const telefonoDestinatario = recipientPhone.trim(); // Se mantiene en telefonoCliente

    // 2. Usar los nuevos campos individuales
    const remitenteNombre = senderName.trim();
    const remitenteTelefono = senderPhone.trim();
    const mensajePersonalizado = personalMessage
      .trim()
      .replace(/(\r\n|\n|\r)/gm, " ");

    const reservaDataToSend = {
      servicio: "GiftCard",
      especialidad: currentTerapiaData.terapiaTitle,
      fecha: fechaActual,
      hora: horaGenerica,
      precio: currentTerapiaData.precio,
      sesiones: currentTerapiaData.sesiones,
      cantidad: 1,

      // *** ASIGNACIÓN ACTUALIZADA DE CAMPOS ***
      nombreCliente: nombreDestinatario, // Solo el destinatario
      telefonoCliente: telefonoDestinatario, // Solo el teléfono del destinatario
      remitenteNombre: remitenteNombre, // Nuevo campo
      remitenteTelefono: remitenteTelefono, // Nuevo campo
      mensajePersonalizado: mensajePersonalizado, // Nuevo campo
      // ***************************************

      terapeuta: currentTerapiaData.terapeutaNombre,
      terapeutaId:
        currentTerapiaData.terapeutaId === 0
          ? null
          : currentTerapiaData.terapeutaId,
    };

    console.log(
      "Objeto Reserva a enviar a /reservar-directa (Gift Card):",
      reservaDataToSend
    );

    try {
      const response = await fetch(`${API_BASE_URL}/reservar-directa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaDataToSend),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage =
          errorBody.mensaje ||
          `Error al confirmar la inscripción: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json();

      console.log(
        "Reserva de Tratamiento Integral confirmada por backend:",
        confirmedReservation
      );

      addToCart(confirmedReservation); // Añadir la reserva completa del backend al carrito

      alert(
        `✅ ¡Gift Card agregada al carrito!\n` +
          `Se le Regalarán : ${confirmedReservation.sesiones} sesiones de ${confirmedReservation.especialidad}.\n al VALIENTE que registraste. Completa el proceso dirigiendote al carrito para que el/la terapeuta se comunique con tu ser querido. `
      );

      // Cierra el modal y resetea estados
      setShowContactModal(false);
      setCurrentTerapiaData(null);
      setSenderName(""); // Resetear nuevos estados
      setSenderPhone("");
      setRecipientName("");
      setRecipientPhone("");
      setPersonalMessage("");
    } catch (error: any) {
      console.error(
        "ERROR al crear la reserva de Tratamiento Integral:",
        error
      );
      alert(`No se pudo completar la inscripción: ${error.message}`);
    }
  };
  // --- FIN FUNCIÓN DE CONFIRMACIÓN MODIFICADA ---

  return (
    <div className="min-h-screen bg-white">
            {/* --- INICIO DEL HEADER Y NAVEGACIÓN --- */}     {" "}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-20 flex justify-between items-center px-5 py-5">
                {/* Título de la Página (Ajustado) */}       {" "}
        <h1 className="text-xl font-semibold text-gray-800 z-50">
                    GiftCards  {" "}
        </h1>
                {/* ⬅️ CONTENEDOR FLEXIBLE DE ÍCONOS (Móvil) ⬅️ */}       {" "}
        {/* Usamos ml-auto y -mr-4 para desplazar a la izquierda y separar del carrito */}
               {" "}
        <div className="flex items-center gap-4 md:hidden ml-auto -mr-4">
                    {/* 1. Botón Hamburguesa */}         {" "}
          <button
            className="p-2 text-gray-700 hover:text-pink-600 focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
                       {" "}
            {isMenuOpen ? (
              // Icono X (Cerrar)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
                             {" "}
              </svg>
            ) : (
              // Icono Menú Hamburguesa
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
                             {" "}
              </svg>
            )}
                     {" "}
          </button>
                    {/* Icono del Carrito (se mantiene) */}         
        </div>
                {/* --- MENÚ ESCRITORIO (md:flex) --- */}       {" "}
        {/* Esto solo se muestra en PC (md:flex) */}       {" "}
        <div className="hidden md:flex items-center justify-start gap-6 p-4 pl-2 ml-auto md:mr-20">
                   {" "}
          <Link
            to="/terapeutasdeluz"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Terapeutas de la Luz          {" "}
          </Link>
                   {" "}
          <Link
            to="/tratamientointegral"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Tratamiento Int.          {" "}
          </Link>
                   {" "}
          <Link
            to="/tallermensual"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Talleres Mensuales          {" "}
          </Link>
                   {" "}
          <Link
            to="/psicologos"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Mente y Ser          {" "}
          </Link>
                   {" "}
          <Link
            to="/giftcard"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        GiftCards          {" "}
          </Link>
                 {" "}
        </div>
             {" "}
      </header>
            {/* --- MENÚ DESPLEGABLE (MÓVIL) --- */}     {" "}
      {/* Se muestra si isMenuOpen es true y solo en pantallas pequeñas (md:hidden) */}
           {" "}
      <div
        className={`fixed top-16 left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 py-4"
            : "max-h-0 opacity-0 overflow-hidden"
        } z-40`}
      >
               {" "}
        <div className="flex flex-col items-center space-y-3 px-4">
                    {/* Enlaces del menú móvil */}         {" "}
          {[
            { to: "/terapeutasdeluz", label: "Terapeutas de la Luz" },
            { to: "/tratamientointegral", label: "Tratamiento Int." },
            { to: "/tallermensual", label: "Talleres Mensuales" },
            { to: "/psicologos", label: "Mente y Ser" },
            { to: "/giftcard", label: "GiftCards" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
              className="text-lg text-gray-800 hover:text-pink-600 py-2 w-full text-center border-b border-gray-100"
            >
                            {item.label}           {" "}
            </Link>
          ))}
                 {" "}
        </div>
             {" "}
      </div>
            {/* --- FIN DEL NAVEGADOR MÓVIL --- */}     {" "}
      {/* Botón de volver a Servicios (ajustado para que no lo tape el menú móvil) */}
           {" "}
      <div
        style={{
          padding: "2rem",
          paddingTop: "6rem",
          backgroundColor: "#fefefe",
          minHeight: "100vh",
        }}
      >
             
        <button
          onClick={() => navigate("/servicios")}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
                    Volver a Servicios        {" "}
        </button>
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
          Bienvenido a GiftCard
        </h2>
        <br></br>
        <br></br>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
          Nuestra Gift Card es el regalo perfecto porque no obsequias un objeto,
          sino una experiencia de crecimiento, paz y claridad personal. Regala
          un Camino de Transformación. El Obsequio más Consciente y Poderoso a
          Valor Amoroso.
        </p>
        <br></br>
        <br></br>
        <div className="flip-wrapper-container mt-10">
          {terapias.map(
            (
              t: TerapiaItem,
              i: number // Añadidos tipos explícitos para 't' y 'i'
            ) => (
              <div key={i} className="flip-wrapper">
                <div className="flip-card">
                  {/* MODIFICACIÓN AQUÍ: Eliminar flip-inner y aplicar estilos directamente a flip-card */}
                  <div className="flip-front">
                    <img src={t.img} alt={t.title} />
                    <div className="nombre-overlay">
                      <p>{t.terapeuta}</p>
                    </div>
                  </div>
                  <div className="flip-back">
                    <h3 className="mb-2 font-bold">{t.title}</h3>
                    <p className="mb-2">{t.description}</p>
                    <form
                      className="w-full px-2"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      {t.opciones.map(
                        (
                          op: { sesiones: number; precio: number },
                          j: number
                        ) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() =>
                              reservarSesion(
                                t.title,
                                op.sesiones,
                                op.precio,
                                t.terapeuta,
                                t.terapeutaId
                              )
                            }
                            className="w-full mb-2 px-2 py-1 border rounded bg-pink-600 text-white hover:bg-pink-700"
                          >
                            {op.sesiones} sesiones ($
                            {op.precio.toLocaleString()} CLP)
                          </button>
                        )
                      )}
                    </form>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {/* --- MODAL DE CONTACTO MODIFICADO --- */}
        {showContactModal && currentTerapiaData && (
          <div
            // OVERLAY: Permite el scroll vertical si el modal es más alto que la ventana (para móviles)
            className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-[100] p-4 overflow-y-auto"
          >
            <div
              // MODAL BLANCO: Reducir padding (p-6 a p-4) y ancho (max-w-xs).
              // CLAVE: Aplicar altura máxima (max-h-[90vh]) y scroll interno
              className="bg-white p-4 rounded-lg shadow-2xl max-w-sm md:max-w-xs w-full mt-10 mb-10 max-h-[90vh] overflow-y-scroll relative"
            >
              {/* 1. Encabezado */}
              <h3 className="text-xl font-semibold mb-2 text-center text-pink-700">
                {" "}
                {/* mb-4 a mb-2 */}
                Confirmar Compra de Gift Card
              </h3>
              <p className="text-gray-700 mb-3 text-center text-sm">
                {" "}
                {/* mb-4 a mb-3 */}
                Ingresa los datos del regalo para continuar con la reserva de{" "}
                <strong>
                  {currentTerapiaData.sesiones} sesiones por $
                  {currentTerapiaData.precio.toLocaleString()} CLP
                </strong>
                .
              </p>
              {/* --- CAMPOS DEL REMITENTE (QUIEN REGALA) --- */}
              <h4 className="text-md font-bold mt-3 mb-2 text-gray-800">
                Datos del Remitente:
              </h4>
              <div className="mb-3">
                {" "}
                {/* mb-4 a mb-3 */}
                <label
                  htmlFor="senderName"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  1. Nombre de quien regala:
                </label>
                <input
                  type="text"
                  id="senderName"
                  placeholder="Tu Nombre Completo"
                  // py-2 a py-1.5 (reduce altura)
                  className="shadow appearance-none border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                {" "}
                {/* mb-6 a mb-4 */}
                <label
                  htmlFor="senderPhone"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  2. Número del remitente (Quien regala):
                </label>
                <input
                  type="tel"
                  id="senderPhone"
                  placeholder="Ej: +56912345678"
                  className="shadow appearance-none border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                />
              </div>
              {/* --- SEPARADOR --- */}
              <hr className="my-3" /> {/* my-4 a my-3 */}
              {/* --- CAMPOS DEL DESTINATARIO (QUIEN RECIBE) --- */}
              <h4 className="text-md font-bold mt-3 mb-2 text-gray-800">
                Datos del Destinatario:
              </h4>
              <div className="mb-3">
                {" "}
                {/* mb-4 a mb-3 */}
                <label
                  htmlFor="recipientName"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  3. Nombre del destinatario (Quien recibe):
                </label>
                <input
                  type="text"
                  id="recipientName"
                  placeholder="Nombre de la persona que recibe el regalo"
                  className="shadow appearance-none border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                {" "}
                {/* mb-6 a mb-4 */}
                <label
                  htmlFor="recipientPhone"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  4. Número del destinatario:
                </label>
                <input
                  type="tel"
                  id="recipientPhone"
                  placeholder="Ej: +56912345678"
                  className="shadow appearance-none border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="personalMessage"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  5. Déjale un mensaje personalizado:
                </label>
                <textarea
                  id="personalMessage"
                  placeholder="Ej: ¡Feliz cumpleaños! Espero que disfrutes de tu sesión."
                  rows={2} // Reducido de rows={3} a rows={2}
                  className="shadow appearance-none border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none text-sm"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                />
              </div>
              {/* --- BOTONES DE ACCIÓN (Se mantendrán visibles gracias al scroll interno) --- */}
              <div className="flex justify-end space-x-3 sticky bottom-0 bg-white pt-2 border-t border-gray-200 -mx-4 px-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAndAddToCart}
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors duration-200"
                >
                  Confirmar y Añadir al Carrito
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
}
