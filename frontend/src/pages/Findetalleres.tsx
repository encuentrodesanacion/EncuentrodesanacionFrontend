import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "../pages/CartContext";

import CartIcon from "../components/CartIcon";

import Tallersanando from "../assets/Tallersanando.jpeg";
import Terapeuta2 from "../assets/Terapeuta2.jpg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Interface para un ítem de taller de fin de semana
interface TallerFinDeSemanaItem {
  id: string;
  title: string;
  description: string;
  price: number;
  date: string; // Fecha específica del taller de fin de semana (YYYY-MM-DD)
  time: string; // Hora específica del taller de fin de semana (HH:MM)
  instructor: string; // Terapeuta/Instructor
  instructorId: number;
}

// Interfaz para la disponibilidad (no se usará para el filtro de fecha, pero se mantiene para horas)
interface DisponibilidadTerapeuta {
  nombreTerapeuta: string;
  diasDisponibles: number[]; // 0=Domingo, 1=Lunes, etc.
  horasDisponibles: string[]; // Ej. ["10:00", "11:00", "12:00"]
}

// Datos de disponibilidad (puedes ajustarlos si hay horas específicas por taller)
const disponibilidades: DisponibilidadTerapeuta[] = [
  {
    nombreTerapeuta: "Paulina Villablanca",
    diasDisponibles: [5, 6], // Viernes (5), Sábado (6)
    horasDisponibles: [
      "19:00", // Añadido para el Sábado 21
      "20:30", // Añadido para el Viernes 20
    ],
  },
  // Añade disponibilidades para otros instructores si es necesario
];

const getDisponibilidadForTerapeuta = (
  terapeutaNombre: string
): DisponibilidadTerapeuta | undefined => {
  return disponibilidades.find((d) => d.nombreTerapeuta === terapeutaNombre);
};

// --- Componente para seleccionar fecha y hora (ReservaConFecha) ---
// LO INCLUYO AQUÍ PARA CLARIDAD, PERO DEBERÍA ESTAR EN components/ReservaConFecha.tsx
interface ReservaConFechaProps {
  terapia: string;
  precio: number;
  onConfirm: (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => void;
  onClose: () => void;
  disponibilidadTerapeuta?: DisponibilidadTerapeuta; // Opcional, para filtrar fechas/horas
  // --- NUEVA PROPIEDAD: Fechas permitidas ---
  allowedDates?: string[]; // Array de strings "YYYY-MM-DD"
}

function ReservaConFecha({
  terapia,
  precio,
  onConfirm,
  onClose,
  disponibilidadTerapeuta,
  allowedDates, // Recibimos las fechas permitidas
}: ReservaConFechaProps) {
  const [fechaHora, setFechaHora] = useState<Date | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");

  const handleConfirm = () => {
    if (!fechaHora) {
      alert("Por favor, selecciona fecha y hora.");
      return;
    }
    if (!nombre.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }
    const phoneRegex = /^\+?\d[\d\s-]{7,15}\d$/;
    if (!phoneRegex.test(telefono.trim())) {
      alert(
        "Por favor, ingresa un número de teléfono válido (ej. +XX YYYYYYYYY)."
      );
      return;
    }
    onConfirm(fechaHora, nombre, telefono);
  };

  // --- MODIFICAR filterDay para usar allowedDates ---
  const filterDay = (date: Date) => {
    // Si hay fechas permitidas específicas, solo permite esas.
    if (allowedDates && allowedDates.length > 0) {
      const dateString = date.toISOString().split("T")[0]; // Convierte la fecha a "YYYY-MM-DD"
      return allowedDates.includes(dateString);
    }
    // Si no hay allowedDates específicos, o si se usa disponibilidadTerapeuta (para días de la semana), se aplica esto:
    if (disponibilidadTerapeuta && disponibilidadTerapeuta.diasDisponibles) {
      return disponibilidadTerapeuta.diasDisponibles.includes(date.getDay());
    }
    return true; // Si no hay filtros, todos los días son válidos
  };

  const filterTimes = (time: Date) => {
    if (!disponibilidadTerapeuta || !disponibilidadTerapeuta.horasDisponibles) {
      return true;
    }
    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();
    const timeString = `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;
    return disponibilidadTerapeuta.horasDisponibles.includes(timeString);
  };

  return (
    <div className="reserva-con-fecha-modal p-6 rounded-lg shadow-2xl bg-white text-gray-800">
      <h3 className="text-2xl font-bold mb-4 text-center">Confirmar Reserva</h3>
      <p className="text-lg mb-2 text-center">
        Servicio: <strong>{terapia}</strong>
      </p>
      <p className="text-lg mb-4 text-center">
        Precio: ${precio.toLocaleString()} CLP
      </p>

      <DatePicker
        selected={fechaHora}
        onChange={(date: Date | null) => setFechaHora(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={new Date()}
        placeholderText="Selecciona fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        filterDate={filterDay} // Usar el filtro de día
        filterTime={filterTimes} // Usar el filtro de hora
      />
      {/* ... (campos de nombre y teléfono) ... */}
      <div className="mb-4">
        <label htmlFor="nombreCliente" className="block text-sm font-bold mb-2">
          Tu Nombre Completo:
        </label>
        <input
          type="text"
          id="nombreCliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Ej: Juan Pérez"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="telefonoCliente"
          className="block text-sm font-bold mb-2"
        >
          Tu Número de Teléfono:
        </label>
        <input
          type="tel"
          id="telefonoCliente"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Ej: +56912345678"
        />
      </div>

      <button
        onClick={handleConfirm}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
      >
        Agregar al Carrito
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full mt-2"
      >
        Cancelar
      </button>
    </div>
  );
}
// --- FIN Componente ReservaConFecha ---

export default function FinDeTalleres() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showReservaConFechaModal, setShowReservaConFechaModal] =
    useState(false);
  const [tallerParaReserva, setTallerParaReserva] =
    useState<TallerFinDeSemanaItem | null>(null);

  // Datos de ejemplo para los talleres de fin de semana (ajústalos según tus datos reales)
  const talleresFinDeSemana: TallerFinDeSemanaItem[] = [
    {
      id: "Sanando-con-papá-y-mamá",
      title: "Sanando con Papá y Mamá. Reconexion con la Prosperidad",
      description:
        "¿Sientes que la relación con papá y mamá es difícil, que el vínculo es complejo? ¿Crees tener heridas de infancia que no te han permitido avanzar tanto en tu plano laboral como en tus relaciones amorosas? Este taller es para ti. Liberaremos emociones reprimidas, tomaremos energía y fuerza para concretar nuestras metas, y nos conectaremos con la vida, los sueños y el éxito.",
      price: 10000,
      date: "Opcional", // Sábado, junio 21, 2025
      time: "Opcional",
      instructor: "Paulina Villablanca",
      instructorId: 2,
    },
    {
      id: "retiro-meditacion-jun-20", // Nuevo ID para el taller del viernes 20
      title: "Retiro de Meditación y Sanación (Viernes)",
      description:
        "Una sesión intensiva de meditación para empezar el fin de semana.",
      price: 10000,
      date: "2025-06-20", // Viernes, junio 20, 2025
      time: "20:30", // Hora específica para el viernes
      instructor: "Paulina Villablanca",
      instructorId: 2,
    },
    {
      id: "retiro-meditacion-jun-22", // Nuevo ID para el taller del viernes 20
      title: "Regresión",
      description:
        "Una sesión intensiva de meditación para empezar el fin de semana.",
      price: 10000,
      date: "2025-06-20", // Viernes, junio 20, 2025
      time: "20:30", // Hora específica para el viernes
      instructor: "Alice Basay",
      instructorId: 5,
    },
  ];

  // --- Función para ABRIR EL MODAL DE RESERVA CON FECHA ---
  const handleOpenReservaConFechaModal = (taller: TallerFinDeSemanaItem) => {
    setTallerParaReserva(taller);
    setShowReservaConFechaModal(true);
    console.log(
      "--- DEBUG: Modal de Reserva con Fecha abierto para Fin de Talleres ---"
    );
  };

  // --- Función para CONFIRMAR y AÑADIR AL CARRITO desde el modal de ReservaConFecha ---
  const handleConfirmReservaConFechaAndAddToCart = (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => {
    if (!tallerParaReserva) {
      console.error("Error: tallerParaReserva es nulo al confirmar.");
      alert("Hubo un error al procesar tu inscripción. Intenta de nuevo.");
      return;
    }

    const phoneRegex = /^\+?\d[\d\s-]{7,15}\d$/;
    if (!phoneRegex.test(telefonoCliente.trim())) {
      alert(
        "Por favor, ingresa un número de teléfono válido (ej. +XX YYYYYYYYY)."
      );
      return;
    }

    const nuevaReserva: Reserva = {
      id: Date.now(),
      servicio: "Finde de Talleres y Terapias Grupales",
      especialidad: tallerParaReserva.title,
      fecha: fechaHora.toISOString().split("T")[0],
      hora: fechaHora.toTimeString().split(" ")[0].substring(0, 5),
      precio: tallerParaReserva.price,
      sesiones: 1,
      cantidad: 1,
      nombreCliente: nombreCliente.trim(),
      telefonoCliente: telefonoCliente.trim(),
      terapeuta: tallerParaReserva.instructor,
      terapeutaId: tallerParaReserva.instructorId,
    };

    console.log(
      "Objeto Reserva a añadir al carrito desde FinDeTalleres (después de modal ReservaConFecha):",
      nuevaReserva
    );

    try {
      addToCart(nuevaReserva);
      console.log("addToCart fue llamado exitosamente.");
      alert(`"${tallerParaReserva.title}" ha sido agregado al carrito.`);
    } catch (error) {
      console.error("Error al llamar a addToCart:", error);
      alert("Hubo un problema al agregar el taller al carrito.");
    }

    setShowReservaConFechaModal(false);
    setTallerParaReserva(null);
  };

  // --- OBTENER LA DISPONIBILIDAD DEL TERAPEUTA SELECCIONADO ---
  const terapeutaSeleccionadoDisponibilidad = tallerParaReserva
    ? getDisponibilidadForTerapeuta(tallerParaReserva.instructor)
    : undefined;
  // --- FIN OBTENER DISPONIBILIDAD ---

  // --- OBTENER LAS FECHAS PERMITIDAS DE LOS TALLERES ---
  // Recopila todas las fechas únicas de los talleres disponibles
  const allowedDates = talleresFinDeSemana.map((taller) => taller.date);
  // Asegúrate de que las fechas sean únicas
  const uniqueAllowedDates = [...new Set(allowedDates)];
  // --- FIN FECHAS PERMITIDAS ---

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Finde de Talleres y Terapias Grupales
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
        Nuestros Talleres de Fin de Semana
      </h2>
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
        Experiencias intensivas para tu bienestar y desarrollo personal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {talleresFinDeSemana.map((taller: TallerFinDeSemanaItem) => (
          <div
            key={taller.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            {/* Gestión de imágenes: ajusta a tus necesidades */}
            {taller.id === "Sanando-con-papá-y-mamá" && (
              <img
                src={Tallersanando}
                alt={taller.title}
                className="w-full h-48 object-cover"
              />
            )}
            {taller.id === "workshop-yoga-jul" && ( // Este ID es de julio, no de junio
              <img
                src={Terapeuta2}
                alt={taller.title}
                className="w-full h-48 object-cover"
              />
            )}
            {taller.id === "retiro-meditacion-jun-20" && ( // Nueva imagen para el taller del 20 de junio
              <img
                src={Terapeuta2} // Usa una imagen apropiada
                alt={taller.title}
                className="w-full h-48 object-cover"
              />
            )}
            {!(
              taller.id === "Sanando-con-papá-y-mamá" ||
              taller.id === "workshop-yoga-jul" ||
              taller.id === "retiro-meditacion-jun-20"
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
                onClick={() => handleOpenReservaConFechaModal(taller)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
              >
                Inscribirse al Taller
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE RESERVA CON FECHA Y HORA (Usando ReservaConFecha) --- */}
      {showReservaConFechaModal && tallerParaReserva && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <ReservaConFecha
              terapia={tallerParaReserva.title}
              precio={tallerParaReserva.price}
              onConfirm={handleConfirmReservaConFechaAndAddToCart}
              onClose={() => setShowReservaConFechaModal(false)}
              disponibilidadTerapeuta={terapeutaSeleccionadoDisponibilidad}
              allowedDates={uniqueAllowedDates}
            />
          </div>
        </div>
      )}
    </div>
  );
}
