// frontend/src/pages/TratamientoHolistico.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Asegúrate de que esta ruta sea correcta
import { useCart, Reserva } from "../pages/CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes (se mantienen igual)
import Terapeuta29 from "../assets/mesaradio.jpeg";
import limpieza from "../assets/limpieza.jpeg";
import Terapeuta5 from "../assets/Terapeuta5.jpg";
import Terapeuta24 from "../assets/Terapeuta24.jpeg";
import creadorvirtual from "../assets/creadorvirtual.jpg";

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
      img: Terapeuta29,
      title: "Mesa radionica para la abundancia y prosperidad",
      terapeuta: "Ana Aros",
      terapeutaId: 23,
      description:
        "Está terapia te ayuda a trabajar con la energía de la abundancia y prosperidad en todos los ámbitos de tu vida, te ayuda a limpiar creencias limitantes en relación al merecimiento, potenciar ideas y proyectos, equilibrar tus finanzas y aperturar caminos a los cambios que necesitas para transitar desde la prosperidad que mereces.",
      opciones: [{ sesiones: 1, precio: 20000 }],
    },
    {
      img: limpieza,
      title: "Limpieza energética y protección",
      terapeuta: "Ana Aros",
      terapeutaId: 23,
      description:
        "Esta terapia te ayuda a limpiar toda la energía que está estancada en ti y no te permite avanzar en diferentes aspectos de tu vida, a través de esta terapia lograrás identificar lo que hay en ti y luego poder elevar tu vibración alcanzando un bienestar físico, emocional y mental.",
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
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">GiftCards</h1>
        <CartIcon />
        <div className="hidden md:flex items-center justify-start gap-6 p-4 pl-2 ml-auto md:mr-20">
          <Link
            to="/terapeutasdeluz"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
            Terapeutas de la Luz
          </Link>
          <Link
            to="/tratamientointegral"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
            Tratamiento Int.
          </Link>
          <Link
            to="/tallermensual"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
            Talleres Mensuales
          </Link>
          {/* <Link
            to="/psicologos"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
            Mente y Ser
          </Link> */}
        </div>
      </header>

      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Bienvenido a GiftCard
      </h2>
      <br></br>
      <br></br>

      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
        Nuestra Gift Card es el regalo perfecto porque no obsequias un objeto,
        sino una experiencia de crecimiento, paz y claridad personal. Regala un
        Camino de Transformación. El Obsequio más Consciente y Poderoso a Valor
        Amoroso.
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
                      (op: { sesiones: number; precio: number }, j: number) => (
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
                          {op.sesiones} sesiones (${op.precio.toLocaleString()}{" "}
                          CLP)
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Confirmar Compra de Gift Card
            </h3>
            <p className="text-gray-700 mb-4 text-center text-sm">
              Ingresa los datos del regalo para continuar con la reserva de{" "}
              <strong>
                {currentTerapiaData.sesiones} sesiones por $
                {currentTerapiaData.precio.toLocaleString()} CLP
              </strong>
              .
            </p>
            {/* --- CAMPOS DEL REMITENTE (QUIEN REGALA) --- */}
            <div className="mb-4">
              <label
                htmlFor="senderName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                1. Nombre de quien regala:
              </label>
              <input
                type="text"
                id="senderName"
                placeholder="Tu Nombre Completo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="senderPhone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                2. Número del remitente (Quien regala):
              </label>
              <input
                type="tel"
                id="senderPhone"
                placeholder="Ej: +56912345678"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
              />
            </div>
            {/* --- SEPARADOR --- */}
            <hr className="my-4" />
            {/* --- CAMPOS DEL DESTINATARIO (QUIEN RECIBE) --- */}
            <div className="mb-4">
              <label
                htmlFor="recipientName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                3. Nombre del destinatario (Quien recibe):
              </label>
              <input
                type="text"
                id="recipientName"
                placeholder="Nombre de la persona que recibe el regalo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="recipientPhone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                4. Número del destinatario:
              </label>
              <input
                type="tel"
                id="recipientPhone"
                placeholder="Ej: +56912345678"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="personalMessage"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                5. Déjale un mensaje personalizado:
              </label>
              <textarea
                id="personalMessage"
                placeholder="Ej: ¡Feliz cumpleaños! Espero que disfrutes de tu sesión."
                rows={3} // Opcional: define la altura del textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
