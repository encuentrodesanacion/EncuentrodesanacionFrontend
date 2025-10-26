import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Revisa si necesitas este CSS, o si tienes uno específico para talleres
import { useCart, Reserva } from "../pages/CartContext"; // Asegúrate de la ruta correcta
import CartIcon from "../components/CartIcon"; // Asegúrate de la ruta correcta

import YogaArt from "../assets/Yoga integral.jpeg";
import perfilnum from "../assets/perfilnum.jpeg";
import Dalun from "../assets/DALUN.jpeg";
import bordado from "../assets/bordado.jpeg";
import movimiento from "../assets/Movimiento.jpeg";
import flexi from "../assets/flexi.jpeg";
import presion from "../assets/presion.jpeg";
import hiit from "../assets/hiit.jpeg";
import parsePhoneNumberFromString from "libphonenumber-js";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

// Define la interfaz para un ítem de taller

interface TallerItem {
  id: string; // O number, un ID único para el taller
  title: string;
  description: string;
  price: number;
  date: string; // Fecha del taller (ej. "2025-07-20")
  time: string; // Hora del taller (ej. "10:00")
  instructor: string; // Terapeuta/Instructor
  instructorId: number; //Necesario!
  isDisabled?: boolean;
}

export default function TalleresMensuales() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // --- NUEVOS ESTADOS para controlar el modal de contacto ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [currentTaller, setCurrentTaller] = useState<TallerItem | null>(null); // Para guardar el taller seleccionado temporalmente

  const talleres: TallerItem[] = [
    {
      id: "Taller-Yoga",
      title: "Yoga Integral",
      description:
        "Conecta contigo desde casa: clases de yoga online. Encuentra tu momento de calma sin moverte de tu hogar. Fortalece tu cuerpo, calma tu mente y equilibra tu energía. Yoga para todos los niveles, guiado paso a paso, estés donde estés Transforma tu rutina en un espacio de bienestar.",
      price: 35000,
      date: "2025-11-04",
      time: "19:00",

      instructor: "Susanne Saavedra",
      instructorId: 24,
      isDisabled: false,
    },
    {
      id: "Movimiento-del-Alma",
      title: "Movimiento del Alma",
      description:
        "Un ciclo de 4 encuentros grupales al mes que invita a reconectar con tu cuerpo, tu energía y tu esencia a través del movimiento, el goce y la presencia. Un espacio recreativo y sanador donde podrás soltar, respirar, expresarte y volver a sentir la vida fluir desde adentro hacia afuera.",
      price: 35000,
      date: "2025-12-02",
      time: "20:00",
      instructor: "Sarita Infante",
      instructorId: 26,
      isDisabled: false,
    },
    {
      id: "Puntos-Presion",
      title: "Puntos de presión para armonizarte",
      description:
        "Reconecta con tu energía vital. Con pequeños toques en puntos específicos de tu cuerpo, libera tensiones, equilibra tus emociones, recupera tu paz interior. Dale a tu cuerpo el masaje de calma que necesita cada día.",
      price: 35000,
      date: "2025-12-05",
      time: "20:00",
      instructor: "Marcela Cabezas",
      instructorId: 32,
      isDisabled: false,
    },
    {
      id: "Falun-Dafa",
      title: "Falun Dafa",
      description:
        "Sistema de meditación en movimiento que permite reciclar la energía desgastada y nutrirse con energía renovada reconociendo el cuerpo como canal de movilización en sincronía con con el dinamismo continuo y perpetuo del universo.",
      price: 35000,
      date: "2025-12-06",
      time: "11:00",
      instructor: "Maribel Muñoz",
      instructorId: 32,
      isDisabled: false,
    },

    {
      id: "Perfil-Numerologico-de-tu-alma",
      title: "Perfil Numerológico de tu alma",
      description:
        "Descubrir los números sagrados que revelan la esencia de tú alma,tú propósito de vida y los dones que viniste a manifestar.",
      price: 35000,
      date: "2025-12-03",
      time: "18:00",
      instructor: "Crisolde Valenzuela",
      instructorId: 30,
      isDisabled: false,
    },

    {
      id: "Bordado-Terapeutico",
      title: "Taller de Bordado Arteterapeutico “Emocionario Textil",
      description:
        "El objetivo de este taller es incentivar la creatividad, proporcionar un espacio de calma y bienestar integral. Se enseñarán puntos básicos y fáciles del bordado, con la finalidad de crear una obra textil la cual va a describir a través del bordado y la acuarela un registro de nuestras emociones. El formato de la obra textil será un tipo cuaderno o pequeño libro el cual se irá construyendo sesión a sesión.",
      price: 35000,
      date: "2025-12-01",
      time: "20:00",
      instructor: "Catalina Sánchez",
      instructorId: 33,
      isDisabled: false,
    },
    {
      id: "Flexibilidad-Consciente",
      title: "Flexibilidad Consciente",
      description:
        "Este taller busca generar un espacio de conexión entre mente y cuerpo a través del desarrollo de la flexibilidad física, extrapolándola a su vez a una forma de abrirnos a la vida con mayor fluidez y equilibrio. Partiremos tomando consciencia de nuestro cuerpo, para luego desarrollar técnicas de movilidad articular y muscular, estiramiento, y respiración consciente, con el objetivo de ampliar el rango articular, mejorar la postura, liberar tensiones acumuladas y gestionar el estrés, para finalmente encontrar calma, armonía interior y reencontrarnos con nuestra energía vital.",
      price: 35000,
      date: "2025-12-04",
      time: "18:00",
      instructor: "Catalina Paredes",
      instructorId: 35,
      isDisabled: false,
    },
    {
      id: "Entrenamiento-Hiit",
      title: "HIIT  (Entrenamiento Interválico de Intensidad)",
      description:
        "Consiste en alternar ráfagas cortas de ejercicio intenso con períodos de descanso o menor intensidad. Es una forma eficiente de entrenar, ya que permite obtener grandes beneficios cardiovasculares y de quema de grasa en sesiones de unos 20-30 minutos, con la posibilidad de adaptar la intensidad al nivel físico de cada persona, adaptable a cualquier nivel. Ponle ritmo, ponle HIIT. Ponte en forma, pierde grasa y mejora tu salud.",
      price: 35000,
      date: "2025-12-03",
      time: "19:30",
      instructor: "Gabriela Pinto",
      instructorId: 34,
      isDisabled: false,
    },

    // {
    //   id: "taller-meditacion-jul",
    //   title: "Taller de Regresión",
    //   description:
    //     "Aprende técnicas de meditación para reducir el estrés y aumentar la claridad mental.",
    //   price: 25000,
    //   date: "2025-07-05",
    //   time: "10:30",
    //   instructor: "Alice Basay",
    //   instructorId: 10,
    // },
    // Añade más talleres aquí
  ];

  // --- Función original handleAddToCart modificada para ABRIR EL MODAL ---
  const handleOpenContactModal = (taller: TallerItem) => {
    setCurrentTaller(taller); // Guarda el taller seleccionado
    setShowContactModal(true); // Abre el modal
    setClientName(""); // Limpia los campos del formulario al abrir el modal
    setClientPhone("");
    console.log(
      "--- DEBUG: Modal de contacto abierto para TalleresMensuales ---"
    );
  };

  // --- Nueva función para confirmar y añadir al carrito desde el modal ---
  const handleConfirmAndAddToCart = async () => {
    if (!currentTaller) {
      console.error("Error: currentTaller es nulo al confirmar.");
      alert("Hubo un error al procesar tu inscripción. Intenta de nuevo.");
      return;
    }

    if (clientName.trim() === "" || clientPhone.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    } // --- NUEVA VALIDACIÓN PARA EL NÚMERO DE TELÉFONO ---
    const phoneNumber = parsePhoneNumberFromString(clientPhone.trim());
    if (!phoneNumber || !phoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono válido con código de país (ej. +56912345678 o +34699111222)."
      );
      return;
    } // --- FIN NUEVA VALIDACIÓN ---
    const detectedCountry = phoneNumber.country || "Desconocido";
    console.log("País detectado por número telefónico:", detectedCountry); // Aquí usamos los datos del taller (currentTaller) y los datos del cliente

    // Construir el objeto de datos para enviar al backend
    const reservaDataToSend = {
      // El backend `crearReservaDirecta` generará el `id` y `clientBookingId` (UUID).
      servicio: "Talleres Mensuales", // Nombre general del servicio
      especialidad: currentTaller.title, // Usa el título del taller como especialidad
      fecha: currentTaller.date,
      hora: currentTaller.time,
      precio: currentTaller.price,
      sesiones: 4, // Asumimos 1 sesión por taller mensual, ajusta si es diferente
      cantidadCupos: 1, // Cantidad de cupos (generalmente 1 por reserva de persona)
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      terapeuta: currentTaller.instructor,
      terapeutaId: currentTaller.instructorId,
    };

    console.log(
      "Intentando crear reserva de Taller Mensual en backend:",
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
          `Error al inscribirse en el taller: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json(); // El backend devuelve { reserva: {...} }

      console.log(
        "Reserva de Taller Mensual confirmada por backend:",
        confirmedReservation
      );

      // Añadir la reserva (con el ID de la DB y clientBookingId del backend) al carrito
      addToCart(confirmedReservation); // confirmedReservation ya tiene id y clientBookingId válidos

      alert(
        `"${confirmedReservation.especialidad}" ha sido agregado al carrito.`
      );

      // Cierra el modal y resetea estados
      setShowContactModal(false);
      setCurrentTaller(null);
      setClientName("");
      setClientPhone("");
    } catch (error: any) {
      console.error("ERROR al crear la reserva de Taller Mensual:", error);
      alert(`No se pudo completar la inscripción al taller: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Talleres Mensuales
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

      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>

      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Nuestros Talleres del Mes
      </h2>
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
        Únete a nuestros talleres interactivos para profundizar en tu bienestar
        y desarrollo personal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {talleres.map(
          (
            taller: TallerItem // Añadido tipo explícito para 'taller'
          ) => (
            <div
              key={taller.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              {taller.id === "Taller-Yoga" && (
                <img
                  src={YogaArt} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Puntos-Presion" && (
                <img
                  src={presion} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Flexibilidad-Consciente" && (
                <img
                  src={flexi} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Entrenamiento-Hiit" && (
                <img
                  src={hiit} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Bordado-Terapeutico" && (
                <img
                  src={bordado} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Movimiento-del-Alma" && (
                <img
                  src={movimiento} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Perfil-Numerologico-de-tu-alma" && (
                <img
                  src={perfilnum} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}
              {taller.id === "Falun-Dafa" && (
                <img
                  src={Dalun} // Revisa si esto es Taller1 o Taller2 para caa caso
                  alt={taller.title}
                  className="w-full h-80 object-cover"
                />
              )}

              {!(
                (
                  taller.id === "Falun-Dafa" ||
                  taller.id === "Taller-Yoga" ||
                  taller.id === "Bordado-Terapeutico" ||
                  taller.id === "Movimiento-del-Alma" ||
                  taller.id === "Entrenamiento-Hiit" ||
                  taller.id === "Flexibilidad-Consciente" ||
                  taller.id === "Puntos-Presion" ||
                  taller.id === "Perfil-Numerologico-de-tu-alma"
                )
                // taller.id === "Taller-de-Escribir-sobre-Raices"
              ) && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  Imagen de Taller
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {taller.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Instructor: <strong>{taller.instructor}</strong>
                </p>
                <p className="text-gray-700 text-base mb-4">
                  {taller.description}
                </p>
                <p className="text-md text-gray-500 mb-2">
                  Fecha: <strong>{taller.date}</strong>
                </p>
                <p className="text-md text-gray-500 mb-4">
                  Hora: <strong>{taller.time}</strong>
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-700">
                    ${taller.price.toLocaleString()} CLP
                  </span>
                </div>
                {taller.isDisabled ? (
                  <button
                    disabled // Atributo disabled
                    className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed" // Estilos para deshabilitado
                    title="Inscripciones cerradas para este taller" // Tooltip
                  >
                    Inscripciones Cerradas
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenContactModal(taller)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
                  >
                    Inscribirse al Taller
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* --- MODAL DE CONTACTO --- */}
      {showContactModal && currentTaller && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Inscribirse en: "{currentTaller.title}"
            </h3>
            <p className="text-gray-700 mb-4 text-center">
              Completa tus datos para reservar tu cupo en este taller.
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
                Confirmar e Inscribirme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
