// frontend/src/pages/SpaLittle.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes - Asegúrate de que los nombres de archivo coincidan EXACTAMENTE
import Terapeuta30 from "../assets/Terapeuta30.jpeg";

import clau from "../assets/clau.jpeg";
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import luisa from "../assets/luisa.png";
import Terapeuta14 from "../assets/Terapeuta14.jpeg";
import belen from "../assets/belen.jpg";
import creadorVirtual from "../assets/creadorvirtual.jpg";
import Terapeuta25 from "../assets/Terapeuta25.jpeg";
import Terapeuta24 from "../assets/Terapeuta24.jpeg";
import Terapeuta28 from "../assets/Terapeuta28.jpeg";
import DatePicker from "react-datepicker";
import Terapeuta23 from "../assets/Terapeuta23.jpeg";
import "react-datepicker/dist/react-datepicker.css";
import ReservaConFecha from "../components/ReservaConFecha";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem, // Para los datos crudos del backend
  DisponibilidadTerapeuta, // Para los datos procesados y agregados
  ReservaPendiente,
} from "../types/index";
import parsePhoneNumberFromString from "libphonenumber-js";
import ReservaConFechaAmigable from "../components/ReservaConFechaAmigable";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function SpaLittle() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [reservaPendiente, setReservaPendiente] =
    useState<ReservaPendiente | null>(null);
  const [disponibilidadesProcesadas, setDisponibilidadesProcesadas] = useState<
    Map<string, DisponibilidadTerapeuta> // Usamos un Map para almacenar por nombreTerapeuta
  >(new Map());

  // --- EFECTO PARA CARGAR Y PROCESAR LAS DISPONIBILIDADES AL MONTAR EL COMPONENTE ---
  useEffect(() => {
    const fetchAndProcessDisponibilidades = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
        const response = await fetch(
          `${apiBaseUrl}/disponibilidades` // URL corregida
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData: RawDisponibilidadDBItem[] = await response.json();
        console.log(
          "DEBUG SpaLittle: Datos crudos de disponibilidades desde el backend (RawData):",
          rawData
        );

        const aggregatedDisponibilidades = new Map<
          string,
          DisponibilidadTerapeuta
        >();

        rawData.forEach((row: RawDisponibilidadDBItem) => {
          const nombreDelTerapeuta = row.nombreTerapeuta;
          const terapeutaIdDelRow = row.terapeutaId;
          const especialidadDelRow = row.especialidad_servicio; // Nuevo: obtenemos el nombre del servicio/especialidad

          if (
            !nombreDelTerapeuta ||
            terapeutaIdDelRow === undefined ||
            terapeutaIdDelRow === null ||
            !especialidadDelRow // Nuevo: validamos la especialidad
          ) {
            // Valida también el ID
            console.warn(
              `DEBUG SpaLittle: Fila de disponibilidad sin nombre, ID de terapeuta, o especialidad (${terapeutaIdDelRow}). Será ignorada.`,
              row
            );
            return;
          }

          if (!aggregatedDisponibilidades.has(nombreDelTerapeuta)) {
            aggregatedDisponibilidades.set(nombreDelTerapeuta, {
              nombreTerapeuta: nombreDelTerapeuta,
              terapeutaId: terapeutaIdDelRow, // Asigna el ID correcto aquí
              disponibilidadPorServicio: {}, // Corregido a la nueva propiedad
            });
          } else {
            // Si el terapeuta ya existe en el mapa, asegúrate que el ID se asignó
            const existingTerapeuta =
              aggregatedDisponibilidades.get(nombreDelTerapeuta)!;
            if (
              existingTerapeuta.terapeutaId === undefined ||
              existingTerapeuta.terapeutaId === null
            ) {
              existingTerapeuta.terapeutaId = terapeutaIdDelRow;
            }
          }

          const currentTerapeutaDisp =
            aggregatedDisponibilidades.get(nombreDelTerapeuta)!;

          // Nuevo: Asegúrate de que la disponibilidad para el servicio exista
          if (
            !currentTerapeutaDisp.disponibilidadPorServicio[especialidadDelRow]
          ) {
            currentTerapeutaDisp.disponibilidadPorServicio[especialidadDelRow] =
              {};
          }

          const dias = Array.isArray(row.diasDisponibles)
            ? row.diasDisponibles
            : [];
          const horas = Array.isArray(row.horasDisponibles)
            ? row.horasDisponibles
            : [];

          if (dias.length === 0 || horas.length === 0) {
            console.warn(
              `DEBUG SpaLittle: Fila de disponibilidad para ${nombreDelTerapeuta} en ${
                dias[0] || "N/A"
              } tiene días u horas vacías (después de getters).`,
              row
            );
            return;
          }

          dias.forEach((dia: string) => {
            // Nuevo: Accede a la disponibilidad a través de la especialidad
            if (
              !currentTerapeutaDisp.disponibilidadPorServicio[
                especialidadDelRow
              ][dia]
            ) {
              currentTerapeutaDisp.disponibilidadPorServicio[
                especialidadDelRow
              ][dia] = [];
            }
            horas.forEach((hora: string) => {
              // Nuevo: Accede a la disponibilidad a través de la especialidad
              if (
                !currentTerapeutaDisp.disponibilidadPorServicio[
                  especialidadDelRow
                ][dia].includes(hora)
              ) {
                currentTerapeutaDisp.disponibilidadPorServicio[
                  especialidadDelRow
                ][dia].push(hora);
              }
            });
            currentTerapeutaDisp.disponibilidadPorServicio[especialidadDelRow][
              dia
            ].sort();
          });
        });
        setDisponibilidadesProcesadas(aggregatedDisponibilidades);
        console.log(
          "DEBUG SpaLittle: Disponibilidades procesadas y agregadas (Map final):",
          aggregatedDisponibilidades
        );
      } catch (error) {
        console.error(
          "ERROR SpaLittle: Error al cargar y procesar las disponibilidades:",
          error
        );
      }
    };

    fetchAndProcessDisponibilidades();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para obtener la disponibilidad de un terapeuta específico
  const getDisponibilidadForTerapeuta = (
    terapeutaNombre: string,
    especialidad: string // Nuevo: agregamos el parámetro especialidad
  ): { [fecha: string]: string[] } | undefined => {
    // Ahora usa el Map 'disponibilidadesProcesadas' para obtener el objeto ya agregado
    console.log(
      `DEBUG SpaLittle: Buscando disponibilidad para terapeuta: ${terapeutaNombre} y especialidad: ${especialidad}`
    );
    const foundDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    if (!foundDisp) {
      return undefined;
    }
    // Retorna la disponibilidad por fecha para la especialidad específica
    return foundDisp.disponibilidadPorServicio[especialidad];
  };
  // --- FIN OBTENER DISPONIBILIDAD ---

  // Tu lista de terapias - **IMPORTANTE: ASEGÚRATE DE QUE LOS NOMBRES DE TERAPEUTAS AQUÍ COINCIDAN EXACTAMENTE CON LOS NOMBRES EN TU BASE DE DATOS**
  // Deberías considerar que los datos de 'terapias' también podrían venir del backend en un futuro.
  const terapias: TerapiaItem[] = [
    {
      img: clau,
      title: "Terapia de Respuesta Espiritual (TRE)",
      terapeuta: "Claudia Diaz",
      terapeuta_id: 41,
      description:
        "Es un  meticuloso proceso de los archivos del subconsciente y del alma. A través del uso del péndulo y gráficos de trabajo y con ayuda de tus guías espirituales investigamos el origen del bloqueo o energías discordantes. Que hace la limpieza? *limpia programas o bloqueos, borrando el patrón de energía negativa de los registros del alma de esta vida o de otras vidas. *Te liberas para poder vivir con todo tu potencial y para poder expresar tu mejor “yo espiritual” sanando  daños mental, emocional o físico.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
      isDisabled: false, // Agregado para deshabilitar
    },
    {
      img: luisa,
      title: "Tarot Terapéutico",
      terapeuta: "Luisa Manríquez",
      terapeuta_id: 42,
      description:
        "es una experiencia de acompañamiento y guía emocional. A través de tiradas dinámicas y participativas, te ayudo a encontrar claridad en situaciones que necesitan luz, fortaleciendo tu autoestima, habilidades y competencias. Tú también formas parte activa del proceso: interpretamos juntas/os, conectando las cartas con tu historia y tu crecimiento personal.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: belen,
      title: "Arteterapia Raíces en Calma",
      terapeuta: "Belén Vera",
      terapeuta_id: 42,
      description:
        "¿Te sientes a menudo agotada física y emocionalmente, con poco ánimo, irritable y presentando dificultades para conciliar el sueño? Al finalizar la sesión, no solo contarás con una  herramienta poderosa para combatir el estrés prolongado, sino que además te sentirás con más tranquilidad y paz para continuar con tu vida diaria. Utilizo la Arteterapia como medio terapéutico para que puedas acceder a lo más recóndito de tu ser y así conectar con la paz interior que tu alma y cuerpo necesitan.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    // {
    //   img: Terapeuta29,
    //   title: "Liberación Emociones Atrapadas",
    //   terapeuta: "Ana Aros",
    //   terapeuta_id: 29,
    //   description:
    //     "En nuestra vida hay situaciones que nos generan sufrimiento y diversas emociones, al no trabajar en aquello es que estás emociones quedan atrapadas en nuestro cuerpo generando malestar a nivel físico o emocional. Esta terapia se trabaja a través de un gráfico para identificar la emoción atrapada y posteriormente con un imán liberar la emocion de raíz",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    //   isDisabled: true, // Agregado para deshabilitar
    // },
  ];

  // Mostrar formulario para seleccionar fecha y hora
  const reservar = (
    terapiaTitle: string,
    terapiaPrecio: number,
    terapeutaNombre: string,
    terapeutaId: number
  ) => {
    if (
      typeof terapiaPrecio !== "number" ||
      isNaN(terapiaPrecio) ||
      terapiaPrecio === null ||
      terapiaPrecio < 0
    ) {
      console.error("Error: Precio de la terapia inválido al reservar.");
      alert("No se puede reservar: el precio es inválido.");
      return;
    }
    setReservaPendiente({
      terapia: terapiaTitle,
      precio: terapiaPrecio,
      terapeutaNombre: terapeutaNombre,
      terapeutaId: terapeutaId,
    });
  };

  const confirmarReserva = async (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => {
    const year = fechaHora.getFullYear();
    const month = String(fechaHora.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(fechaHora.getDate()).padStart(2, "0");

    const fechaFormateada = `${year}-${month}-${day}`; // Formato YYYY-MM-DD local
    const horaFormateada = fechaHora
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5); // Formato HH:MM local
    if (!reservaPendiente) {
      alert("No hay reserva pendiente para confirmar.");
      return;
    }
    // Validaciones de cliente y teléfono (corregidas)
    if (nombreCliente.trim() === "" || telefonoCliente.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(telefonoCliente.trim());
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

    const reservaDataToSend = {
      // No incluyas `id` ni `clientBookingId` aquí; el backend los generará.
      servicio: "Spa Little", // Nombre general del servicio de spa
      especialidad: reservaPendiente.terapia, // La especialidad del servicio
      fecha: fechaFormateada,
      hora: horaFormateada,
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      terapeuta: reservaPendiente.terapeutaNombre,
      terapeutaId: reservaPendiente.terapeutaId,
      sesiones: 1, // Asumiendo 1 sesión para estos servicios de spa, ajusta si es diferente
      cantidadCupos: 1, // Generalmente 1 cupo por reserva de spa
    };

    console.log(
      "DEBUG FRONTEND: Intentando crear reserva de Spa Little en backend:",
      reservaDataToSend
    );

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
          `Error al confirmar la reserva de Spa: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // El backend devuelve { reserva: {...} } con el id real de la DB y el clientBookingId (UUID)
      const { reserva: confirmedReservation } = await response.json();

      console.log(
        "DEBUG FRONTEND: Reserva de Spa Little confirmada por backend:",
        confirmedReservation
      );

      // Añadir la reserva (con el ID de la DB y clientBookingId del backend) al carrito
      addToCart(confirmedReservation); // confirmedReservation ya tiene id y clientBookingId válidos

      alert(
        `¡Reserva de Spa confirmada! ${confirmedReservation.especialidad} el ${confirmedReservation.fecha} a las ${confirmedReservation.hora}.`
      );

      // Volver a cargar la disponibilidad para reflejar la hora reservada y actualizar el DatePicker
      // Esto es crucial para que el DatePicker se actualice

      setReservaPendiente(null); // Cierra el modal de fecha/hora
    } catch (error: any) {
      console.error("ERROR al crear la reserva de Spa Little:", error);
      alert(`No se pudo completar la reserva de Spa: ${error.message}`);
    }
  };
  // --- OBTENER LA DISPONIBILIDAD DEL TERAPEUTA SELECCIONADO ---
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(
        reservaPendiente.terapeutaNombre,
        reservaPendiente.terapia // Pasamos el nombre de la especialidad
      )
    : undefined;
  // --- FIN OBTENER DISPONIBILIDAD ---
  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Spa Little</h1>
        <CartIcon />
      </header>
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>
      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Bienvenido al Spa Little
      </h2>
      <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">
        (Del 5 al 7 de Diciembre de 2025)
      </h1>
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center"></p>

      <div className="flip-wrapper-container mt-10">
        {terapias.map((t, i) => (
          <div key={i} className="flip-wrapper">
            <div className="flip-card">
              <div className="flip-inner">
                <div className="flip-front">
                  <img src={t.img} alt={t.title} />
                  <div className="nombre-overlay">
                    <p>{t.title}</p>
                  </div>
                </div>
                <div className="flip-back">
                  <h3 className="mb-2 font-bold">
                    {t.terapeuta !== "Disponible" && (
                      <span className="text-sm text-gray-600 block">
                        {t.terapeuta}
                      </span>
                    )}
                    {t.title}
                  </h3>
                  <p className="mb-2">{t.description}</p>
                  <form
                    className="w-full px-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {t.opciones && t.opciones.length > 0 ? (
                      t.opciones.map((op: OpcionSesion, j: number) =>
                        t.isDisabled ? (
                          <button
                            key={j}
                            type="button"
                            disabled
                            className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed"
                            title="No disponible para reserva"
                          >
                            No Disponible
                          </button>
                        ) : (
                          <button
                            key={j}
                            type="button"
                            onClick={() =>
                              reservar(
                                t.title,
                                op.precio,
                                t.terapeuta,
                                t.terapeuta_id
                              )
                            }
                            className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300"
                          >
                            {op.sesiones} Sesión (${op.precio.toLocaleString()}{" "}
                            CLP)
                          </button>
                        )
                      )
                    ) : t.isDisabled ? (
                      <button
                        type="button"
                        disabled
                        className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed"
                        title="No disponible para reserva"
                      >
                        No Disponible
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          reservar(
                            t.title,
                            t.precio,
                            t.terapeuta,
                            t.terapeuta_id
                          )
                        }
                        className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300"
                      >
                        Toma de hora (${t.precio.toLocaleString()} CLP)
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
                terapeutaSeleccionadoDisponibilidad
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
