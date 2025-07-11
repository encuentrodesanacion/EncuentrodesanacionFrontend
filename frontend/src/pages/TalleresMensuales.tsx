import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Revisa si necesitas este CSS, o si tienes uno específico para talleres
import { useCart, Reserva } from "../pages/CartContext"; // Asegúrate de la ruta correcta

import CartIcon from "../components/CartIcon"; // Asegúrate de la ruta correcta
import Mindfullness from "../assets/Mindfullness.jpeg"; // Asegúrate de las rutas correctas
import TribuEnCalma from "../assets/TribuEnCalma.jpeg";
import Yoga from "../assets/Yoga.jpg";
import Alquimia from "../assets/Alquimia.jpeg";
import EscribirDesdeRaices from "../assets/EscribirDesdeRaices.jpeg";
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
    // {
    //   id: "Taller-de-Mindfullness",
    //   title: "Mindfullness para la Vida Diaria",
    //   description:
    //     "Mindfulness para la vida diaria En este taller, exploraremos la práctica del mindfulness como una herramienta para cultivar una mayor conciencia, equilibrio emocional y bienestar mental. A través de técnicas de atención plena, los participantes aprenderán a gestionar el estrés, mejorar la concentración y fortalecer su conexión con el momento presente. Este enfoque transformador permitirá armonizar la energía, potenciar el bienestar y vivir con mayor presencia y plenitud. Beneficios: •	Reducción del estrés y ansiedad •	Mejora de la concentración y claridad •	Regulación emocional •	Mayor conexión con el cuerpo y la respiración •	Fortalecimiento de la intuición y presencia",
    //   price: 25000,
    //   date: "2025-03-07",
    //   time: "20:00",
    //   instructor: "Mónica Gatica",
    //   instructorId: 5,
    // },
    // {
    //   id: "Taller-de-Tribu-en-Calma",
    //   title: "Tribu en Calma",
    //   description:
    //     "Un espacio seguro para quienes desean aprender a manejar la ansiedad de forma práctica y acompañada. A través de técnicas sencillas, ejercicios interactivos y un ambiente de apoyo, te ayudamos a tomar las riendas de tu bienestar. Beneficios: •Comprender mejor tu ansiedad •Reducir el estrés diario •Mejorar tu bienestar emocional •Fortalecer tu autocuidado ¡No esperes más para transformar tu vida! Únete hoy a la tribu para comenzar este camino paso a paso.",
    //   price: 25000,
    //   date: "2025-02-07",
    //   time: "19:00",
    //   instructor: "Vanessa Hernández",
    //   instructorId: 1,
    // },
    {
      id: "Taller-de-Yoga",
      title: "Yoga Integral para Adultos",
      description:
        "El Yoga es una práctica que conecta el cuerpo, la respiración y la mente. A través de esta práctica, donde utilizamos distintas posturas físicas, ejercicios de respiración y meditación, nos ayuda a mejorar nuestra salud en general. Esta maravillosa práctica, dentro de sus innumerables beneficios, nos ofrece los siguientes: reducir el estrés, aumentar las hormonas de la felicidad, aliviar la migraña, calmar nuestra mente y reducir los niveles de ansiedad, entre otros.",
      price: 25000,
      date: "2025-05-07",
      time: "11:00",
      instructor: "Marlene Ramirez",
      instructorId: 17,
    },
    {
      id: "Taller-de-Alquimia",
      title: "Alquimia de Abundancia",
      description:
        "Un taller poderoso donde ritual y transformación se unen para ayudarte a reconocer los bloqueos que te han mantenido lejos del merecimiento, el dinero y la plenitud.  A través de herramientas de PNL, prácticas mágicas y rituales conscientes, vas a: • Identificar tus patrones de carencia • Reprogramar creencias limitantes • Activar tu poder creador  •Conectar con tu propósito abundante Es hora de transformar la escasez en magnetismo, y abrirte a todo lo que el universo ya quiere entregarte.  Tu abundancia no es un destino… es un estado de conexión interior.",
      price: 25000,
      date: "2025-04-07",
      time: "21:00",
      instructor: "Macarena del Río",
      instructorId: 6,
    },
    // {
    //   id: "Taller-de-Escribir-sobre-Raices",
    //   title: "Escribir desde las raíces: Tarot y memoria ancestral",
    //   description:
    //     "Un taller para reconectar con el linaje femenino a través de la escritura creativa, el tarot y la memoria del cuerpo. Exploraremos lo que heredamos emocional y corporalmente, para reconocer nuestras heridas, activar los dones, liberar patrones y escribir una nueva narrativa personal. Cada clase integra movimiento consciente, escritura terapéutica y arquetipos del tarot como guías simbólicas. Crearemos textos, rituales y cartas simbólicas inspiradas en nuestras ancestras, cerrando con una obra escrita que celebre nuestra propia voz.",
    //   price: 25000,
    //   date: "2025-06-07",
    //   time: "12:00",
    //   instructor: "Katalina Rencoret",
    //   instructorId: 6,
    // },
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
  const handleConfirmAndAddToCart = () => {
    if (!currentTaller) {
      console.error("Error: currentTaller es nulo al confirmar.");
      alert("Hubo un error al procesar tu inscripción. Intenta de nuevo.");
      return;
    }

    if (clientName.trim() === "" || clientPhone.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    }
    // --- NUEVA VALIDACIÓN PARA EL NÚMERO DE TELÉFONO ---
    const phoneRegex = /^\+569\d{8}$/; // Formato para números de teléfono chilenos (+569XXXXXXXX)
    if (!phoneRegex.test(clientPhone.trim())) {
      alert(
        "Por favor, ingresa un número de teléfono chileno válido (ej. +56912345678)."
      );
      return;
    }
    // --- FIN NUEVA VALIDACIÓN ---
    // Aquí usamos los datos del taller (currentTaller) y los datos del cliente
    const nuevaReserva: Reserva = {
      id: Date.now(), // ID único para el ítem del carrito
      servicio: "Talleres Mensuales", // Nombre general del servicio
      especialidad: currentTaller.title, // Usa el título del taller como especialidad
      fecha: currentTaller.date,
      hora: currentTaller.time,
      precio: currentTaller.price,
      sesiones: 4, // Asumimos que un taller es 1 sesión, ajusta si es diferente
      cantidad: 1,
      nombreCliente: clientName.trim(), // Nombre ingresado por el usuario
      telefonoCliente: clientPhone.trim(), // Teléfono ingresado por el usuario
      terapeuta: currentTaller.instructor,
      terapeutaId: currentTaller.instructorId,
    };

    console.log(
      "Objeto Reserva a añadir al carrito desde TalleresMensuales (después de modal):",
      nuevaReserva
    );

    try {
      addToCart(nuevaReserva);
      console.log("addToCart fue llamado exitosamente.");
      alert(`"${currentTaller.title}" ha sido agregado al carrito.`);
    } catch (error) {
      console.error("Error al llamar a addToCart:", error);
      alert("Hubo un problema al agregar el taller al carrito.");
    }

    // Cierra el modal y resetea estados
    setShowContactModal(false);
    setCurrentTaller(null);
    setClientName("");
    setClientPhone("");
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Talleres Mensuales
        </h1>
        <CartIcon />
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
              {/* {taller.id === "Taller-de-Tribu-en-Calma" && (
                <img
                  src={TribuEnCalma} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )} */}
              {/* {taller.id === "Taller-de-Mindfullness" && (
                <img
                  src={Mindfullness} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )} */}
              {taller.id === "Taller-de-Yoga" && (
                <img
                  src={Yoga} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )}
              {/* {taller.id === "Taller-de-Escribir-sobre-Raices" && (
                <img
                  src={EscribirDesdeRaices} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )} */}
              {taller.id === "Taller-de-Alquimia" && (
                <img
                  src={Alquimia} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )}
              {!(
                // taller.id === "Taller-de-Mindfullness" ||
                // taller.id === "Taller-de-Tribu-en-Calma" ||
                (
                  taller.id === "Taller-de-Yoga" ||
                  taller.id === "Taller-de-Alquimia"
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
                <button
                  onClick={() => handleOpenContactModal(taller)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
                >
                  Inscribirse al Taller
                </button>
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
