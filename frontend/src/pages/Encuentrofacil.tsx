import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";
import TherapistProfile from "../components/TherapistProfile";
import ReservaConFecha from "../components/ReservaConFecha";
import TerapeutaPlaceholder from "../assets/terapeuta-placeholder.jpg";
import ServiceCard from "../components/ServiceCard";

import "react-datepicker/dist/react-datepicker.css";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem,
  DisponibilidadTerapeuta,
  ReservaPendiente,
} from "../types/index";

// Importa los datos de los terapeutas y la interfaz Terapeuta
import { Terapeuta, terapeutasData } from "../data/terapeutas-data";
import parsePhoneNumberFromString from "libphonenumber-js";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function AgendaSanacion() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [terapeutaSeleccionado, setTerapeutaSeleccionado] =
    useState<Terapeuta | null>(null);
  const [reservaPendiente, setReservaPendiente] =
    useState<ReservaPendiente | null>(null);
  const [disponibilidadesProcesadas, setDisponibilidadesProcesadas] = useState<
    Map<string, DisponibilidadTerapeuta>
  >(new Map());

  // --- EFECTO 1: CARGAR Y PROCESAR DISPONIBILIDADES (Esta parte sigue necesitando la API) ---
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
          const servicioDelRow = row.especialidad_servicio;

          if (
            !nombreDelTerapeuta ||
            terapeutaIdDelRow === undefined ||
            terapeutaIdDelRow === null ||
            !servicioDelRow
          ) {
            console.warn(
              "Fila de disponibilidad incompleta para procesar. Ignorando.",
              row
            );
            return;
          }

          if (!aggregatedDisponibilidades.has(nombreDelTerapeuta)) {
            aggregatedDisponibilidades.set(nombreDelTerapeuta, {
              nombreTerapeuta: nombreDelTerapeuta,
              terapeutaId: terapeutaIdDelRow,
              disponibilidadPorServicio: {},
            });
          }

          const currentTerapeutaDisp =
            aggregatedDisponibilidades.get(nombreDelTerapeuta)!;

          if (!currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow]) {
            currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow] = {};
          }
          const dias = Array.isArray(row.diasDisponibles)
            ? row.diasDisponibles
            : [];
          const horas = Array.isArray(row.horasDisponibles)
            ? row.horasDisponibles
            : [];

          dias.forEach((dia: string) => {
            if (
              !currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow][
                dia
              ]
            ) {
              currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow][
                dia
              ] = [];
            }
            horas.forEach((hora: string) => {
              if (
                !currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow][
                  dia
                ].includes(hora)
              ) {
                currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow][
                  dia
                ].push(hora);
              }
            });
            currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow][
              dia
            ].sort();
          });
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

  const getDisponibilidadForTerapeutaAndService = (
    terapeutaNombre: string,
    servicioNombre: string
  ): { [fecha: string]: string[] } | undefined => {
    const terapeutaDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    if (!terapeutaDisp) {
      return undefined;
    }
    return terapeutaDisp.disponibilidadPorServicio[servicioNombre];
  };

  const reservar = (terapiaItem: TerapiaItem) => {
    const terapeuta = terapeutasData.find(
      (t) => t.nombre === terapiaItem.terapeuta
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
      servicio: "Agenda de Sanación",
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
        <h1 className="text-xl font-semibold text-gray-800">
          Agenda de Sanación
        </h1>
        <CartIcon />
      </header>

      <button
        onClick={() => {
          if (terapeutaSeleccionado) {
            setTerapeutaSeleccionado(null);
          } else {
            navigate("/");
          }
        }}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {terapeutaSeleccionado ? "Volver a Terapeutas" : "Volver al Inicio"}
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Agenda una sesión
      </h2>

      {!terapeutaSeleccionado ? (
        // Se muestra la lista de terapeutas desde el archivo de datos
        <div className="flip-wrapper-container mt-10">
          {terapeutasData.map((t) => (
            <TherapistProfile
              key={t.id}
              terapeuta={t}
              onClick={setTerapeutaSeleccionado}
            />
          ))}
        </div>
      ) : (
        // Se muestra la lista de servicios del terapeuta seleccionado
        <div className="flip-wrapper-container mt-10">
          <h3 className="text-2xl font-bold text-center text-pink-700 mb-6">
            Servicios de {terapeutaSeleccionado.nombre}
          </h3>
          {serviciosDelTerapeutaSeleccionado.map((servicio, i) => (
            <ServiceCard key={i} service={servicio} onReserve={reservar} />
          ))}
        </div>
      )}

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
