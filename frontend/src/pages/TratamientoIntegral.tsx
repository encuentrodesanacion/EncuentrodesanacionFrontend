import React, { useState } from "react"; // Importa useState
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Asegúrate de que esta ruta sea correcta
import { useCart, Reserva } from "../pages/CartContext"; // Asegúrate de la ruta correcta para CartContext y Reserva

import CartIcon from "../components/CartIcon"; // Asegúrate de la ruta correcta

// Asegúrate de que las rutas de las imágenes sean correctas
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import Terapeuta2 from "../assets/Terapeuta2.jpg";
import Terapeuta3 from "../assets/Terapeuta3.jpg";
import Terapeuta4 from "../assets/Terapeuta4.jpg";
import Terapeuta5 from "../assets/Terapeuta5.jpg";
import Terapeuta6 from "../assets/Terapeuta6.jpg";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import Terapeuta10 from "../assets/Terapeuta10.jpeg";

interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  description: string;
  opciones: { sesiones: number; precio: number }[];
}

export default function TratamientoHolistico() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // --- NUEVOS ESTADOS para controlar el modal de contacto ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [currentTerapiaData, setCurrentTerapiaData] = useState<{
    terapiaTitle: string;
    sesiones: number;
    precio: number;
    terapeutaNombre: string;
  } | null>(null); // Para guardar los datos de la terapia seleccionada temporalmente

  const terapias: TerapiaItem[] = [
    {
      img: Terapeuta1,
      title: "Canalización Energética",
      terapeuta: "Brenda Rivas",
      description:
        "Es una terapia en la cual una persona actúa como un conducto para recibir mensajes de guías espirituales, angeles, maestros ascendidos y seres fallecidos. Es una herramienta poderosa para la conexión con lo divino u el crecimiento personal. Es una forma de recibir orientación espiritual, sanar emocionalmente y obtener claridad sobre diversos aspectos de la vida",
      opciones: [{ sesiones: 3, precio: 55000 }],
    },
    {
      img: Terapeuta2,
      title: "La limpieza de lealtades transgeneracionales",
      terapeuta: "Betsy Bolivar",
      description:
        "Un proceso terapéutico que busca identificar y liberar patrones de comportamiento, emociones y creencias que se transmiten de generación en generación dentro de una familia. Estas lealtades invisibles pueden influir en la salud, el bienestar emocional, las relaciones de las personas, la estabilidad económica.El objetivo principal es identificar y romper estos patrones para que las personas puedan vivir de manera más autónoma y alineada con sus propias necesidades y deseos.",
      opciones: [
        { sesiones: 3, precio: 55000 },
        { sesiones: 4, precio: 70000 },
        { sesiones: 5, precio: 85000 },
      ],
    },
    {
      img: Terapeuta3,
      title: "Tameana - Salush Nahí",
      terapeuta: "Mónica García",
      description:
        "Es una terapia vibracional que trabaja con cristales de cuarzo y geometría sagrada para armonizar chakras, liberar bloqueos y elevar la frecuencia energética. Se recomiendan ciclos de 3 sesiones para una transformación profunda.",
      opciones: [{ sesiones: 3, precio: 55000 }],
    },
    {
      img: Terapeuta4,
      title: "Péndulo Hebreo",
      terapeuta: "Nicole Rojas",
      description:
        "Libérate del estrés, mejora tu descanso y recupera tu energía con el Péndulo Hebreo. Esta técnica detecta y corrige desequilibrios energéticos, ayudándote a sentirte más liviano, claro y vital.",
      opciones: [
        { sesiones: 3, precio: 55000 },
        { sesiones: 4, precio: 70000 },
      ],
    },
    {
      img: Terapeuta5,
      title: "Terapia de Respuesta Espiritual (Con Conexión Angelical)",
      terapeuta: "Sandra Da Silva",
      description:
        "Esta maravillosa Técnica de Sanación te permitirá una conexión intima con tu Ser, nos ayudará a realizar una investigación para conocer todo aquello que quedo grabado en tu Alma y en tu mente subconsciente, que impide que evoluciones en esta vida y que puedas soltar que le pesa. Puedes solicitar este Tratamiento si quieres: Limpiar sentimientos, actitudes y emociones toxicas. (Ansiedad, Depresión, etc.) Limpiar patrones emocionales familiares, de pareja, laborales. Remover bloqueos de cualquier índole, incluyendo energías de bajo astral  (hechicería, magia negra, envidia, etc.). Re-conectarás con tu esencia para que puedas iniciar cambios positivos en tu vida.",
      opciones: [
        { sesiones: 3, precio: 55000 },
        { sesiones: 4, precio: 70000 },
      ],
    },
    {
      img: creadorvirtual,
      title: "Regresión",
      terapeuta: "Alice Basay",
      description:
        "Esta maravillosa Técnica de Sanación te permitirá una conexión intima con tu Ser, nos ayudará a realizar una investigación para conocer todo aquello que quedo grabado en tu Alma y en tu mente subconsciente, que impide que evoluciones en esta vida y que puedas soltar que le pesa. Puedes solicitar este Tratamiento si quieres: Limpiar sentimientos, actitudes y emociones toxicas. (Ansiedad, Depresión, etc.) Limpiar patrones emocionales familiares, de pareja, laborales. Remover bloqueos de cualquier índole, incluyendo energías de bajo astral  (hechicería, magia negra, envidia, etc.). Re-conectarás con tu esencia para que puedas iniciar cambios positivos en tu vida.",
      opciones: [
        { sesiones: 3, precio: 55000 },
        { sesiones: 4, precio: 70000 },
      ],
    },
    {
      img: Terapeuta10,
      title: "Sanación del Alma",
      terapeuta: "Vanessa Henríquez",
      description:
        "¿Y si el dolor que cargas... ni siquiera fuera tuyo? Esta terapia es un método amoroso y profundo que te conecta con tu campo energético para identificar y sanar heridas de la infancia, lealtades familiares inconscientes, traumas de otras vidas, patrones repetitivos, interferencias energéticas y mucho más. Sanar el alma no es solo alcanzar la paz. Es volver a ti, recuperar las partes de tu esencia que quedaron atrás. Es permitirte ser complet@, libre y luminos@ otra vez.",
      opciones: [
        { sesiones: 3, precio: 55000 },
        { sesiones: 4, precio: 70000 },
        { sesiones: 5, precio: 85000 },
      ],
    },
    {
      img: Terapeuta6,
      title: "Reiki Egipcio",
      terapeuta: "Macarena del Rio",
      description:
        "Sanación ancestral que canaliza energía vital y luz de alta vibración para armonizar cuerpo, mente y alma. A través de símbolos sagrados y la guía de diosas como Sekhmet, libera bloqueos energéticos, alivia ansiedad, fatiga y estrés, y te reconecta con tu poder interior. Equilibra tu energía. Despierta tu esencia.",
      opciones: [
        { sesiones: 3, precio: 55000 },
        { sesiones: 4, precio: 70000 },
      ],
    },
  ];

  // --- Función original reservarSesion modificada para ABRIR EL MODAL ---
  const reservarSesion = (
    terapiaTitle: string,
    sesiones: number,
    precio: number,
    terapeutaNombre: string
  ) => {
    // Validaciones defensivas antes de abrir el modal
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

    // Guarda los datos de la terapia seleccionada en el estado para usarlos en el modal
    setCurrentTerapiaData({ terapiaTitle, sesiones, precio, terapeutaNombre });
    setShowContactModal(true); // Abre el modal de contacto
    setClientName(""); // Limpia los campos del formulario al abrir el modal
    setClientPhone("");
    console.log("--- DEBUG: Modal de contacto abierto para reservarSesion ---");
  };

  // --- Nueva función para confirmar y añadir al carrito desde el modal ---
  const handleConfirmAndAddToCart = () => {
    if (!currentTerapiaData) {
      console.error("Error: currentTerapiaData es nulo al confirmar.");
      alert("Hubo un error al procesar tu reserva. Intenta de nuevo.");
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
    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const horaGenerica = "17:00"; // Hora genérica

    const reserva: Reserva = {
      id: Date.now(), // ID único para el frontend
      servicio: "Tratamiento Integral", // Nombre genérico del servicio/formación
      especialidad: currentTerapiaData.terapiaTitle, // Usar el título de la terapia como especialidad
      fecha: fechaActual,
      hora: horaGenerica,
      precio: currentTerapiaData.precio,
      sesiones: currentTerapiaData.sesiones,
      cantidad: 1, // Por defecto 1 para tratamiento
      nombreCliente: clientName.trim(), // Nombre ingresado por el usuario
      telefonoCliente: clientPhone.trim(), // Teléfono ingresado por el usuario
      terapeuta: currentTerapiaData.terapeutaNombre,
    };

    console.log(
      "Objeto Reserva a añadir al carrito desde TratamientoHolistico (después de modal):",
      reserva
    );

    try {
      addToCart(reserva);
      console.log("addToCart fue llamado exitosamente.");
      alert(
        `Reserva agregada: ${currentTerapiaData.sesiones} sesiones de ${currentTerapiaData.terapiaTitle} con ${currentTerapiaData.terapeutaNombre}`
      );
    } catch (error) {
      console.error("Error al llamar a addToCart:", error);
      alert("Hubo un problema al agregar la reserva al carrito.");
    }

    // Cierra el modal y resetea estados
    setShowContactModal(false);
    setCurrentTerapiaData(null);
    setClientName("");
    setClientPhone("");
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Tratamiento Integral
        </h1>
        <CartIcon />
      </header>

      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Bienvenido al Tratamiento Integral
      </h2>
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
        Este tratamiento incluye sesiones personalizadas orientadas a tu
        bienestar físico, emocional y espiritual.
      </p>

      <div className="flip-wrapper-container mt-10">
        {terapias.map(
          (
            t: TerapiaItem,
            i: number // Añadidos tipos explícitos para 't' y 'i'
          ) => (
            <div key={i} className="flip-wrapper">
              <div className="flip-card">
                <div className="flip-inner">
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
                          j: number // Añadidos tipos explícitos para 'op' y 'j'
                        ) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() =>
                              reservarSesion(
                                // Llama a la función que abre el modal
                                t.title,
                                op.sesiones,
                                op.precio,
                                t.terapeuta
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
            </div>
          )
        )}
      </div>

      {/* --- MODAL DE CONTACTO --- */}
      {showContactModal && currentTerapiaData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Reservar: "{currentTerapiaData.terapiaTitle}"
            </h3>
            <p className="text-gray-700 mb-4 text-center">
              Ingresa tus datos para continuar con la reserva de{" "}
              <strong>
                {currentTerapiaData.sesiones} sesiones por $
                {currentTerapiaData.precio.toLocaleString()} CLP
              </strong>
              .
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
