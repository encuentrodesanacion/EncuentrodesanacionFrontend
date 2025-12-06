import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Revisa si necesitas este CSS, o si tienes uno específico para talleres
import { useCart, Reserva } from "../pages/CartContext"; // Asegúrate de la ruta correcta
import CartIcon from "../components/CartIcon"; // Asegúrate de la ruta correcta

import utero from "../assets/utero.jpg";
import perfilnum from "../assets/perfilnum.jpeg";
import Dalun from "../assets/DALUN.jpeg";
import solar from "../assets/solar.jpg";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clientPhone, setClientPhone] = useState("");
  const [currentTaller, setCurrentTaller] = useState<TallerItem | null>(null); // Para guardar el taller seleccionado temporalmente

  const talleres: TallerItem[] = [
    //
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
    {
      id: "Activación-de-Útero",
      title: "Activación de Útero",
      description:
        "Es un taller destinado a mujeres que creen posible tener una vida plena, aquellas que anhelan estar bien, avanzar y sanar aquellas situaciones dolorosas vividas. El Útero es nuestro centro energético, al activarlo, sanamos memorias de dolor propias y generacionales, nos liberamos de cargas ancestrales y comenzamos a fluir más libres, a avanzar con esperanza y alegría nuestra vida.",
      price: 35000,
      date: "2026-01-06",
      time: "20:00",
      instructor: "Pamela Benavides",
      instructorId: 31,
      isDisabled: false,
    },
    {
      id: "El-poder-transformador",
      title: "El Poder Transformador de la Gratitud",
      description:
        "Es un espacio dedicado a reconocer cómo este simple acto puede mejorar profundamente nuestro bienestar emocional, mental y relacional. Cultivar la gratitud nos permite cambiar el foco: dejamos de mirar aquello que falta y comenzamos a valorar lo que ya está presente, desarrollando mayor calma, resiliencia y claridad interior. Practicar la gratitud fortalece la autoestima, disminuye el estrés, mejora la calidad del sueño y nos ayuda a construir vínculos más sanos y significativos. También incrementa la sensación de propósito, apertura y esperanza, convirtiéndose en un recurso clave para atravesar desafíos y para vivir con mayor plenitud. Este taller invita a descubrir cómo la gratitud, cuando se practica de manera consciente y sostenida, se transforma en una herramienta poderosa de cambio interno, capaz de ampliar nuestra perspectiva y reconectar con lo que verdaderamente nutre nuestra vida.",
      price: 35000,
      date: "2026-01-08",
      time: "19:00",
      instructor: "Marisol Solar",
      instructorId: 45,
      isDisabled: false,
    },

    // {
    //   id: "Regresión",
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
    <div className="min-h-screen bg-white">
            {/* --- INICIO DEL HEADER Y NAVEGACIÓN --- */}     {" "}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-10 flex justify-between items-center px-6 py-4">
                {/* Título de la Página (Ajustado) */}       {" "}
        <h1 className="text-xl font-semibold text-gray-800 z-50">
                    Talleres Mensuales     {" "}
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
                    {/* Icono del Carrito (se mantiene) */}             {" "}
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
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Nuestros Talleres del Mes
        </h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
          Únete a nuestros talleres interactivos para profundizar en tu
          bienestar y desarrollo personal.
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
                {taller.id === "El-poder-transformador" && (
                  <img
                    src={solar} // Revisa si esto es Taller1 o Taller2 para cada caso
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

                {taller.id === "Movimiento-del-Alma" && (
                  <img
                    src={movimiento} // Revisa si esto es Taller1 o Taller2 para cada caso
                    alt={taller.title}
                    className="w-full h-80 object-cover"
                  />
                )}

                {taller.id === "Activación-de-Útero" && (
                  <img
                    src={utero} // Revisa si esto es Taller1 o Taller2 para cada caso
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
                    taller.id === "Activación-de-Útero" ||
                    taller.id === "Movimiento-del-Alma" ||
                    taller.id === "Entrenamiento-Hiit" ||
                    taller.id === "El-poder-transformador" ||
                    taller.id === "Flexibilidad-Consciente" ||
                    taller.id === "Puntos-Presion"
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
    </div>
  );
}
