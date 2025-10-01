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

  const filterTimes = (time: Date) => {
    if (!fechaHora || !disponibilidadPorFechaDelServicio) {
      return false;
    }

    const selectedDateString = format(fechaHora, "yyyy-MM-dd");
    const hoursForThisDay =
      disponibilidadPorFechaDelServicio[selectedDateString];

    if (!hoursForThisDay || hoursForThisDay.length === 0) {
      return false;
    }

    // Convert the time to a string for comparison
    const timeString = format(time, "HH:mm");

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
        selected={fechaHora}
        onChange={(date: Date | null) => setFechaHora(date)}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={new Date()}
        placeholderText="SELECCIONA fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        filterDate={filterDay}
        filterTime={filterTimes}
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
