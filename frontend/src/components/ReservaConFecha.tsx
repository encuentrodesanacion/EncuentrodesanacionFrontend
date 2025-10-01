import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Use the correct import for the timezone functions
import { toZonedTime, fromZonedTime, format } from "date-fns-tz";
import { format as formatFns } from "date-fns";

interface ReservaConFechaProps {
  terapia: string;
  precio: number;
  onConfirm: (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => void;
  onClose: () => void;
  disponibilidadPorFechaDelServicio?: { [fecha: string]: string[] };
}

// Define a fixed time zone for Chile
const CHILE_TIME_ZONE = "America/Santiago";

export default function ReservaConFecha({
  terapia,
  precio,
  onConfirm,
  onClose,
  disponibilidadPorFechaDelServicio,
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

      const selectedDateStringForTime = fechaHora
        ? format(fechaHora, "yyyy-MM-dd")
        : null;
      const hoursForSelectedDay = selectedDateStringForTime
        ? disponibilidadPorFechaDelServicio?.[selectedDateStringForTime] || []
        : [];

      let minTimeForPicker = undefined;
      let maxTimeForPicker = undefined;

      if (fechaHora && hoursForSelectedDay.length > 0) {
        // Asegura que las horas estén ordenadas de la más pequeña a la más grande
        hoursForSelectedDay.sort();

        // Convertir la primera hora disponible (ej. "16:00") a un objeto Date para minTime
        const firstHour = hoursForSelectedDay[0];
        const [minHour, minMinute] = firstHour.split(":").map(Number);
        minTimeForPicker = new Date(
          fechaHora.setHours(minHour, minMinute, 0, 0)
        );

        // Convertir la última hora disponible (ej. "17:00") a un objeto Date para maxTime
        const lastHour = hoursForSelectedDay[hoursForSelectedDay.length - 1];
        const [maxHour, maxMinute] = lastHour.split(":").map(Number);
        maxTimeForPicker = new Date(
          fechaHora.setHours(maxHour, maxMinute, 0, 0)
        );

        // Si solo hay una hora, minTime y maxTime son iguales.
      }

      return;
    }

    // Convert the selected time to Chile's time zone for validation
    const zonedDate = toZonedTime(fechaHora, CHILE_TIME_ZONE);
    const selectedTimeString = format(zonedDate, "HH:mm");
    const selectedDateString = format(zonedDate, "yyyy-MM-dd");

    const hoursForSelectedDay =
      disponibilidadPorFechaDelServicio?.[selectedDateString] || [];

    if (!hoursForSelectedDay.includes(selectedTimeString)) {
      alert("La hora seleccionada no está disponible.");
      return;
    }

    // Pass the date in the selected time zone to the `onConfirm` function
    onConfirm(fechaHora, nombre, telefono);
  };

  const filterDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return false;
    }

    if (disponibilidadPorFechaDelServicio) {
      const dateString = format(date, "yyyy-MM-dd");
      const hasHoursForThisDay =
        disponibilidadPorFechaDelServicio[dateString] &&
        disponibilidadPorFechaDelServicio[dateString].length > 0;
      return hasHoursForThisDay;
    }
    return false;
  };

  const selectedDateStringForTime = fechaHora
    ? format(fechaHora, "yyyy-MM-dd")
    : null;
  const hoursForSelectedDay = selectedDateStringForTime
    ? disponibilidadPorFechaDelServicio?.[selectedDateStringForTime] || []
    : [];

  let minTimeForPicker = undefined;
  let maxTimeForPicker = undefined;

  if (fechaHora && hoursForSelectedDay.length > 0) {
    // 1. Clonar la fecha seleccionada para evitar efectos secundarios en el estado
    const baseDate = new Date(fechaHora);

    // 2. Asegurar que las horas estén ordenadas
    hoursForSelectedDay.sort();

    // 3. CALCULAR MIN TIME
    const firstHour = hoursForSelectedDay[0]; // Ej: "16:00"
    const [minHour, minMinute] = firstHour.split(":").map(Number);
    // Usamos toZonedTime para que la hora refleje la zona horaria correcta antes de pasarla al picker
    minTimeForPicker = toZonedTime(baseDate, CHILE_TIME_ZONE);
    minTimeForPicker.setHours(minHour, minMinute, 0, 0);

    // 4. CALCULAR MAX TIME
    const lastHour = hoursForSelectedDay[hoursForSelectedDay.length - 1]; // Ej: "17:00"
    const [maxHour, maxMinute] = lastHour.split(":").map(Number);
    maxTimeForPicker = toZonedTime(baseDate, CHILE_TIME_ZONE);
    maxTimeForPicker.setHours(maxHour, maxMinute, 0, 0);

    // Si tu servicio tiene duraciones exactas (ej. 60 minutos), el MAX TIME debe ser la HORA DE INICIO del último turno.
    // Si la última reserva es a las 20:00, no queremos que el picker muestre 20:15, etc.
  }

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
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={new Date()}
        placeholderText="SELECCIONA fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        filterDate={filterDay}
        minTime={minTimeForPicker}
        maxTime={maxTimeForPicker}
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
