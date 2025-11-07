import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Importaciones de fecha existentes
import { toZonedTime, format } from "date-fns-tz";
import { format as formatFns, parse } from "date-fns";

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

// Define la zona horaria fija para Chile
const CHILE_TIME_ZONE = "America/Santiago";

export default function ReservaConFechaAmigable({
  terapia,
  precio,
  onConfirm,
  onClose,
  disponibilidadPorFechaDelServicio,
}: ReservaConFechaProps) {
  // Estado para la fecha y hora final (como en el componente original)
  const [fechaHora, setFechaHora] = useState<Date | null>(null); // Nuevo estado para la fecha (día) seleccionada
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Nuevo estado para la hora seleccionada
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>(""); // Lógica de confirmación (MANTENIDA IDÉNTICA)

  const handleConfirm = () => {
    if (!fechaHora) {
      alert("Por favor, selecciona fecha y hora.");
      return;
    }
    if (!nombre.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    } // La validación de teléfono se basa en la lógica que tienes en SpaPrincipal.tsx // (que usa libphonenumber-js, que no está disponible aquí, pero mantendremos la regex del original por ahora)
    const phoneRegex = /^\+?\d[\d\s-]{7,15}\d$/;
    if (!phoneRegex.test(telefono.trim())) {
      alert(
        "Por favor, ingresa un número de teléfono válido (ej. +XX YYYYYYYYY)."
      );
      return;
    } // Convertir la hora seleccionada a la zona horaria de Chile para la validación

    const zonedDate = toZonedTime(fechaHora, CHILE_TIME_ZONE);
    const selectedTimeString = format(zonedDate, "HH:mm");
    const selectedDateString = format(zonedDate, "yyyy-MM-dd");

    const hoursForSelectedDay =
      disponibilidadPorFechaDelServicio?.[selectedDateString] || [];

    if (!hoursForSelectedDay.includes(selectedTimeString)) {
      alert("La hora seleccionada no está disponible.");
      return;
    } // Pasa la fecha en el estado original (la Date object)

    onConfirm(fechaHora, nombre, telefono);
  }; // Función para filtrar días (MANTENIDA IDÉNTICA)

  const filterDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // No permitir seleccionar días pasados

    if (date < today) {
      return false;
    }

    if (disponibilidadPorFechaDelServicio) {
      const dateString = formatFns(date, "yyyy-MM-dd"); // Usar formatFns para evitar confusión con el format de date-fns-tz
      const hasHoursForThisDay =
        disponibilidadPorFechaDelServicio[dateString] &&
        disponibilidadPorFechaDelServicio[dateString].length > 0;
      return hasHoursForThisDay;
    }
    return false;
  }; // Función para manejar la selección del día en el DatePicker

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // Guarda solo el día
    setSelectedTime(""); // Limpia la hora seleccionada al cambiar de día
    setFechaHora(null); // Limpia la fecha y hora final
  }; // Función para manejar la selección de la hora en el <select>

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = e.target.value;
    setSelectedTime(time);

    if (selectedDate && time) {
      // Combina la fecha seleccionada con la hora elegida
      // Nota: El DatePicker retorna una Date con la hora 00:00 en la zona local.
      // Aquí creamos una nueva Date que combina esa fecha con la hora (HH:mm)
      // La forma más segura es reconstruir una Date en la zona horaria local (del cliente, que es lo que espera DatePicker)
      const dateString = formatFns(selectedDate, "yyyy-MM-dd"); // Creamos una Date a partir de la fecha (yyyy-MM-dd) y la hora (HH:mm) en el Huso Horario del CLIENTE. // Es crucial que 'fechaHora' sea una Date local para que luego 'onConfirm' // la procese y la convierta correctamente a Chile/Santiago.

      const dateWithTime = parse(
        `${dateString} ${time}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      ); // Verificación de la zona horaria: // El componente original enviaba una Date de la zona horaria del cliente. // Al hacer parse, esta dateWithTime es una Date en la zona horaria del cliente. // El componente padre (SpaPrincipal) y la lógica de confirmación se encargarán de // convertirla a 'yyyy-MM-dd' y 'HH:mm' en la zona de CHILE.

      setFechaHora(dateWithTime);
    } else {
      setFechaHora(null);
    }
  }; // Obtener las horas disponibles para el día seleccionado (memoizado)

  const getAvailableHours = useMemo(() => {
    if (!selectedDate || !disponibilidadPorFechaDelServicio) {
      return [];
    }
    const dateString = formatFns(selectedDate, "yyyy-MM-dd");
    let hours = disponibilidadPorFechaDelServicio[dateString]; // Si no hay horas disponibles en el array, retornar vacío inmediatamente

    if (!hours || !Array.isArray(hours) || hours.length === 0) {
      return [];
    }

    // --- 💡 CORRECCIÓN CLAVE: FILTRADO POR HORA ACTUAL ---

    const zonedNow = toZonedTime(new Date(), CHILE_TIME_ZONE);
    const todayDateString = formatFns(zonedNow, "yyyy-MM-dd");

    // 2. Comprobar si la fecha seleccionada es HOY en Chile
    if (dateString === todayDateString) {
      // 3. Filtrar las horas
      hours = hours.filter((hour) => {
        // A. Crear un objeto Date para la hora que se está verificando.
        const dateWithTimeLocal = parse(
          `${dateString} ${hour}`,
          "yyyy-MM-dd HH:mm",
          new Date()
        );

        // B. Convertir la fecha y hora seleccionada a la zona horaria de Chile para la comparación
        const zonedTimeToCheck = toZonedTime(
          dateWithTimeLocal,
          CHILE_TIME_ZONE
        );

        // C. Retorna TRUE solo si la hora de la cita es posterior O IGUAL al momento actual (zonedNow)
        // Usamos zonedTimeToCheck.getTime() > zonedNow.getTime() para que la hora desaparezca
        // inmediatamente después de que el minuto actual haya pasado.
        return zonedTimeToCheck.getTime() > zonedNow.getTime();
      });
    }

    // --- FIN LÓGICA DE FILTRADO ---

    return hours;
  }, [selectedDate, disponibilidadPorFechaDelServicio]);

  return (
    // Reducir el padding general del modal de p-6 a p-4
    <div className="reserva-con-fecha-modal p-4 rounded-lg shadow-2xl bg-white text-gray-800">
      {/* Reducir margen inferior de mb-4 a mb-2 */}
      <h3 className="text-xl font-bold mb-2 text-center text-pink-700">
        Agendar Hora: {terapia}
      </h3>

      {/* Reducir margen inferior de mb-4 a mb-3 */}
      <p className="text-md mb-3 text-center">
        Precio: ${precio.toLocaleString()} CLP
      </p>

      {/* --- SELECCIÓN DE FECHA --- */}
      <div className="mb-3">
        {" "}
        {/* Reducir margen inferior de mb-4 a mb-3 */}
        <label htmlFor="selectDate" className="block text-sm font-bold mb-1">
          {" "}
          {/* Reducir margen inferior de mb-2 a mb-1 */}
          1. Selecciona el Día Disponible:
        </label>
        <DatePicker
          id="selectDate"
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          placeholderText="Día..."
          // Reducir el padding de p-2 a p-1.5 (usando clases de padding más pequeñas si existen o ajustando p-2)
          className="border p-2 w-full mt-1 mb-2 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
          filterDate={filterDay}
          showPopperArrow={false}
        />
      </div>

      {/* --- SELECCIÓN DE HORA --- */}
      <div className="mb-3">
        {" "}
        {/* Reducir margen inferior de mb-4 a mb-3 */}
        <label htmlFor="selectTime" className="block text-sm font-bold mb-1">
          {" "}
          {/* Reducir margen inferior de mb-2 a mb-1 */}
          2. Selecciona la Hora:
        </label>
        <select
          id="selectTime"
          value={selectedTime}
          onChange={handleTimeChange}
          disabled={!selectedDate || getAvailableHours.length === 0}
          required={selectedDate !== null}
          // Reducir padding de py-2 a py-1
          className={`mt-1 block w-full px-3 py-1 border rounded-md shadow-sm text-sm ${
            !selectedDate || getAvailableHours.length === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-700 focus:ring-pink-500 focus:border-pink-500"
          }`}
        >
          <option value="" disabled>
            {selectedDate
              ? `Elige una hora (Total: ${getAvailableHours.length})`
              : "Selecciona un día primero"}
          </option>
          {getAvailableHours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        {!selectedDate && (
          <p className="text-xs text-red-500 mt-1">
            * Debes seleccionar un día para ver las horas disponibles.
          </p>
        )}
      </div>

      {/* --- CAMPOS DE CLIENTE --- */}
      <div className="mb-3">
        {" "}
        {/* Reducir margen inferior de mb-4 a mb-3 */}
        <label htmlFor="nombreCliente" className="block text-sm font-bold mb-1">
          {" "}
          {/* Reducir margen inferior de mb-2 a mb-1 */}
          3. Tu Nombre Completo:
        </label>
        <input
          type="text"
          id="nombreCliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          // Reducir padding de py-2 a py-1
          className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div className="mb-4">
        {" "}
        {/* Reducir margen inferior de mb-6 a mb-4 */}
        <label
          htmlFor="telefonoCliente"
          className="block text-sm font-bold mb-1" // Reducir margen inferior de mb-2 a mb-1
        >
          4. Tu Número de Teléfono
        </label>
        <input
          type="tel"
          id="telefonoCliente"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          // Reducir padding de py-2 a py-1
          className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
          placeholder="Ej: +56912345678"
        />
      </div>

      {/* --- BOTONES --- */}
      <button
        onClick={handleConfirm}
        disabled={!fechaHora}
        // Reducir padding de py-2 a py-1.5 (ajustando a py-2 y reduciendo texto si es necesario, pero mantengo py-2 por estética)
        className={`px-4 py-2 text-white rounded w-full ${
          !fechaHora
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        } transition-colors duration-300`}
      >
        Agregar al Carrito
      </button>

      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full mt-2 transition-colors duration-300"
      >
        Cancelar
      </button>
    </div>
  );
}
