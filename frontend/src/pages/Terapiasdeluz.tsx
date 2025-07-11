import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/terapiaDeLuz.css";
// Ya no usaremos ReservaForm directamente para la selección de fecha/hora en este flujo.
// import ReservaForm from "../components/ReservaForm";
import CartIcon from "../components/CartIcon";
import { useCart, Reserva } from "./CartContext";

import terapeuta3 from "../assets/Terapeuta3.jpg";
import Terapeuta7 from "../assets/Terapeuta7.jpg";
import terapeuta9 from "../assets/Terapeuta9.jpg";
import terapeuta6 from "../assets/Terapeuta6.jpg";
import creadorvirtual from "../assets/creadorvirtual.jpg";

interface ImagenData {
  id: string;
  src: string;
  alt: string; // Usado como el título de la "formación" y para la prop 'servicio'
  descripcion: string;
  link: string;
  terapeuta: string; // El nombre del terapeuta que conduce la "formación"
  terapeutaId: number;
  precio: number;
}

const imagenesData: ImagenData[] = [
  {
    id: "canalizacion-monica",
    src: terapeuta3,
    alt: "Canalización",
    descripcion:
      "La Canalización es la capacidad de recibir información energética a través de la intuición y los sentidos sutiles. Se caracteriza por la conexión con guías espirituales, la percepción extrasensorial y la apertura a energías elevadas. En este curso exploraremos la glándula pineal, el aura, los elementales y la comunicación animal, integrando técnicas prácticas para fortalecer la recepción de mensajes energéticos. Los beneficios son desarrollar herramientas esenciales para lograr claridad intuitiva, expansión sensorial y fortalecimiento de la conexión energética",
    link: "#",
    terapeuta: "Mónica Gatica",
    terapeutaId: 5,
    precio: 40000,
  },
  {
    id: "limpieza-ankh-fabiola",
    src: Terapeuta7,
    alt: "Limpieza con Cruz de Anhk",
    descripcion:
      "El ankh, cruz ankh o llave de la vida, es un símbolo muy antiguo, muy asociada al antiguo Egipto, donde grandes Dioses y faraones. Sus bendiciones son múltiples, por ello, en esta formación viajáremos hacia el pasado, para conocer la historia y significado del Ankh y como poder poner sus virtudes al servicio de todos los involucrados. También aprenderás los tipos de contamines que podremos diagnosticar con ayuda del péndulo, en personas, espacio u objeto, y obviamente como limpiarnos con nuestra amada Cruz Ankh",
    link: "#",
    terapeuta: "Fabiola Valenzuela",
    terapeutaId: 3,
    precio: 40000,
  },

  // {
  //   id: "Alice-Basay",
  //   src: creadorvirtual,
  //   alt: "Regresión",
  //   descripcion: "Prueba Correo",
  //   link: "#",
  //   terapeuta: "Alice Basay",
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
  const handleConfirmAndAddToCart = () => {
    if (!currentTerapia) return; // No debería pasar, pero como seguridad

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
    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const horaGenerica = "17:00"; // Hora genérica, ajusta según necesidad

    const nuevaReserva: Reserva = {
      id: Date.now(), // ID único para el frontend
      servicio: "Formación de Terapeutas de la Luz", // Nombre genérico del servicio/formación
      especialidad: currentTerapia.alt, // Usar 'alt' como especialidad
      fecha: fechaActual,
      hora: horaGenerica,
      precio: currentTerapia.precio,
      terapeuta: currentTerapia.terapeuta,
      terapeutaId: currentTerapia.terapeutaId,
      nombreCliente: clientName.trim(), // Nombre ingresado por el usuario
      telefonoCliente: clientPhone.trim(), // Teléfono ingresado por el usuario
      sesiones: 1, // Por defecto 1 sesión para formación
      cantidad: 1, // Por defecto 1 para formación
    };

    console.log("Reserva de Formación agregada al carrito:", nuevaReserva);
    addToCart(nuevaReserva);
    alert(`"${currentTerapia.alt}" ha sido agregado al carrito.`);

    // Cierra el modal y resetea estados
    setShowContactModal(false);
    setCurrentTerapia(null);
    setClientName("");
    setClientPhone("");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Formación Terapeutas de la Luz
        </h1>
        <CartIcon />
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
          Formaciones Disponibles
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
                    <p className="text-xs text-gray-600 mb-3">
                      Duración: 1 mes (60 minutos por semana, cada semana)
                    </p>
                    <button
                      onClick={() => handleOpenContactModal(img)}
                      className="w-full px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors duration-300"
                    >
                      Inscribirse en Formación
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
