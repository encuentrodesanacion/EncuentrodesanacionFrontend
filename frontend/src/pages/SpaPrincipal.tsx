import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "./CartContext"; // Asegúrate de que la ruta sea correcta

import CartIcon from "../components/CartIcon";

// Importaciones de imágenes - Asegúrate de que los nombres de archivo coincidan EXACTAMENTE

import Terapeuta3 from "../assets/Terapeuta3.jpg";
import Terapeuta4 from "../assets/Terapeuta4.jpg";
import Terapeuta5 from "../assets/Terapeuta5.jpg";
import Terapeuta8 from "../assets/Terapeuta8.jpg";
import creadorVirtual from "../assets/creadorvirtual.jpg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- INTERFAZ PARA OPCIONES DE SESIÓN ---
interface OpcionSesion {
  sesiones: number;
  precio: number;
}

// --- INTERFAZ PARA CADA ITEM DE TERAPIA ---
interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  description: string;
  precio: number; // Precio de la terapia principal
  opciones?: OpcionSesion[]; // Hacemos 'opciones' opcional aquí, pero si siempre existe, quita el '?'
}

// --- INTERFAZ PARA DISPONIBILIDAD ---
interface DisponibilidadTerapeuta {
  nombreTerapeuta: string;
  diasDisponibles: number[]; // 0=Domingo, 1=Lunes, etc.
  horasDisponibles: string[]; // Ej. ["10:00", "11:00", "12:00"]
}

// Componente para seleccionar fecha y hora antes de confirmar reserva
interface ReservaConFechaProps {
  terapia: string;
  precio: number;
  onConfirm: (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string // <-- Cambiado de correoCliente a telefonoCliente
  ) => void;
  onClose: () => void;
  disponibilidadTerapeuta?: DisponibilidadTerapeuta;
}

function ReservaConFecha({
  terapia,
  precio,
  onConfirm,
  onClose,
  disponibilidadTerapeuta,
}: ReservaConFechaProps) {
  const [fechaHora, setFechaHora] = useState<Date | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>(""); // <-- Cambiado de correo a telefono

  const handleConfirm = () => {
    if (!fechaHora) {
      alert("Por favor, selecciona fecha y hora.");
      return;
    }
    if (!nombre.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }
    if (!telefono.trim()) {
      alert("Por favor, ingresa tu número de teléfono."); // <-- Mensaje de validación actualizado
      return;
    }
    onConfirm(fechaHora, nombre, telefono); // <-- Pasando telefono en lugar de correo
  };

  const filterDay = (date: Date) => {
    if (!disponibilidadTerapeuta || !disponibilidadTerapeuta.diasDisponibles) {
      return true;
    }
    return disponibilidadTerapeuta.diasDisponibles.includes(date.getDay());
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
    <div className="reserva-fecha-container p-4 border rounded bg-white shadow-md max-w-xs mx-auto">
      <h3 className="text-xl font-bold mb-4">Confirmar Reserva</h3>
      <p className="mb-2">
        Servicio: <strong>{terapia}</strong>
      </p>
      <p className="mb-4">Precio: ${precio.toLocaleString()} CLP</p>

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
        filterDate={filterDay}
        filterTime={filterTimes}
      />

      <div className="mb-4">
        <label
          htmlFor="nombreCliente"
          className="block text-sm font-medium text-gray-700"
        >
          Tu Nombre
        </label>
        <input
          type="text"
          id="nombreCliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Ej: Juan Pérez"
        />
      </div>
      {/* Campo para el número de teléfono */}
      <div className="mb-4">
        <label
          htmlFor="telefonoCliente" // <-- Cambiado de correoCliente a telefonoCliente
          className="block text-sm font-medium text-gray-700"
        >
          Tu Número de Teléfono
        </label>
        <input
          type="tel" // <-- Tipo de input cambiado a 'tel' para teléfonos
          id="telefonoCliente" // <-- Cambiado de correoCliente a telefonoCliente
          value={telefono} // <-- Usando el estado 'telefono'
          onChange={(e) => setTelefono(e.target.value)} // <-- Actualizando el estado 'telefono'
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Ej: +56912345678" // <-- Placeholder actualizado
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

// Interfaz para la reserva pendiente (lo que se guarda antes de elegir fecha/hora y nombre/telefono)
interface ReservaPendiente {
  terapia: string;
  precio: number;
  terapeutaNombre: string;
}

export default function SpaPrincipal() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [reservaPendiente, setReservaPendiente] =
    useState<ReservaPendiente | null>(null);

  // --- DATOS DE DISPONIBILIDAD DE EJEMPLO (IDEALMENTE VIENEN DEL BACKEND) ---
  const disponibilidades: DisponibilidadTerapeuta[] = [
    {
      nombreTerapeuta: "Disponible", // El terapeuta genérico
      diasDisponibles: [1, 2, 3, 4, 5], // Lunes a Viernes (0=Domingo, 1=Lunes, ..., 6=Sábado)
      horasDisponibles: [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
    },
    {
      nombreTerapeuta: "Betsy Bolivar",
      diasDisponibles: [1, 3, 5], // Lunes, Miércoles, Viernes
      horasDisponibles: ["10:00", "11:00", "15:00", "16:00"],
    },
    {
      nombreTerapeuta: "Mónica García",
      diasDisponibles: [2, 4], // Martes, Jueves
      horasDisponibles: ["14:00", "15:00", "16:00", "17:00", "18:00"],
    },
    {
      nombreTerapeuta: "Paulina Villablanca", // Para Constelaciones Familiares
      diasDisponibles: [6], // Sábados
      horasDisponibles: ["10:00", "11:00", "12:00"],
    },
    {
      nombreTerapeuta: "Sandra Da Silva", // Purificación
      diasDisponibles: [1, 2, 3], // Lunes, Martes, Miércoles
      horasDisponibles: ["10:00", "10:30", "11:00", "11:30"],
    },
    {
      nombreTerapeuta: "Rosa Santimone", // Péndulo Hebreo
      diasDisponibles: [4, 5], // Jueves, Viernes
      horasDisponibles: ["17:00", "17:30", "18:00", "18:30"],
    },
    {
      nombreTerapeuta: "Paola Quintero", // Tarot
      diasDisponibles: [0, 6], // Domingo, Sábado
      horasDisponibles: ["10:00", "11:00", "12:00", "13:00"],
    },
    {
      nombreTerapeuta: "Alice Basay", // Regresión
      diasDisponibles: [0, 6], // Domingo, Sábado
      horasDisponibles: ["10:00", "11:00", "12:00", "13:00"],
    },
  ];

  // Función para obtener la disponibilidad de un terapeuta específico
  const getDisponibilidadForTerapeuta = (
    terapeutaNombre: string
  ): DisponibilidadTerapeuta | undefined => {
    return disponibilidades.find((d) => d.nombreTerapeuta === terapeutaNombre);
  };
  // --- FIN DATOS DE DISPONIBILIDAD ---

  // Tu lista de terapias
  const terapias: TerapiaItem[] = [
    // Tipamos el array de terapias
    // {
    //   img: creadorVirtualImg, // Usar el nombre renombrado
    //   title: "Canalización Energetica",
    //   terapeuta: "Disponible",
    //   description:
    //     "Es una terapia en la cual una persona actúa como un conducto para recibir mensajes de guías espirituales,angeles, maestros ascendidos y seres fallecidos. Es una herramienta poderosa para la conexión con lo divino u el crecimiento personal. Es una forma de recibir orientación espiritual, sanar emocionalmente y obtener claridad sobre diversos aspectos de la vida.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    // },

    {
      img: Terapeuta3,
      title: "Liberación Memorias Uterinas",
      terapeuta: "Mónica García",
      description:
        "Es una Terapia para conectar con nuestro Centro Creativo, el útero sagrado y liberar patrones energéticos, emocionales y ancestrales que se almacenan en esta zona. Ayuda a sanar traumas pasados, mejorar la relación con la feminidad y potenciar la creatividad y el bienestar.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta4,
      title: "Constelaciones Familiares",
      terapeuta: "Paulina Villablanca",
      description:
        "Es una herramienta terapéutica para tratar conflictos personales, familiares y laborales, identificando dinámicas ocultas y lealtades invisibles que influyen en nuestra vida. Ayuda a liberar patrones limitantes y a encontrar soluciones desde el amor y la comprensión.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta5,
      title: "Purificación y limpieza de energías negativas",
      terapeuta: "Sandra Da Silva",
      description:
        "¿Te sientes agotado/a sin mayor razón? ¿Cansado/a de atraer situaciones y personas tóxicas a tu vida? ¿Sientes que tus caminos están cerrados en el amor, el dinero y la salud? ¿No logras dormir bien por las noches o te despiertas con pesadillas? ¿Sientes presencias extrañas en tu hogar u oficina? ¿Estás irritable y tienes cambios bruscos de humor? ¡Está es la Terapia adecuada para ti! Es un proceso de sanación profunda que elimina bloqueos energéticos, entidades negativas y energías de baja vibración que afectan tu bienestar físico, emocional y espiritual, restaurando tu armonía y vitalidad.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    // {
    //   img: creadorVirtualImg,
    //   title: "Péndulo Hebreo",
    //   terapeuta: "Rosa Santimone",
    //   description:
    //     "Es una terapia de armonización energética que permite detectar y eliminar energías negativas, bloqueos emocionales y físicos, y equilibrar los chakras. Utiliza un péndulo de madera con etiquetas hebreas para trabajar a nivel vibracional y promover la sanación holística.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    // },
    {
      img: Terapeuta8,
      title: "Tarot Predictivo y/o Terapia con Oráculos",
      terapeuta: "Paola Quintero",
      description:
        "Cuenta la leyenda que Odín, buscando la sabiduría, se sacrifica y de su sangre brotan las runas. Estas, además de ser un alfabeto, son un oráculo con mensajes poderosos que te guiarán en tu camino. La lectura de runas es una herramienta de autoconocimiento y orientación que te permite comprender tu presente, explorar el pasado y vislumbrar el futuro, obteniendo claridad para tomar decisiones importantes. ¿Te sientes agotado/a sin mayor razón? ¿Cansado/a de atraer situaciones y personas tóxicas a tu vida? ¿Sientes que tus caminos están cerrados en el amor, el dinero y la salud? ¿No logras dormir bien por las noches o te despiertas con pesadillas? ¿Sientes presencias extrañas en tu hogar u oficina? ¿Estás irritable y tienes cambios bruscos de humor? ¡Está es la Terapia adecuada para ti! Es un proceso de sanación profunda que elimina bloqueos energéticos, entidades negativas y energías de baja vibración que afectan tu bienestar físico, emocional y espiritual, restaurando tu armonía y vitalidad.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: creadorVirtual,
      title: "Regresión",
      terapeuta: "Alice Basay",
      description: "Correo de Prueba.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
  ];

  // Mostrar formulario para seleccionar fecha y hora
  const reservar = (
    terapiaTitle: string,
    terapiaPrecio: number,
    terapeutaNombre: string
  ) => {
    if (
      typeof terapiaPrecio !== "number" ||
      isNaN(terapiaPrecio) ||
      terapiaPrecio === null ||
      terapiaPrecio < 0
    ) {
      console.error("Error: Precio de la terapia inválido al reservar.");
      alert("No se puede reservar: el precio es inválido.");
      return;
    }
    setReservaPendiente({
      terapia: terapiaTitle,
      precio: terapiaPrecio,
      terapeutaNombre: terapeutaNombre,
    });
  }; // Confirmar reserva y agregar al carrito

  // Confirmar reserva y agregar al carrito

  const confirmarReserva = (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string // <-- Cambiado de correoCliente a telefonoCliente
  ) => {
    if (!reservaPendiente) return;

    const reserva: Reserva = {
      id: Date.now(), // Genera un ID único
      servicio: "Spa Principal",
      especialidad: reservaPendiente.terapia, // Mantén esto si la especialidad es la misma que la terapia
      fecha: fechaHora.toISOString().split("T")[0],
      hora: fechaHora.toTimeString().split(" ")[0].substring(0, 5), // Formato HH:MM
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente, // <-- Asignando el teléfono
      terapeuta: reservaPendiente.terapeutaNombre, // <-- ¡AÑADIDO AQUÍ!
      sesiones: 1, // <-- ¡AÑADIDO AQUÍ! Asumiendo 1 sesión por defecto según tu setup
      cantidad: 1, // Asumo 1 sesión por defecto para estas terapias (esto es distinto a 'sesiones' si 'cantidad' se refiere a número de items del mismo tipo)
    };

    // --- ¡AÑADE ESTA LÍNEA AQUÍ! ---
    console.log(
      "DEBUG FRONTEND: Valor de reserva.terapeuta antes de addToCart:",
      reserva.terapeuta
    );
    // --- FIN LÍNEA ---

    console.log(
      "Objeto Reserva FINAL a añadir al carrito desde SpaPrincipal:",
      reserva
    );
    addToCart(reserva);
    console.log(
      "Objeto Reserva FINAL a añadir al carrito desde SpaPrincipal:",
      reserva
    );

    alert(
      `Reserva agregada: ${reserva.servicio} el ${reserva.fecha} a las ${reserva.hora}. Te contactaremos al ${reserva.telefonoCliente}.` // <-- Mensaje actualizado
    );

    setReservaPendiente(null); // Cierra el modal de fecha/hora
  };
  // --- OBTENER LA DISPONIBILIDAD DEL TERAPEUTA SELECCIONADO ---
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(reservaPendiente.terapeutaNombre)
    : undefined;
  // --- FIN OBTENER DISPONIBILIDAD ---

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Spa Principal</h1>
        <CartIcon />
      </header>

      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Bienvenido al Spa Principal
      </h2>
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center"></p>

      <div className="flip-wrapper-container mt-10">
        {terapias.map((t, i) => (
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
                  <h3 className="mb-2 font-bold">
                    {t.terapeuta !== "Disponible" && (
                      <span className="text-sm text-gray-600 block">
                        {t.terapeuta}
                      </span>
                    )}
                    {t.title}
                  </h3>
                  <p className="mb-2">{t.description}</p>
                  <form
                    className="w-full px-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {t.opciones && t.opciones.length > 0 ? (
                      t.opciones.map((op, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() =>
                            reservar(t.title, op.precio, t.terapeuta)
                          }
                          className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700"
                        >
                          {op.sesiones} Sesión (${op.precio.toLocaleString()}{" "}
                          CLP)
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => reservar(t.title, t.precio, t.terapeuta)}
                        className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700"
                      >
                        Toma de hora (${t.precio.toLocaleString()} CLP)
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reservaPendiente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setReservaPendiente(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
            >
              X
            </button>
            <ReservaConFecha
              terapia={reservaPendiente.terapia}
              precio={reservaPendiente.precio}
              onConfirm={confirmarReserva}
              onClose={() => setReservaPendiente(null)}
              disponibilidadTerapeuta={terapeutaSeleccionadoDisponibilidad}
            />
          </div>
        </div>
      )}
    </div>
  );
}
