import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/terapiaDeLuz.css";
// Ya no usaremos ReservaForm directamente para la selección de fecha/hora en este flujo.
// import ReservaForm from "../components/ReservaForm";
import CartIcon from "../components/CartIcon";
import { useCart, Reserva } from "./CartContext";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
import PermanentPopup from "../components/PermanentPopup";
import Terapeuta20 from "../assets/Terapeuta20.jpeg";
import RunasVikingas1 from "../assets/Terapeuta14.jpeg";
import coachdelser from "../assets/coachdelser.jpeg";
import crisolterap from "../assets/crisolterap.jpeg";

import velas from "../assets/Convelas.jpeg";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import { v4 as uuidv4 } from "uuid";
import parsePhoneNumberFromString from "libphonenumber-js";

interface ImagenData {
  id: string;
  src: string;
  alt: string; // Usado como el título de la "formación" y para la prop 'servicio'
  descripcion: string;
  link: string;
  terapeuta: string; // El nombre del terapeuta que conduce la "formación"
  terapeutaId: number;
  precio: number;
  duracion: string;
  isDisabled?: boolean;
}

const imagenesData: ImagenData[] = [
  {
    id: "Ritual-con-velas",
    src: velas,
    alt: "RITUAL CON VELAS",
    descripcion:
      "El Maestro Fuego, con mención en magia con velas, es una práctica espiritual que utiliza la energía del fuego como puente entre la intención personal y el universo. Cada color, forma o aroma de la vela se asocia a vibraciones específicas que ayudan a enfocar deseos, peticiones o procesos de sanación. Una sesión de magia con velas es un encuentro con lo sagrado, donde la llama se convierte en un mensajero entre el mundo terrenal y las fuerzas universales. Cada vela encendida despierta la energía ancestral del fuego, capaz de abrir caminos, transformar realidades y guiar el alma hacia la claridad.",
    terapeuta: "Ana Luisa Solervicens",
    link: "#",
    terapeutaId: 13,
    precio: 40000,
    duracion:
      "Inicia el  4 DE NOVIEMBRE A LAS 19:30HRS TODOS LOS MARTES DEL MES",
    isDisabled: false,
  },
  {
    id: "Coach-del-SER",
    src: coachdelser,
    alt: "Coach del SER",
    descripcion:
      "Es un programa diseñado para formar facilitadores conscientes, capaces de acompañar procesos de transformación profunda desde la integración de dos caminos complementarios:",
    link: "#",
    terapeuta: "Sarita Infante",
    terapeutaId: 26,
    precio: 50000,
    duracion:
      "PRIMERA CONVOCATORIA EL 1 DE DICIEMBRE A LAS 20:00HRS . SEGUNDA CONVOCATORIA EL 11 DE DICIEMBRE A LAS 19:00HRS ",
    isDisabled: false,
  },
  {
    id: "Liberacion-de-emociones-atrapadas",
    src: crisolterap,
    alt: "Liberación Emociones Atrapadas",
    descripcion:
      "Un viaje de transformación interior,aprendiendo a identificar emociones y liberar cargas energéticas para  reconectar con su luz individual y aprender a sanar en forma individual y grupal.",
    link: "#",
    terapeuta: "Crisolde Valenzuela",
    terapeutaId: 30,
    precio: 50000,
    duracion:
      "PRIMERA CONVOCATORIA EL 5 DE DICIEMBRE A LAS 19:00HRS . SEGUNDA CONVOCATORIA EL 11 DE DICIEMBRE A LAS 19:00HRS ",
    isDisabled: false,
  },

  // {
  //   id: "Tarot-Evolutivo",
  //   src: terapeuta19,
  //   alt: "Tarot Evolutivo",
  //   descripcion:
  //     "En este curso, descubrirás el Tarot, su origen y sus significados más profundos, utilizándolo como una herramienta de autoconocimiento. Incorporarás a tus lecturas los arcanos menores, que te ofrecerán una nueva dimensión para profundizar en el autoconocimiento, nuestras emociones y creencias. A continuación, te presentamos lo que aprenderás en este curso de Tarot: Qué es realmente el tarot Cómo diferenciar entre los diferentes tipos de tarot Consultar las cartas a ti mismo Usar el tarot como herramienta de autoayuda Aplicar las cartas de manera práctica en la vida cotidiana Significados de los arcanos menores desde un enfoque holístico Cómo cuidar tu energía, consejos de limpieza y protección del tarotista",
  //   link: "#",
  //   terapeuta: "Johanna Morales",
  //   duracion:
  //     "Inicia el 12 de Agosto a las 20:30hrs (SE REALIZA TODOS LOS MARTES DEL MES)",
  //   terapeutaId: 27,
  //   precio: 40000,
  //   isDisabled: true,
  // },
  // {
  //   id: "Alice-Basay",
  //   src: creadorvirtual,
  //   alt: "Regresión",
  //   descripcion: "Prueba Correo",
  //   link: "#",
  //   terapeuta: "Alice Basay",
  //   duracion: "tres",
  //   terapeutaId: 10,
  //   precio: 40000,
  // },
];

export default function Terapias() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // --- NUEVOS ESTADOS para controlar el modal de contacto ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [currentTerapia, setCurrentTerapia] = useState<ImagenData | null>(null); // Para guardar la terapia seleccionada temporalmente

  // --- Modificar handleAddToCart para abrir el modal ---
  const handleOpenContactModal = (terapia: ImagenData) => {
    setCurrentTerapia(terapia); // Guarda la terapia seleccionada
    setShowContactModal(true); // Abre el modal
    setClientName(""); // Resetea campos al abrir
    setClientPhone("");
  };

  // --- Nueva función para confirmar y añadir al carrito desde el modal ---
  const handleConfirmAndAddToCart = async () => {
    if (!currentTerapia) {
      console.error("Error: currentTerapiaData es nulo al confirmar.");
      alert("Hubo un error al procesar tu reserva. Intenta de nuevo.");
      return;
    }

    if (clientName.trim() === "" || clientPhone.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(clientPhone.trim());

    if (!phoneNumber || !phoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono válido con código de país (ej. +56912345678 o +34699111222)."
      );
      return;
    }

    const detectedCountry = phoneNumber.country || "Desconocido";
    console.log("País detectado por número telefónico:", detectedCountry);
    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const horaGenerica = "17:00"; // Hora genérica, ajusta según necesidad

    const reservaDataToSend = {
      // No incluyas `id` ni `clientBookingId` aquí; el backend los manejará.
      // El backend `crearReservaDirecta` generará el `clientBookingId` (UUID).
      servicio: "Formación de Terapeutas de la Luz", // El nombre del servicio
      especialidad: currentTerapia.alt, // Usar 'alt' como especialidad
      fecha: fechaActual,
      hora: horaGenerica,
      precio: currentTerapia.precio,
      terapeuta: currentTerapia.terapeuta,
      terapeutaId: currentTerapia.terapeutaId,
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      sesiones: 1,
      cantidad: 1,
    };

    console.log("Reserva de Formación agregada al carrito:", reservaDataToSend);
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

      const { reserva: confirmedReservation } = await response.json(); // El backend devuelve { reserva: {...} }

      console.log(
        "Reserva de Formación confirmada por backend:",
        confirmedReservation
      );

      // Añadir la reserva (con el ID de la DB y clientBookingId del backend) al carrito
      addToCart(confirmedReservation); // confirmedReservation ya tiene id y clientBookingId válidos

      alert(
        `"${confirmedReservation.especialidad}" ha sido agregada al carrito.`
      );

      // Cierra el modal y resetea estados
      setShowContactModal(false);
      setCurrentTerapia(null);
      setClientName("");
      setClientPhone("");
    } catch (error: any) {
      console.error("ERROR al crear la reserva de Formación:", error);
      alert(`No se pudo completar la inscripción: ${error.message}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Formación Terapeutas de la Luz
        </h1>
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
          Volver a Servicios
        </button>

        <h2 className="text-2xl font-bold text-center text-purple-700 mb-8">
          Menciones Disponibles
        </h2>

        <div className="flip-wrapper-container">
          {imagenesData.map((img) => (
            <div key={img.id} className="flip-wrapper">
              <div className="flip-card">
                {/* Frente de la tarjeta */}
                <div className="flip-front">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="nombre-overlay">
                    <p>{img.terapeuta}</p>
                  </div>
                </div>

                {/* Reverso de la tarjeta */}
                <div className="flip-back flex flex-col">
                  <div className="text-center font-semibold text-gray-700 p-2 border-b">
                    {img.alt}
                  </div>
                  <div
                    className="overflow-y-auto p-3 flex-grow"
                    style={{ maxHeight: "calc(100% - 100px)" }}
                  >
                    <p className="text-xs text-gray-700 italic mb-2">
                      {img.descripcion}
                    </p>
                  </div>
                  <div className="p-3 border-t mt-auto">
                    <p className="text-sm text-gray-700 font-semibold mb-2">
                      Precio: ${img.precio.toLocaleString()} CLP
                    </p>
                    <p className="text-xs text-gray-600 mb-3">{img.duracion}</p>
                    {/* --- LÓGICA CONDICIONAL PARA EL BOTÓN --- */}
                    {img.isDisabled ? (
                      <button
                        disabled // Agrega el atributo disabled al botón
                        className="w-full px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                        title="Inscripciones cerradas"
                      >
                        Inscripciones Cerradas
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenContactModal(img)}
                        className="w-full px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors duration-300"
                      >
                        Inscribirse en Formación
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>{" "}
      <br></br> <br></br> <br></br>
      <PermanentPopup />
      {/* --- MODAL DE CONTACTO --- */}
      {showContactModal && currentTerapia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Inscribirse en "{currentTerapia.alt}"
            </h3>
            <p className="text-gray-700 mb-4 text-center">
              Por favor, ingresa tus datos para la inscripción.
            </p>
            <div className="mb-4">
              <label
                htmlFor="clientName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombre Completo:
              </label>
              <input
                type="text"
                id="clientName"
                placeholder="Tu Nombre Completo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="clientPhone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Número de Teléfono:
              </label>
              <input
                type="tel"
                id="clientPhone"
                placeholder="Ej: +56912345678"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
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
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
              >
                Confirmar e Inscribirse
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
