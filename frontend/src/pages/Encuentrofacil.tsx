import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Se usa useLocation
import "../styles/encuentrofacil.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";
import TherapistProfile from "../components/TherapistProfile";
import ReservaConFecha from "../components/ReservaConFecha";
import TerapeutaPlaceholder from "../assets/terapeuta-placeholder.jpg";
import ServiceCard from "../components/ServiceCard";
import { Terapeuta } from "../types/index";

import "react-datepicker/dist/react-datepicker.css";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem,
  DisponibilidadTerapeuta,
  ReservaPendiente,
} from "../types/index";

// Importa los datos de los terapeutas y la interfaz Terapeuta
import { terapeutasData } from "../data/terapeutas-data";
import parsePhoneNumberFromString from "libphonenumber-js";
import ReservaConFechaAmigable from "../components/ReservaConFechaAmigable";

// --- FUNCIÓN SLUGIFY (MANTENIDA EN ESTA UBICACIÓN) ---
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
// ----------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function AgendaSanacion() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para leer la URL
  const { addToCart } = useCart();
  const [terapeutaSeleccionado, setTerapeutaSeleccionado] =
    useState<Terapeuta | null>(null);
  const [reservaPendiente, setReservaPendiente] =
    useState<ReservaPendiente | null>(null);
  const [showMeetEmailPrompt, setShowMeetEmailPrompt] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [disponibilidadesProcesadas, setDisponibilidadesProcesadas] = useState<
    Map<string, DisponibilidadTerapeuta>
  >(new Map());
  const handleOpenMeetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientEmail.includes("@")) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    const meetLink = terapeutaSeleccionado?.enlaceMeet;

    if (meetLink) {
      // 1. Aquí idealmente harías la llamada a tu API (ej. axios.post('/api/send-reminder', { email: clientEmail, terapeuta: terapeutaSeleccionado.nombre }))
      // Para este ejemplo, solo simulamos la acción.
      console.log(
        `Correo capturado: ${clientEmail}. Enviando recordatorio y abriendo Meet.`
      );

      // 2. Abrir la sala de reunión en una nueva pestaña
      window.open(meetLink, "_blank");

      // 3. Cerrar el modal
      setShowMeetEmailPrompt(false);
      setClientEmail(""); // Limpiar el estado
    }
  };

  // --- EFECTO 1: CARGAR Y PROCESAR DISPONIBILIDADES (MODIFICADO) ---
  useEffect(() => {
    const fetchAndProcessDisponibilidades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/disponibilidades`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData: RawDisponibilidadDBItem[] = await response.json();
        const aggregatedDisponibilidades = new Map<
          string,
          DisponibilidadTerapeuta
        >();

        rawData.forEach((row: RawDisponibilidadDBItem) => {
          const nombreDelTerapeuta = row.nombreTerapeuta;
          const terapeutaIdDelRow = row.terapeutaId;
          // 1. Obtenemos el string crudo de la DB
          const serviciosRaw = row.especialidad_servicio; 

          if (
            !nombreDelTerapeuta ||
            terapeutaIdDelRow === undefined ||
            terapeutaIdDelRow === null ||
            !serviciosRaw
          ) {
            console.warn(
              "Fila de disponibilidad incompleta para procesar. Ignorando.",
              row
            );
            return;
          }

          // 2. AQUÍ ESTÁ LA MAGIA: Dividimos por coma y limpiamos espacios
          const listaServicios = serviciosRaw.split(',').map(s => s.trim());

          // 3. Iteramos por cada servicio individual encontrado en esa celda
          listaServicios.forEach((servicioIndividual) => {

            // Aseguramos que el terapeuta exista en el mapa
            if (!aggregatedDisponibilidades.has(nombreDelTerapeuta)) {
              aggregatedDisponibilidades.set(nombreDelTerapeuta, {
                nombreTerapeuta: nombreDelTerapeuta,
                terapeutaId: terapeutaIdDelRow,
                disponibilidadPorServicio: {},
              });
            }

            const currentTerapeutaDisp = aggregatedDisponibilidades.get(nombreDelTerapeuta)!;

            // Usamos 'servicioIndividual' como clave en lugar del string completo
            if (!currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual]) {
              currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual] = {};
            }

            const dias = Array.isArray(row.diasDisponibles)
              ? row.diasDisponibles
              : [];
            const horas = Array.isArray(row.horasDisponibles)
              ? row.horasDisponibles
              : [];

            dias.forEach((dia: string) => {
              if (!currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual][dia]) {
                currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual][dia] = [];
              }
              horas.forEach((hora: string) => {
                if (!currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual][dia].includes(hora)) {
                  currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual][dia].push(hora);
                }
              });
              currentTerapeutaDisp.disponibilidadPorServicio[servicioIndividual][dia].sort();
            });

          }); // Fin del forEach de listaServicios
        });

        setDisponibilidadesProcesadas(aggregatedDisponibilidades);
      } catch (error) {
        console.error(
          "ERROR al cargar y procesar las disponibilidades:",
          error
        );
      }
    };
    fetchAndProcessDisponibilidades();
  }, []);
  // --- EFECTO 2: LEER LA URL Y CARGAR AL TERAPEUTA ---
  useEffect(() => {
    // Se asume que la ruta es /encuentrofacil/nombre-del-terapeuta
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // El slug del terapeuta es el último segmento si la URL contiene el prefijo "encuentrofacil"
    if (pathSegments.length >= 2 && pathSegments[0] === "encuentrofacil") {
      const slugTerapeuta = pathSegments[1];

      const terapeutaEncontrado = terapeutasData.find(
        (t) => slugify(t.nombre) === slugTerapeuta
      );

      // Actualizar el estado del terapeuta basado en la URL
      setTerapeutaSeleccionado(terapeutaEncontrado || null);

      if (!terapeutaEncontrado) {
        if (slugTerapeuta) {
          console.warn(
            `Terapeuta no encontrado para el slug: ${slugTerapeuta}`
          );
        }
      }
    } else if (
      pathSegments.length === 1 &&
      pathSegments[0] === "encuentrofacil"
    ) {
      // Estamos en la ruta base /encuentrofacil, mostramos la lista.
      setTerapeutaSeleccionado(null);
    }

    // Se ejecuta cada vez que la URL cambia
  }, [location.pathname]);

  // --- FUNCIÓN MODIFICADA: AL HACER CLIC EN EL PERFIL ---
  const handleSelectTerapeuta = (terapeuta: Terapeuta) => {
    const slug = slugify(terapeuta.nombre);
    // Navega a la URL amigable (esto activará el useEffect 2)
    navigate(`/encuentrofacil/${slug}`);
  };

  // --- FUNCIÓN MODIFICADA: AL VOLVER ---
  const handleBackNavigation = () => {
    if (terapeutaSeleccionado) {
      // Si estamos en /encuentrofacil/terapeuta, volvemos a /encuentrofacil
      navigate(`/encuentrofacil`);
    } else {
      // Si estamos en /encuentrofacil, volvemos al inicio de la web
      navigate("/");
    }
  };

  const getDisponibilidadForTerapeutaAndService = (
    terapeutaNombre: string,
    servicioNombre: string
  ): { [fecha: string]: string[] } | undefined => {
    const terapeutaDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    if (!terapeutaDisp) return undefined;

    // Buscamos la clave que coincida exactamente (ignorando mayúsculas/minúsculas)
    // ya que ahora en el mapa tenemos los servicios separados "Vortex Aura Healing", etc.
    const servicioKey = Object.keys(terapeutaDisp.disponibilidadPorServicio).find(
      (key) => key.toLowerCase() === servicioNombre.toLowerCase().trim()
    );

    return servicioKey ? terapeutaDisp.disponibilidadPorServicio[servicioKey] : undefined;
  };
  const reservar = (terapiaItem: TerapiaItem) => {
    const terapeuta = terapeutasData.find(
  (t) => t.nombre.trim().toLowerCase() === terapiaItem.terapeuta.trim().toLowerCase()
);
    if (!terapeuta) {
      console.error("Terapeuta no encontrado para la reserva.");
      return;
    }
    const precio = terapiaItem.precio;
    setReservaPendiente({
      terapia: terapiaItem.title,
      precio: precio,
      terapeutaNombre: terapeuta.nombre,
      terapeutaId: terapeuta.id,
    });
  };

  const confirmarReserva = async (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => {
    const year = fechaHora.getFullYear();
    const month = String(fechaHora.getMonth() + 1).padStart(2, "0");
    const day = String(fechaHora.getDate()).padStart(2, "0");
    const fechaFormateada = `${year}-${month}-${day}`;
    const horaFormateada = fechaHora
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5);

    if (!reservaPendiente) {
      alert("No hay reserva pendiente para confirmar.");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(telefonoCliente.trim());
    if (!phoneNumber || !phoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono válido con código de país (ej. +56912345678 o +34699111222)."
      );
      return;
    }

    const reservaDataToSend = {
      servicio: "EncuentroFácil",
      especialidad: reservaPendiente.terapia,
      fecha: fechaFormateada,
      hora: horaFormateada,
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      terapeuta: reservaPendiente.terapeutaNombre,
      terapeutaId: reservaPendiente.terapeutaId,
      sesiones: 1,
      cantidadCupos: 1,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reservar-directa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaDataToSend),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage =
          errorBody.mensaje ||
          `Error al confirmar la reserva: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json();
      addToCart(confirmedReservation);
      alert(
        `¡Reserva confirmada para ${confirmedReservation.especialidad} con ${confirmedReservation.terapeuta} el ${confirmedReservation.fecha} a las ${confirmedReservation.hora}! Lo hemos añadido a tu carrito para que puedas completar el pago.`
      );
      setReservaPendiente(null);
    } catch (error: any) {
      console.error("ERROR al confirmar la reserva:", error);
      alert(`No se pudo completar la reserva: ${error.message}`);
    }
  };

  const disponibilidadParaServicioSeleccionado = reservaPendiente
    ? getDisponibilidadForTerapeutaAndService(
        reservaPendiente.terapeutaNombre,
        reservaPendiente.terapia
      )
    : undefined;

  // Los servicios del terapeuta seleccionado se obtienen directamente de los datos importados
  const serviciosDelTerapeutaSeleccionado: TerapiaItem[] = terapeutaSeleccionado
    ? terapeutaSeleccionado.servicios
    : [];

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">EncuentroFácil</h1>
        <CartIcon />
      </header>

      <button
        onClick={handleBackNavigation} // <-- USAMOS LA FUNCIÓN DE NAVEGACIÓN
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {terapeutaSeleccionado ? "Volver a Terapeutas" : "Volver al Inicio"}
      </button>
      {/* LINK DIRECTO FLOTANTE */}
<Link
  to="/cuerpoconsciente"
  className="fixed top-20 left-48 z-10 bg-pink-600 text-white px-6 py-2 rounded-full font-bold shadow-1x1 hover:scale-90 transition-transform flex items-center gap-2"
>
  <span>Programas</span>
</Link>
      

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Agenda una sesión
      </h2>



{!terapeutaSeleccionado ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-16 mt-6 max-w-5xl mx-auto justify-items-center">
    {terapeutasData.map((t) => (
      <div
        key={t.id}
        className={`aura-container relative transition-all duration-500 rounded-2xl p-[0px] w-[350px] ${
          t.isElite 
            ? "aura-elite ring-4 ring-pink-500/80 scale-[1.00] sm:scale-[1.03]" 
            : t.isProfesional 
            ? "aura-profesional ring-4 ring-blue-500/40 scale-[1.00] sm:scale-[1.03] z-10" 
            : t.isBasic
            ? "aura-basic ring-4 ring-yellow-500/40 scale-[1.00] z-10"
            : "border border-gray-100 shadow-sm"
        }`}
      >
        <TherapistProfile
          terapeuta={t}
          onClick={handleSelectTerapeuta}
          callToActionText={t.callToActionTextCard}
        />
      </div>
    ))}
  </div>
) : (
        // Se muestra la vista del terapeuta seleccionado (¡ORDEN CORRECTO!)
        <div className="w-full">
          {/* 1. TÍTULO DE SERVICIOS */}
          <h3 className="text-2xl font-bold text-center text-pink-700 mb-6">
            Servicios de {terapeutaSeleccionado.nombre}
          </h3>
          {/* 2. LISTA DE SERVICIOS (Contenedor principal) */}
          <div className="flip-wrapper-container mt-10">
            {serviciosDelTerapeutaSeleccionado.map((servicio, i) => (
              <ServiceCard key={i} service={servicio} onReserve={reservar} />
            ))}
          </div>
          {/* 3. SECCIÓN DE RECURSOS Y ENLACE MEET (Aparece POR DEBAJO de los servicios) */}
          {terapeutaSeleccionado &&
            ((terapeutaSeleccionado.recursos &&
              terapeutaSeleccionado.recursos.length > 0) ||
              terapeutaSeleccionado.enlaceMeet) && (
              <div className="max-w-4xl mx-auto my-8 p-6 bg-purple-50 rounded-lg shadow-lg border border-purple-200">
                {" "}
                {/* RECURSOS LISTA DE BOTONES (Se mantiene igual) */}
               {" "}
                {terapeutaSeleccionado.recursos &&
                  terapeutaSeleccionado.recursos.length > 0 && (
                    <div className="mb-6 pb-4 border-b border-purple-300">
                     {" "}
                      <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                         📚 Recursos para la Sesión 
                       {" "}
                      </h3>
                     {" "}
                      <div className="space-y-3">
                        {" "}
                        {terapeutaSeleccionado.recursos.map(
                          (recurso, index) => (
                            <a
                              key={index}
                              href={recurso.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full text-center px-4 py-2 border border-purple-500 rounded-lg text-purple-700 bg-white hover:bg-purple-100 transition duration-300 ease-in-out font-semibold shadow-sm"
                            >
                               {recurso.name}
                              {" "}
                            </a>
                          )
                        )}
                       {" "}
                      </div>
                      {" "}
                    </div>
                  )}
                {" "}
                {/* ENLACE MEET MODIFICADO: AHORA ACTIVA EL PROMPT */}
                {" "}
                {terapeutaSeleccionado.enlaceMeet && (
                  <div className="mt-4">
                   {" "}
                    <h3 className="text-xl font-bold text-purple-800 mb-2 flex items-center">
                       💻 Enlace para la Sesión
                      Virtual{" "}
                    </h3>
                   {" "}
                    <p className="text-gray-700 mb-3">
                      
                      Tu sesión online se llevará a cabo a través de este link.
                     {" "}
                    </p>
                   {" "}
                    <button
                      // <-- CAMBIO: Llama a la función que abre el modal
                      onClick={() => setShowMeetEmailPrompt(true)}
                      className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-md"
                    >
                      {" "}
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.55 4.55M15 10l-4.55 4.55M15 10l-.95-.95M15 10l.95.95M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                       Abrir Sala de Reunión (Meet) 
                     {" "}
                    </button>
                   {" "}
                    <p className="text-sm text-gray-500 mt-2">
                      {/* Revisa tu correo de
                      confirmación, te enviaremos este enlace y la hora de tu
                      cita.{" "} */}
                    </p>
                    {" "}
                  </div>
                )}
                {" "}
              </div>
            )}
         {" "}
        </div>
      )}
      {/* MODAL PARA SOLICITAR GMAIL/CORREO */}
      {showMeetEmailPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full relative">
            <button
              onClick={() => setShowMeetEmailPrompt(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h4 className="text-lg font-bold text-purple-700 mb-4">
              Recordatorio de Reunión 📧
            </h4>
            <p className="text-gray-700 mb-4 text-sm">
              Para enviarte un recordatorio instantáneo y el enlace a tu Gmail,
              por favor ingresa tu correo:
            </p>

            <form onSubmit={handleOpenMeetLink}>
              <input
                type="email"
                placeholder="tu.correo@gmail.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md"
              >
                Confirmar Asistencia & Enviar Recordatorio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EL MODAL DE RESERVA PENDIENTE VIENE DESPUÉS DE ESTO */}
      {reservaPendiente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setReservaPendiente(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
            >
              X
            </button>
            <ReservaConFechaAmigable
              terapia={reservaPendiente.terapia}
              precio={reservaPendiente.precio}
              onConfirm={confirmarReserva}
              onClose={() => setReservaPendiente(null)}
              disponibilidadPorFechaDelServicio={
                disponibilidadParaServicioSeleccionado
              }
            />
          </div>
        </div>
      )}
      
    </div>
  );
}
