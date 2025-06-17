import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Revisa si necesitas este CSS, o si tienes uno específico para talleres
import { useCart, Reserva } from "../pages/CartContext"; // Asegúrate de la ruta correcta

import CartIcon from "../components/CartIcon"; // Asegúrate de la ruta correcta
import Taller1 from "../assets/Taller1.jpeg"; // Asegúrate de las rutas correctas
import Taller2 from "../assets/Taller2.jpeg";

// Define la interfaz para un ítem de taller
interface TallerItem {
  id: string; // O number, un ID único para el taller
  title: string;
  description: string;
  price: number;
  date: string; // Fecha del taller (ej. "2025-07-20")
  time: string; // Hora del taller (ej. "10:00")
  instructor: string; // Terapeuta/Instructor
  instructorId: number;
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
      id: "taller-meditacion-jul",
      title: "Taller de Meditación Profunda",
      description:
        "Aprende técnicas de meditación para reducir el estrés y aumentar la claridad mental.",
      price: 25000,
      date: "2025-07-05",
      time: "10:30",
      instructor: "Paulina Villablanca",
      instructorId: 2,
    },
    {
      id: "taller-chakras-ago",
      title: "Workshop de Armonización de Chakras",
      description:
        "Explora tus centros energéticos y aprende a equilibrarlos para un bienestar integral.",
      price: 40000,
      date: "2025-07-06",
      time: "15:00",
      instructor: "Betsy Bolivar",
      instructorId: 1,
    },
    {
      id: "taller-meditacion-jul",
      title: "Taller de Regresión",
      description:
        "Aprende técnicas de meditación para reducir el estrés y aumentar la claridad mental.",
      price: 25000,
      date: "2025-07-05",
      time: "10:30",
      instructor: "Alice Basay",
      instructorId: 5,
    },
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
              {taller.id === "taller-meditacion-jul" && (
                <img
                  src={Taller2} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )}
              {taller.id === "taller-chakras-ago" && (
                <img
                  src={Taller1} // Revisa si esto es Taller1 o Taller2 para cada caso
                  alt={taller.title}
                  className="w-full h-48 object-cover"
                />
              )}
              {!(
                taller.id === "taller-meditacion-jul" ||
                taller.id === "taller-chakras-ago"
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
