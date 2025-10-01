// src/components/ReservaForm.tsx
import { useState } from "react";
import { useCart, Reserva } from "../pages/CartContext"; // Necesitas importar Reserva

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ReservaFormProps {
  especialidad: string;
  servicio: string;
  terapeuta: string;
  precioInicial: number;
  slotsDisponibles?: { date: Date }[];
  onClose: () => void;
  // --- ¡NUEVA PROP AQUÍ! ---
  onConfirmReservation: (reserva: Reserva) => void; // Función para pasar la reserva al componente padre
}

export const ReservaForm = ({
  servicio,
  especialidad,
  terapeuta,
  precioInicial,
  slotsDisponibles,
  onClose,
  onConfirmReservation, // <-- Destructurar la nueva prop
}: ReservaFormProps) => {
  // Ya no necesitas addToCart aquí si el padre lo va a manejar
  // const { addToCart } = useCart(); // Podrías quitar esta línea si no se usa

  const [form, setForm] = useState({
    fechaHora: null as Date | null,
    nombreCliente: "",
    telefonoCliente: "",
  });

  const [precioFinal] = useState<number>(precioInicial);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getIncludeDates = () => {
    if (!slotsDisponibles) {
      return [];
    }
    const uniqueDates = new Set<string>();
    slotsDisponibles.forEach((slot) => {
      uniqueDates.add(slot.date.toISOString().split("T")[0]);
    });
    return Array.from(uniqueDates)
      .map((dateString) => new Date(dateString))
      .filter((date) => date.getTime() >= today.getTime());
  };

  const getIncludeTimesForSelectedDate = (date: Date): Date[] => {
    if (!slotsDisponibles || !date) {
      return [];
    }
    const selectedDateString = date.toISOString().split("T")[0];
    const availableTimes: Date[] = [];

    slotsDisponibles.forEach((slot) => {
      const slotDateString = slot.date.toISOString().split("T")[0];
      if (slotDateString === selectedDateString) {
        const slotTime = new Date(slot.date);
        if (selectedDateString === new Date().toISOString().split("T")[0]) {
          if (slotTime.getTime() > new Date().getTime()) {
            availableTimes.push(slotTime);
          }
        } else {
          availableTimes.push(slotTime);
        }
      }
    });
    return availableTimes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones del formulario
    if (!form.fechaHora) {
      alert("Por favor, selecciona la fecha y hora.");
      return;
    }
    if (!form.nombreCliente.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }
    if (!form.telefonoCliente.trim()) {
      alert("Por favor, ingresa tu número de teléfono.");
      return;
    }

    const fechaFormateada = form.fechaHora.toISOString().split("T")[0];
    const horaFormateada = form.fechaHora
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5);

    const reservaParaBackend: Reserva = {
      id: Date.now(),
      servicio: servicio,
      especialidad: especialidad,
      fecha: fechaFormateada,
      hora: horaFormateada,
      precio: precioFinal,
      terapeuta: terapeuta,
      nombreCliente: form.nombreCliente,
      telefonoCliente: form.telefonoCliente,
      sesiones: 1, // Asumo 1 sesión por defecto, ajusta si es variable
      cantidad: 1, // Asumo 1 cantidad por defecto
    };

    console.log(
      "Reserva preparada para ser enviada al padre:",
      reservaParaBackend
    );

    // --- ¡CAMBIO CLAVE AQUÍ! ---
    // En lugar de llamar a la API de Webpay, llamamos a la función
    // que nos pasó el componente padre con la reserva lista.
    onConfirmReservation(reservaParaBackend);
    onClose(); // Cierra el modal después de confirmar

    // Limpia el formulario si es necesario, aunque el modal se cierra
    setForm({
      fechaHora: null,
      nombreCliente: "",
      telefonoCliente: "",
    });

    // --- ELIMINADA TODA LA LÓGICA DE FETCH A WEBPAY Y REDIRECCIÓN ---
    // try {
    //   const response = await fetch("http://localhost:3000/api/webpay/", { ... });
    //   // ... (resto del código de Webpay) ...
    // } catch (error) {
    //   // ... (manejo de error) ...
    // }
  };

  const includedDates = getIncludeDates();

  return (
    <div className="reserva-fecha-container p-4 border rounded bg-white shadow-md max-w-xs mx-auto">
      <h3 className="text-xl font-bold mb-4">Confirmar Reserva</h3>
      <p className="mb-2">
        Servicio: <strong>{servicio}</strong>
      </p>
      <p className="mb-4">Precio: ${precioFinal.toLocaleString()} CLP</p>
      <DatePicker
        selected={form.fechaHora}
        onChange={(date: Date | null) =>
          setForm((prev) => ({ ...prev, fechaHora: date }))
        }
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={new Date()}
        placeholderText="SELECCIONA fecha y hora"
        className="border p-2 w-full mt-2 mb-4"
        includeDates={includedDates.length > 0 ? includedDates : undefined}
        includeTimes={
          form.fechaHora ? getIncludeTimesForSelectedDate(form.fechaHora) : []
        }
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
          name="nombreCliente"
          value={form.nombreCliente}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Ej: Juan Pérez"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="telefonoCliente"
          className="block text-sm font-medium text-gray-700"
        >
          Tu Número de Teléfono
        </label>
        <input
          type="tel"
          id="telefonoCliente"
          name="telefonoCliente"
          value={form.telefonoCliente}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Ej: +56912345678"
        />
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
      >
        Agregar al Carrito
      </button>{" "}
      {/* <-- Cambiado el texto del botón */}
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full mt-2"
      >
        Cancelar
      </button>
    </div>
  );
};

export default ReservaForm;
