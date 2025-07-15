import React, { useState, useEffect } from "react"; // <--- Añadir useEffect
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// No necesitamos importar DisponibilidadTerapeuta aquí si este componente lo va a cargar
// import { DisponibilidadTerapeuta } from "../types/index"; // <--- Quitar esta importación

interface ReservaConFechaProps {
  terapia: string;
  precio: number;
  onConfirm: (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => void;
  onClose: () => void;
  // --- CAMBIO CLAVE AQUÍ: Recibir terapeutaId y especialidad ---
  terapeutaId: number; // Añadir terapeutaId a las props
  especialidad: string; // Ya lo habías añadido, ¡bien!
  // No necesitamos 'disponibilidadTerapeuta' como prop ya que la cargaremos aquí.
  // allowedDates?: string[]; // Si esto sigue siendo necesario, déjalo. Por ahora lo comentaré.
}

export default function ReservaConFecha({
  terapia,
  precio,
  onConfirm,
  onClose,
  terapeutaId, // <--- Desestructurar terapeutaId
  especialidad, // <--- Desestructurar especialidad
}: // allowedDates, // Comentado por ahora, puedes descomentar si lo usas
ReservaConFechaProps) {
  const [fechaHora, setFechaHora] = useState<Date | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  // --- NUEVO ESTADO: Horas disponibles cargadas por este componente ---
  const [horasDisponiblesParaFecha, setHorasDisponiblesParaFecha] = useState<
    string[]
  >([]);
  // --- NUEVO ESTADO: Para el día actualmente seleccionado en el DatePicker ---
  const [selectedDayString, setSelectedDayString] = useState<string | null>(
    null
  );

  // --- EFECTO PARA CARGAR HORAS CUANDO CAMBIA LA FECHA SELECCIONADA ---
  useEffect(() => {
    const fetchHorasDisponibles = async () => {
      if (fechaHora && terapeutaId && especialidad) {
        const formattedDate = fechaHora.toISOString().split("T")[0]; // YYYY-MM-DD

        // Guardar el día seleccionado para usarlo en filterTimes
        setSelectedDayString(formattedDate);

        const apiBaseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
        const params = new URLSearchParams({
          terapeutaId: String(terapeutaId), // Convertir a string para URLSearchParams
          fecha: formattedDate,
          especialidad: especialidad,
        }).toString();

        console.log(
          `DEBUG ReservaConFecha: Llamando a la API de disponibilidad: ${apiBaseUrl}/api/webpay/disponibilidad-horas?${params}`
        );

        try {
          const response = await fetch(
            `${apiBaseUrl}/api/webpay/disponibilidad-horas?${params}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(
            "DEBUG ReservaConFecha: Horas recibidas de la API:",
            data.horas
          );
          // Asegurarse de que data.horas es un array antes de setearlo
          if (Array.isArray(data.horas)) {
            setHorasDisponiblesParaFecha(data.horas);
          } else {
            setHorasDisponiblesParaFecha([]);
            console.warn(
              "DEBUG ReservaConFecha: La respuesta de horas no es un array:",
              data.horas
            );
          }
        } catch (error) {
          console.error(
            "ERROR ReservaConFecha: Fallo al obtener horas disponibles:",
            error
          );
          setHorasDisponiblesParaFecha([]); // Limpiar en caso de error
        }
      } else {
        setHorasDisponiblesParaFecha([]); // Limpiar si no hay fecha/terapeuta/especialidad
        setSelectedDayString(null);
      }
    };

    fetchHorasDisponibles();
    // Dependencias del useEffect: fechaHora, terapeutaId, especialidad
  }, [fechaHora, terapeutaId, especialidad]);

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

    // --- VALIDACIÓN DE HORA (ADAPTADA A LAS HORAS CARGADAS LOCALMENTE) ---
    const selectedHour = fechaHora.getHours();
    const selectedMinute = fechaHora.getMinutes();
    const selectedTimeString = `${String(selectedHour).padStart(
      2,
      "0"
    )}:${String(selectedMinute).padStart(2, "0")}`;

    // Ahora validamos contra `horasDisponiblesParaFecha` que es el estado local
    if (!horasDisponiblesParaFecha.includes(selectedTimeString)) {
      alert("La hora seleccionada no está disponible.");
      return;
    }
    // --- FIN VALIDACIÓN ---

    onConfirm(fechaHora, nombre, telefono);
  };

  // Funciones para filtrar días y horas en el DatePicker
  const filterDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // No permitir fechas pasadas
    if (date < today) {
      return false;
    }

    // Ya no usamos `allowedDates` prop aquí si las horas vienen de la API.
    // Si todavía tienes una lista general de `allowedDates` que no viene de disponibilidad
    // y quieres usarla, deberías cargarla en un useEffect diferente.
    // if (allowedDates && allowedDates.length > 0) {
    //   const dateString = date.toISOString().split("T")[0];
    //   return allowedDates.includes(dateString);
    // }

    // Por ahora, filterDay solo habilitará los días si hay horas disponibles para ellos
    // Para hacer esto correctamente, necesitaríamos cargar *todos* los días disponibles
    // para este terapeuta y especialidad en un estado separado, similar a `disponibilidadesProcesadas`
    // en `findetalleres.tsx`. Por simplicidad y para avanzar, haremos un filtrado optimista
    // o basado en una lista predefinida si no se carga toda la disponibilidad.

    // === SOLUCIÓN RÁPIDA PARA filterDay ===
    // La forma más simple para `filterDay` ahora que las horas se cargan dinámicamente
    // por fecha, es simplemente permitir todos los días futuros y luego `filterTime`
    // se encargará de limitar las horas. O, si necesitas filtrar días específicos
    // (ej. sólo los viernes), esa lista debería venir de otra fuente.

    // Si tu backend tiene un endpoint para "días disponibles" para un terapeuta/especialidad,
    // sería el lugar ideal para obtener una lista de `allowedDates`.
    // Por ahora, si no tienes esa lista, DatePicker mostrará todos los días del calendario
    // y solo se podrán seleccionar las horas correctas cuando se elija un día.

    // Dejaremos filterDay sin un filtrado estricto por ahora, y nos apoyaremos en filterTime
    // para garantizar que solo se puedan seleccionar horas válidas.
    return true; // Permitir todos los días futuros para la selección inicial
  };

  const filterTimes = (time: Date) => {
    // Obtener la hora del DatePicker en formato HH:MM
    const timeString = `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes()
    ).padStart(2, "0")}`;

    // Solo habilitar la hora si está en la lista de `horasDisponiblesParaFecha`
    // y si el día actual del DatePicker coincide con el día para el que cargamos las horas
    const isToday =
      fechaHora &&
      fechaHora.toISOString().split("T")[0] ===
        time.toISOString().split("T")[0];

    // console.log("DEBUG filterTimes:", {
    //   timeString,
    //   horasDisponiblesParaFecha,
    //   isIncluded: horasDisponiblesParaFecha.includes(timeString),
    //   isToday // Solo relevante si se está filtrando una hora para el día actualmente seleccionado
    // });

    // La lógica clave es si la hora está en la lista de horas disponibles
    return horasDisponiblesParaFecha.includes(timeString);
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
        timeIntervals={60} // <--- Configura tus intervalos de tiempo (e.g., 60 para horas completas)
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={new Date()}
        placeholderText="Selecciona fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        // No se usará `filterDate` para días específicos por ahora,
        // ya que la disponibilidad de días completos vendría del backend.
        // Si no se habilita ningún día, el DatePicker no mostrará nada.
        // Por ahora, simplemente permitimos todos los días futuros y confiamos en `filterTime`.
        // Si necesitas días específicos, necesitaríamos un endpoint `/disponibilidad-dias` en el backend.
        filterDate={filterDay} // Permitimos todos los días futuros por simplicidad, y filterTime se encarga
        filterTime={filterTimes}
        // includeDates={Array.from(Object.keys(disponibilidadTerapeuta?.disponibilidadPorFecha || {}), (dateString) => new Date(dateString))}
        // Si quieres habilitar solo los días con disponibilidad real, necesitas una lista de ESOS DÍAS del backend
        // o construirla aquí si la "raw data" ya la trae.
      />
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
          Tu Número de Teléfono
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
