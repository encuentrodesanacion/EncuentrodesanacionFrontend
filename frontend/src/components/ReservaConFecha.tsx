import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { DisponibilidadTerapeuta } from "../types/index";

interface ReservaConFechaProps {
  terapia: string;
  precio: number;
  onConfirm: (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => void;
  onClose: () => void;
  disponibilidadTerapeuta?: DisponibilidadTerapeuta;
  allowedDates?: string[];
}

export default function ReservaConFecha({
  terapia,
  precio,
  onConfirm,
  onClose,
  disponibilidadTerapeuta,
  allowedDates,
}: ReservaConFechaProps) {
  const [fechaHora, setFechaHora] = useState<Date | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  // Nueva función para generar las horas a incluir en el DatePicker
  const getIncludeTimesForSelectedDate = (): Date[] => {
    if (
      !fechaHora ||
      !disponibilidadTerapeuta ||
      !disponibilidadTerapeuta.disponibilidadPorFecha
    ) {
      return [];
    }

    const selectedDateString = fechaHora.toISOString().split("T")[0];
    const hoursForThisDay =
      disponibilidadTerapeuta.disponibilidadPorFecha[selectedDateString] || [];

    return hoursForThisDay.map((hourString) => {
      const [hours, minutes] = hourString.split(":").map(Number);
      const dateWithTime = new Date(fechaHora);
      dateWithTime.setHours(hours, minutes, 0, 0);
      return dateWithTime;
    });
  };

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

    const selectedHour = fechaHora.getHours();
    const selectedMinute = fechaHora.getMinutes();
    const selectedTimeString = `${String(selectedHour).padStart(
      2,
      "0"
    )}:${String(selectedMinute).padStart(2, "0")}`;

    const selectedDateString = fechaHora.toISOString().split("T")[0];
    const hoursForSelectedDay =
      disponibilidadTerapeuta?.disponibilidadPorFecha[selectedDateString] || [];

    // Validar que la hora seleccionada sea una de las disponibles para ese día
    if (!hoursForSelectedDay.includes(selectedTimeString)) {
      alert(
        "La hora seleccionada no está disponible para este día. Por favor, elige otra hora."
      );
      return;
    }

    onConfirm(fechaHora, nombre, telefono);
  };

  const filterDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return false;
    }

    if (allowedDates && allowedDates.length > 0) {
      const dateString = date.toISOString().split("T")[0];
      return allowedDates.includes(dateString);
    }

    if (
      disponibilidadTerapeuta &&
      disponibilidadTerapeuta.disponibilidadPorFecha
    ) {
      const dateString = date.toISOString().split("T")[0];

      // Verifica si existe la entrada para esta fecha Y si tiene horas
      const hasHoursForThisDay =
        disponibilidadTerapeuta.disponibilidadPorFecha[dateString] &&
        disponibilidadTerapeuta.disponibilidadPorFecha[dateString].length > 0;

      // console.log(
      //   "DEBUG filterDay: Fecha DatePicker (YYYY-MM-DD):",
      //   dateString
      // );
      // console.log(
      //   "DEBUG filterDay: DisponibilidadPorFecha del terapeuta:",
      //   disponibilidadTerapeuta.disponibilidadPorFecha
      // );
      // console.log(
      //   "DEBUG filterDay: ¿Tiene horas para esta fecha?",
      //   hasHoursForThisDay
      // );

      return hasHoursForThisDay;
    }

    return false;
  };

  const filterTimes = (time: Date) => {
    if (
      !fechaHora || // No hay fecha seleccionada aún
      !disponibilidadTerapeuta || // No hay objeto de disponibilidad
      !disponibilidadTerapeuta.disponibilidadPorFecha // No hay el mapa de fechas
    ) {
      // console.log(
      //   "DEBUG filterTimes: Fecha seleccionada o data de disponibilidad por fecha no definida."
      // );
      return false;
    }

    const selectedDateString = fechaHora.toISOString().split("T")[0];
    // Accede a las horas específicas para la fecha seleccionada.
    // Usa el operador de encadenamiento opcional `?` y un fallback a array vacío `[]`
    const hoursForThisDay =
      disponibilidadTerapeuta.disponibilidadPorFecha[selectedDateString] || [];

    if (hoursForThisDay.length === 0) {
      // console.log(
      //   "DEBUG filterTimes: No hay horas disponibles para el día:",
      //   selectedDateString
      // );
      return false;
    }

    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();
    const timeString = `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;

    // console.log("DEBUG filterTimes: Hora DatePicker (HH:MM):", timeString);
    // console.log(
    //   "DEBUG filterTimes: Horas disponibles para ESTE día (" +
    //     selectedDateString +
    //     "):",
    //   hoursForThisDay
    // );
    // console.log(
    //   "DEBUG filterTimes: ¿La hora está en horas disponibles para este día?",
    //   hoursForThisDay.includes(timeString)
    // );

    // Finalmente, verifica si la hora del DatePicker está en la lista de horas disponibles para ese día
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
        placeholderText="Selecciona fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        filterDate={filterDay}
        filterTime={filterTimes}
        includeTimes={getIncludeTimesForSelectedDate()}
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
