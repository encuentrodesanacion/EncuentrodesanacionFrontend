import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- INTERFACES NECESARIAS (Asegúrate de que estén aquí o accesibles) ---
interface DisponibilidadTerapeuta {
  nombreTerapeuta: string;
  diasDisponibles: number[]; // 0=Domingo, 1=Lunes, etc.
  horasDisponibles: string[]; // Ej. ["10:00", "11:00", "12:00"]
}
// --- FIN INTERFACES ---

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
  allowedDates?: string[]; // Array de strings "YYYY-MM-DD"
}

export default function ReservaConFecha({
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

    // --- NUEVA VALIDACIÓN: Asegurar que la hora seleccionada no sea 00:00 (a menos que esté permitida explícitamente) ---
    const selectedHour = fechaHora.getHours();
    const selectedMinute = fechaHora.getMinutes();
    const selectedTimeString = `${String(selectedHour).padStart(
      2,
      "0"
    )}:${String(selectedMinute).padStart(2, "0")}`;

    // Si la hora es 00:00 y no está explícitamente en las horas disponibles, pedir al usuario que seleccione
    if (
      selectedTimeString === "00:00" &&
      disponibilidadTerapeuta &&
      !disponibilidadTerapeuta.horasDisponibles.includes("00:00")
    ) {
      alert("Por favor, selecciona una hora válida para tu reserva.");
      return;
    }
    // --- FIN NUEVA VALIDACIÓN ---

    onConfirm(fechaHora, nombre, telefono);
  };

  // Funciones para filtrar días y horas en el DatePicker
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

    if (disponibilidadTerapeuta && disponibilidadTerapeuta.diasDisponibles) {
      return disponibilidadTerapeuta.diasDisponibles.includes(date.getDay());
    }
    return true;
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
        filterDate={filterDay}
        filterTime={filterTimes}
        // --- OPCIONAL: Para establecer una hora por defecto más intuitiva si no hay selección ---
        // Si no se selecciona una hora, esta será la primera hora disponible o una hora por defecto.
        // Esto puede mejorar la UX pero no reemplaza la validación.
        // showTimeSelectOnly={false} // Mostrar selector de fecha y hora
        // timeCaption="Hora"
        // minTime={new Date().setHours(9, 0)} // Ejemplo: Hora mínima visible 09:00
        // maxTime={new Date().setHours(21, 0)} // Ejemplo: Hora máxima visible 21:00
        // selected (ya está, es el valor controlado)
        // default selecta almenos una hora al abrir el datepicker si no hay una selecionada
        // showTimeSelect={true}
        // showTimeSelectOnly={false}
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
