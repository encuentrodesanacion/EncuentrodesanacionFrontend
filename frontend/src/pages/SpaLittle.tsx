// frontend/src/pages/SpaLittle.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes - Asegúrate de que los nombres de archivo coincidan EXACTAMENTE
import Terapeuta17 from "../assets/Terapeuta17.jpeg";
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import Terapeuta18 from "../assets/Terapeuta18.jpeg";
import creadordigital from "../assets/creadorvirtual.jpg";
import DatePicker from "react-datepicker";
import creadorVirtual from "../assets/creadorvirtual.jpg";
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

          if (
            !nombreDelTerapeuta ||
            terapeutaIdDelRow === undefined ||
            terapeutaIdDelRow === null
          ) {
            // Valida también el ID
            console.warn(
              `DEBUG SpaLittle: Fila de disponibilidad sin nombre de terapeuta o ID de terapeuta (${terapeutaIdDelRow}). Será ignorada.`,
              row
            );
            return;
          }

          if (!aggregatedDisponibilidades.has(nombreDelTerapeuta)) {
            aggregatedDisponibilidades.set(nombreDelTerapeuta, {
              nombreTerapeuta: nombreDelTerapeuta,
              terapeutaId: terapeutaIdDelRow, // Asigna el ID correcto aquí
              disponibilidadPorFecha: {},
            });
          } else {
            // Si el terapeuta ya existe en el mapa, asegúrate que el ID se asignó
            // (esto es por si la primera fila para un terapeuta tenía terapeutaId: undefined)
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
            if (!currentTerapeutaDisp.disponibilidadPorFecha[dia]) {
              currentTerapeutaDisp.disponibilidadPorFecha[dia] = [];
            }
            horas.forEach((hora: string) => {
              if (
                !currentTerapeutaDisp.disponibilidadPorFecha[dia].includes(hora)
              ) {
                currentTerapeutaDisp.disponibilidadPorFecha[dia].push(hora);
              }
            });
            currentTerapeutaDisp.disponibilidadPorFecha[dia].sort();
          });

          console.log(
            `DEBUG SpaLittle: Procesando fila para ${nombreDelTerapeuta} (ID: ${terapeutaIdDelRow}):`,
            row
          );
          console.log(
            `DEBUG SpaLittle: Disponibilidad procesada para ${nombreDelTerapeuta} (currentTerapeutaDisp):`,
            currentTerapeutaDisp
          );
          console.log(
            `DEBUG SpaLittle: Disponibilidad por fecha para ${nombreDelTerapeuta} en ${dias[0]}:`,
            currentTerapeutaDisp.disponibilidadPorFecha[dias[0]]
          );
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
    terapeutaNombre: string
  ): DisponibilidadTerapeuta | undefined => {
    // Ahora usa el Map 'disponibilidadesProcesadas' para obtener el objeto ya agregado
    console.log(
      `DEBUG SpaLittle: Buscando disponibilidad para terapeuta: ${terapeutaNombre}`
    );
    const foundDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    console.log(
      `DEBUG SpaLittle: Disponibilidad encontrada para ${terapeutaNombre}:`,
      foundDisp
    );
    return foundDisp;
  };
  // --- FIN OBTENER DISPONIBILIDAD ---

  // Tu lista de terapias - **IMPORTANTE: ASEGÚRATE DE QUE LOS NOMBRES DE TERAPEUTAS AQUÍ COINCIDAN EXACTAMENTE CON LOS NOMBRES EN TU BASE DE DATOS**
  // Deberías considerar que los datos de 'terapias' también podrían venir del backend en un futuro.
  const terapias: TerapiaItem[] = [
    {
      img: Terapeuta17,
      title: "Clarividencia",
      terapeuta: "Johana Miranda",
      terapeuta_id: 19,
      description:
        "Esta clarividencia terapéutica está enfocada en una sanación para amarse, conocerse uno mismo, sanar y crecer emocionalmente, mejorando situaciones que han estado almacenadas en ti por mucho tiempo, conectando con guías y sanadores por medio de la maravillosa vibración del amor, logrando tu armonización y equilibrio emocional.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
      isDisabled: true, // Agregado para deshabilitar
    },
    {
      img: Terapeuta1,
      title: "Oráculos vidas pasadas",
      terapeuta: "Brenda Rivas",
      terapeuta_id: 7,
      description:
        " Este oráculo regresivo nos regala la oportunidad de explorar nuestro pasado y lograr incorporar experiencias, recuerdos de otras encarnaciones a nuestra vida actual logrando identificar emociones como la ira , culpa, ansiedad ,pena y traumas no resueltos desencadenando problemas emocionales y psicológicos",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
      isDisabled: true, // Agregado para deshabilitar
    },
    {
      img: Terapeuta18,
      title: "Constelaciones Familiares",
      terapeuta: "Viviana Espinoza",
      terapeuta_id: 20,
      description:
        "¿Sientes que ciertos patrones en tu vida se repiten una y otra vez? Las Constelaciones Familiares te permiten comprender y sanar dinámicas ocultas que pueden estar afectando tu vida personal, laboral y emocional. Podrás: -Identificar y liberar bloqueos emocionales que limitan tu bienestar. -Sanar relaciones familiares y mejorar la conexión con tus seres queridos. -Romper patrones repetitivos en tu vida y cambiar tu historia. -Equilibrar tu energía y sentir mayor paz interior. -Encontrar claridad en conflictos personales, laborales y de pareja",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
      isDisabled: true, // Agregado para deshabilitar
    },
    // {
    //   img: creadordigital,ass
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeuta_id: 10,
    //   description:
    //     " Este oráculo regresivo nos regala la oportunidad de explorar nuestro pasado y lograr incorporar experiencias, recuerdos de otras encarnaciones a nuestra vida actual logrando identificar emociones como la ira , culpa, ansiedad ,pena y traumas no resueltos desencadenando problemas emocionales y psicológicos",
    //   precio: 100,
    //   opciones: [{ sesiones: 1, precio: 50 }],
    // },
    // {
    //   img: Terapeuta5,
    //   title: "Purificación y limpieza de energías negativas",
    //   terapeuta: "Sandra Da Silva",
    //   terapeuta_id: 9,
    //   description:
    //     "¿Te sientes agotado/a sin mayor razón? ¿Cansado/a de atraer situaciones y personas tóxicas a tu vida? ¿Sientes que tus caminos están cerrados en el amor, el dinero y la salud? ¿No logras dormir bien por las noches o te despiertas con pesadillas? ¿Sientes presencias extrañas en tu hogar u oficina? ¿Estás irritable y tienes cambios bruscos de humor? ¡Está es la Terapia adecuada para ti! Es un proceso de sanación profunda que elimina bloqueos energéticos, entidades negativas y energías de baja vibración que afectan tu bienestar físico, emocional y espiritual, restaurando tu armonía y vitalidad.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    // },

    // {
    //   img: Terapeuta14,
    //   title: "Armonía Magnética para la Abundancia",
    //   terapeuta: "Ana Luisa Solvervicens",
    //   terapeuta_id: 13,
    //   description:
    //     "Esta terapia armoniza tu energía con la frecuencia dorada de la prosperidad, utilizando símbolos sagrados y vibraciones invisibles, despierta en ti el flujo natural de dar y recibir. Es un llamado silencioso a abrir el alma, liberar los miedos y permitir que la abundancia florezca desde adentro hacia afuera.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    // },
    // {
    //   img: Terapeuta15,
    //   title: "Registros Akáshicos ",
    //   terapeuta: "Laura Vicens",
    //   terapeuta_id: 14,
    //   description:
    //     "Los registros  Akashicos son una fuente de información espiritual  donde están guardadas las memorias de tu alma. A través de un viaje personal y canalización puedes recibir mensajes de tus guías, ancestros y seres de luz para comprender tu vida,sanar bloqueos y reconectar con tu propósito.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    // },
    // {
    //   img: Terapeuta8,
    //   title: "Tarot Predictivo y/o Terapia con Oráculos",
    //   terapeuta: "Paola Quintero",
    //   terapeuta_id: 11,
    //   description:
    //     "Cuenta la leyenda que Odín, buscando la sabiduría, se sacrifica y de su sangre brotan las runas. Estas, además de ser un alfabeto, son un oráculo con mensajes poderosos que te guiarán en tu camino. La lectura de runas es una herramienta de autoconocimiento y orientación que te permite comprender tu presente, explorar el pasado y vislumbrar el futuro, obteniendo claridad para tomar decisiones importantes. ¿Te sientes agotado/a sin mayor razón? ¿Cansado/a de atraer situaciones y personas tóxicas a tu vida? ¿Sientes que tus caminos están cerrados en el amor, el dinero y la salud? ¿No logras dormir bien por las noches o te despiertas con pesadillas? ¿Sientes presencias extrañas en tu hogar u oficina? ¿Estás irritable y tienes cambios bruscos de humor? ¡Está es la Terapia adecuada para ti! Es un proceso de sanación profunda que elimina bloqueos energéticos, entidades negativas y energías de baja vibración que afectan tu bienestar físico, emocional y espiritual, restaurando tu armonía y vitalidad.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    // },

    // {
    //   img: creadorVirtual,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeuta_id: 10, // Asumiendo que este es el ID de Alice Basay
    //   description: "Correo de Prueba.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
    //   isDisabled: false,
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
      .substring(0, 5);
    if (!reservaPendiente) {
      alert("No hay reserva pendiente para confirmar.");
      return;
    }
    // Validaciones de cliente y teléfono
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
      // El backend `crearReservaDirecta` generará el `id` y `clientBookingId` (UUID).
      servicio: "Spa Little", // Nombre general del servicio de Spa Little
      especialidad: reservaPendiente.terapia, // La especialidad del servicio
      fecha: fechaFormateada,
      hora: horaFormateada,
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      terapeuta: reservaPendiente.terapeutaNombre,
      terapeutaId: reservaPendiente.terapeutaId,
      sesiones: 1, // Asumiendo 1 sesión para estos servicios
      cantidadCupos: 1, // Generalmente 1 cupo por reserva
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
          `Error al confirmar la reserva de Spa Little: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json(); // El backend devuelve { reserva: {...} }

      console.log(
        "DEBUG FRONTEND: Reserva de Spa Little confirmada por backend:",
        confirmedReservation
      );

      addToCart(confirmedReservation); // Añadir la reserva completa del backend al carrito

      alert(
        `¡Reserva de Spa Little confirmada! ${confirmedReservation.especialidad} el ${confirmedReservation.fecha} a las ${confirmedReservation.hora}.`
      );

      // Volver a cargar la disponibilidad para reflejar la hora reservada y actualizar el DatePicker
      // Crucial para que el DatePicker se actualice

      setReservaPendiente(null); // Cierra el modal de fecha/hora
    } catch (error: any) {
      console.error("ERROR creating Spa Little reservation:", error);
      alert(`No se pudo completar la reserva de Spa Little: ${error.message}`);
    }
  };
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(reservaPendiente.terapeutaNombre)
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
        {/* AQUI VA LA FECHA */}
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
                    <p>{t.terapeuta}</p>
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
                        t.isDisabled ? ( // Check isDisabled here
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
                    ) : // Lógica condicional para el botón si no hay opciones específicas
                    t.isDisabled ? ( // Check isDisabled here
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
            <ReservaConFecha
              terapia={reservaPendiente.terapia}
              precio={reservaPendiente.precio}
              onConfirm={confirmarReserva}
              onClose={() => setReservaPendiente(null)}
              disponibilidadTerapeuta={terapeutaSeleccionadoDisponibilidad}
            />
          </div>
        </div>
      )}
    </div>
  );
}
