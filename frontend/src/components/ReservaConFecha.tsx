import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Importa la interfaz centralizada desde tu archivo de tipos
// Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import { DisponibilidadTerapeuta } from "../types/index";
import parsePhoneNumberFromString from "libphonenumber-js";

interface ReservaConFechaProps {
  terapia: string;
  precio: number;
  onConfirm: (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => void;
  onClose: () => void;
  // La prop 'disponibilidadTerapeuta' ahora espera la nueva estructura
  disponibilidadTerapeuta?: DisponibilidadTerapeuta;
  allowedDates?: string[]; // Array de strings "YYYY-MM-DD"
}

export default function ReservaConFecha({
  terapia,
  precio,
  onConfirm,
  onClose,
  disponibilidadTerapeuta, // La prop recibida ya tendrá la nueva estructura
  allowedDates,
}: ReservaConFechaProps) {
  console.log(
    "DEBUG ReservaConFecha: Prop disponibilidadTerapeuta recibida:",
    disponibilidadTerapeuta
  );
  const [fechaHora, setFechaHora] = useState<Date | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [keyForDatePicker, setKeyForDatePicker] = useState(0);
  useEffect(() => {
    setKeyForDatePicker((prevKey) => prevKey + 1);
    setFechaHora(null); // Reinicia la fecha/hora seleccionada para evitar inconsistencias
  }, [disponibilidadTerapeuta]);

  const handleConfirm = () => {
    if (!fechaHora) {
      alert("No hay reserva pendiente para confirmar.");
      return;
    }
    // Validaciones de cliente y teléfono (corregidas)
    if (nombre.trim() === "" || telefono.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(telefono.trim());
    if (!phoneNumber || !phoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono válido con código de país (ej. +56912345678 o +34699111222)."
      );
      return;
    }

    console.log(
      "País detectado por número telefónico:",
      phoneNumber.country || "Desconocido"
    );

    // --- VALIDACIÓN DE HORA (ADAPTADA A LA NUEVA ESTRUCTURA) ---
    const selectedHour = fechaHora.getHours();
    const selectedMinute = fechaHora.getMinutes();
    const selectedTimeString = `${String(selectedHour).padStart(
      2,
      "0"
    )}:${String(selectedMinute).padStart(2, "0")}`;

    // Necesitamos verificar las horas disponibles para el día específico seleccionado
    const selectedDateString = fechaHora.toISOString().split("T")[0];
    const hoursForSelectedDay =
      disponibilidadTerapeuta?.disponibilidadPorFecha[selectedDateString] || [];

    if (
      selectedTimeString === "00:00" &&
      disponibilidadTerapeuta && // Si hay data
      !hoursForSelectedDay.includes("00:00") // Y 00:00 no está explícitamente en las horas de ESE día
    ) {
      alert("Por favor, selecciona una hora válida para tu reserva.");
      return;
    }
    // --- FIN VALIDACIÓN ---

    onConfirm(fechaHora, nombre, telefono);
  };

  // Funciones para filtrar días y horas en el DatePicker
  const filterDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return false; // No permitir fechas pasadas
    }

    if (allowedDates && allowedDates.length > 0) {
      const dateString = date.toISOString().split("T")[0];
      return allowedDates.includes(dateString);
    }

    // --- FILTRADO DE DÍAS (ADAPTADO A LA NUEVA ESTRUCTURA) ---
    // 'disponibilidadTerapeuta' ahora tiene 'disponibilidadPorFecha'
    if (
      disponibilidadTerapeuta &&
      disponibilidadTerapeuta.disponibilidadPorFecha
    ) {
      const dateString = date.toISOString().split("T")[0]; // Ej. "2025-07-01"

      // Un día es disponible si existe una entrada para esa fecha en 'disponibilidadPorFecha'
      // Y si tiene al menos una hora disponible para ese día.
      const hasHoursForThisDay =
        disponibilidadTerapeuta.disponibilidadPorFecha[dateString] &&
        disponibilidadTerapeuta.disponibilidadPorFecha[dateString].length > 0;

      console.log(
        "DEBUG filterDay: Fecha DatePicker (YYYY-MM-DD):",
        dateString
      );
      console.log(
        "DEBUG filterDay: DisponibilidadPorFecha del terapeuta:",
        disponibilidadTerapeuta.disponibilidadPorFecha
      );
      console.log(
        "DEBUG filterDay: ¿Tiene horas para esta fecha?",
        hasHoursForThisDay
      );
      if (hasHoursForThisDay === undefined) {
        // <-- Añade esta condición
        console.log(
          "DEBUG filterDay: Horas para esta fecha que causan undefined:",
          disponibilidadTerapeuta.disponibilidadPorFecha[dateString]
        );
      }

      return hasHoursForThisDay; // Retorna true si hay horas para este día
    }

    return false; // Por defecto, si no hay disponibilidad cargada/definida, deshabilita el día.
  };

  const filterTimes = (time: Date) => {
    // La fecha seleccionada por el usuario está en el estado 'fechaHora'.
    // Si 'fechaHora' no está seleccionada, o si no hay data de disponibilidad, no habilitamos nada.
    if (
      !fechaHora ||
      !disponibilidadTerapeuta ||
      !disponibilidadTerapeuta.disponibilidadPorFecha
    ) {
      console.log(
        "DEBUG filterTimes: Fecha seleccionada o data de disponibilidad por fecha no definida."
      );
      return false; // Si no hay fecha seleccionada o data, deshabilitar horas
    }

    // Obtener la fecha seleccionada del estado 'fechaHora' para buscar las horas específicas

    const selectedDateString = fechaHora.toISOString().split("T")[0]; // "YYYY-MM-DD" de la fecha SELECCIONADA
    // Obtener las horas disponibles específicamente para esta fecha seleccionada
    const hoursForThisDay =
      disponibilidadTerapeuta.disponibilidadPorFecha[selectedDateString];

    if (!hoursForThisDay || hoursForThisDay.length === 0) {
      console.log(
        "DEBUG filterTimes: No hay horas disponibles para el día:",
        selectedDateString
      );
      return false; // No hay horas para este día específico, deshabilitar
    }

    // --- Lógica para la hora actual del DatePicker (timeString) ---
    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();
    const timeString = `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;

    console.log("DEBUG filterTimes: Hora DatePicker (HH:MM):", timeString);
    console.log(
      "DEBUG filterTimes: Horas disponibles para ESTE día (" +
        selectedDateString +
        "):",
      hoursForThisDay
    );
    console.log(
      "DEBUG filterTimes: ¿La hora está en horas disponibles para este día?",
      hoursForThisDay.includes(timeString)
    );

    return hoursForThisDay.includes(timeString);
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
        key={keyForDatePicker}
        selected={fechaHora}
        onChange={(date: Date | null) => setFechaHora(date)}
        showTimeSelect
        timeFormat="HH:mm"
        // timeIntervals={30} // Puedes quitar esto; filterTimes ya filtra por horas exactas
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={new Date()}
        placeholderText="Selecciona fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        filterDate={filterDay}
        filterTime={filterTimes}
        // includeTimes={...} // No es necesario si filterTimes está haciendo el trabajo dinámico correctamente
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
