import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; // Asegúrate de que esta ruta sea correcta
import { useCart, Reserva } from "../pages/CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes (se mantienen igual)
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import Terapeuta31 from "../assets/Terapeuta31.jpeg";
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
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [currentTerapiaData, setCurrentTerapiaData] = useState<{
    terapiaTitle: string;
    sesiones: number;
    precio: number;
    terapeutaNombre: string;
    terapeutaId: number;
  } | null>(null);

  const terapias: TerapiaItem[] = [
    {
      img: Terapeuta1,
      title: "Canalización Energética",
      terapeuta: "Brenda Rivas",
      terapeutaId: 7,
      description:
        "Es una terapia en la cual una persona actúa como un conducto para recibir mensajes de guías espirituales, angeles, maestros ascendidos y seres fallecidos. Es una herramienta poderosa para la conexión con lo divino u el crecimiento personal. Es una forma de recibir orientación espiritual, sanar emocionalmente y obtener claridad sobre diversos aspectos de la vida",
      opciones: [{ sesiones: 3, precio: 88000 }],
    },

    {
      img: Terapeuta5,
      title: "Terapia de Respuesta Espiritual (Con Conexión Angelical)",
      terapeuta: "Sandra Da Silva",
      terapeutaId: 9,
      description:
        "Esta maravillosa Técnica de Sanación te permitirá una conexión intima con tu Ser, nos ayudará a realizar una investigación para conocer todo aquello que quedo grabado en tu Alma y en tu mente subconsciente, que impide que evoluciones en esta vida y que puedas soltar que le pesa. Puedes solicitar este Tratamiento si quieres: Limpiar sentimientos, actitudes y emociones toxicas. (Ansiedad, Depresión, etc.) Limpiar patrones emocionales familiares, de pareja, laborales. Remover bloqueos de cualquier índole, incluyendo energías de bajo astral  (hechicería, magia negra, envidia, etc.). Re-conectarás con tu esencia para que puedas iniciar cambios positivos en tu vida.",
      opciones: [
        { sesiones: 3, precio: 88000 },
        { sesiones: 4, precio: 99000 },
      ],
    },
    // {
    //   img: creadorvirtual,
    //   title: "Biomagnetismo",
    //   terapeuta: "Marcela Cabezas",
    //   terapeutaId: 25,
    //   description:
    //     "Es una terapia que se usa con imanes en el cuerpo, ayudándolo a mantener el equilibrio, estimula la circulación, ayuda a eliminar toxinas y desintoxicar el cuerpo.",
    //   opciones: [
    //     { sesiones: 3, precio: 88000 },
    //     { sesiones: 4, precio: 99000 },
    //     { sesiones: 5, precio: 120000 },
    //   ],
    // },
    // {
    //   img: creadorvirtual,
    //   title: "Camino de Regreso al SER: Un viaje intimo hasta tu centro",
    //   terapeuta: "Sarita Infante",
    //   terapeutaId: 26,
    //   description:
    //     "Es una experiencia terapéutica profunda que invita a regresar a tu centro y reconectar con la sabiduría que ya habita en ti. A través de un proceso de 3, 4 o 5 sesiones personalizadas, te acompaño a liberar bloqueos emocionales, activar tu energía interior y recuperar la claridad para habitar tu vida desde un lugar más consciente, liviano y pleno. Cada sesión se convierte en un pequeño ritual de transformación: combinamos coaching del SER, escucha profunda, reconexión energética y prácticas de integración que armonizan mente, cuerpo y alma. Es un espacio seguro, amoroso y profundo para volver a sentirte en equilibrio contigo misma. Beneficios: Reconexión con tu energía y propósito interior ✨ Liberación emocional y claridad mental 🌿 Activación de tu poder personal y confianza 💫 Sensación de calma, ligereza y expansión 🌸 Dirigido a: Personas en procesos de cambio, búsqueda interior o que desean abrir un nuevo ciclo desde el bienestar y la conciencia. 🌺 “Porque cuando vuelves a ti, todo comienza a alinearse.",
    //   opciones: [
    //     { sesiones: 3, precio: 88000 },
    //     { sesiones: 4, precio: 99000 },
    //     { sesiones: 5, precio: 120000 },
    //   ],
    // },

    // {
    //   img: creadorvirtual,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeutaId: 10,
    //   description:
    //     "Esta maravillosa Técnica de Sanación te permitirá una conexión intima con tu Ser, nos ayudará a realizar una investigación para conocer todo aquello que quedo grabado en tu Alma y en tu mente subconsciente, que impide que evoluciones en esta vida y que puedas soltar que le pesa. Puedes solicitar este Tratamiento si quieres: Limpiar sentimientos, actitudes y emociones toxicas. (Ansiedad, Depresión, etc.) Limpiar patrones emocionales familiares, de pareja, laborales. Remover bloqueos de cualquier índole, incluyendo energías de bajo astral  (hechicería, magia negra, envidia, etc.). Re-conectarás con tu esencia para que puedas iniciar cambios positivos en tu vida.",
    //   opciones: [
    //     { sesiones: 3, precio: 55000 },
    //     { sesiones: 4, precio: 70000 },
    //   ],
    // },
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
    setClientName("");
    setClientPhone("");
    console.log("--- DEBUG: Modal de contacto abierto para reservarSesion ---");
  };

  const handleConfirmAndAddToCart = async () => {
    if (!currentTerapiaData) {
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
    const fechaActual = now.toISOString().split("T")[0];
    const horaGenerica = "17:00";

    const reservaDataToSend = {
      servicio: "Tratamiento Integral",
      especialidad: currentTerapiaData.terapiaTitle,
      fecha: fechaActual,
      hora: horaGenerica,
      precio: currentTerapiaData.precio,
      sesiones: currentTerapiaData.sesiones,
      cantidad: 1,
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      terapeuta: currentTerapiaData.terapeutaNombre,
      terapeutaId: currentTerapiaData.terapeutaId,
    };

    console.log(
      "Objeto Reserva a añadir al carrito desde TratamientoIntegral (después de modal):",
      reservaDataToSend
    );

    try {
      // Inicio del bloque `try` para la llamada al backend
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
        `Reserva agregada: ${confirmedReservation.sesiones} sesiones de ${confirmedReservation.especialidad} con ${confirmedReservation.terapeuta}`
      );

      // Cierra el modal y resetea estados
      setShowContactModal(false);
      setCurrentTerapiaData(null);
      setClientName("");
      setClientPhone("");
    } catch (error: any) {
      // Cierre del `try` y comienzo del `catch`
      console.error(
        "ERROR al crear la reserva de Tratamiento Integral:",
        error
      );
      alert(`No se pudo completar la inscripción: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Tratamiento Integral
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
          <Link
            to="/psicologos"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
            Mente y Ser
          </Link>
        </div>
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
      <br></br>
      <br></br>

      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
        Este tratamiento incluye sesiones personalizadas orientadas a tu
        bienestar físico, emocional y espiritual.
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
