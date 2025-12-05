// frontend/src/pages/Findetalleres.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes
import pam2 from "../assets/pam2.jpg";
import pam1 from "../assets/pam1.jpg";
import sarita1 from "../assets/sarita1.png";
import sarita2 from "../assets/sarita2.png";
import gab1 from "../assets/gab1.jpeg";
import gab2 from "../assets/gab2.jpeg";
import pamela from "../assets/pamela.jpeg";
import crisolde2 from "../assets/crisolde2.jpg";
import puerta from "../assets/puerta.png";
import llama from "../assets/llamaint.png";
import danza from "../assets/danza.jpg";
import manual from "../assets/manual.jpg";
import altar from "../assets/altar.jpg";
import abundanc from "../assets/abundancia.png";
import creadordigital from "../assets/creadorvirtual.jpg";

import "react-datepicker/dist/react-datepicker.css";
import ReservaConFecha from "../components/ReservaConFecha";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem,
  DisponibilidadTerapeuta, // Usamos la interfaz actualizada
  ReservaPendiente,
  Reserva,
} from "../types/index";
import parsePhoneNumberFromString from "libphonenumber-js";
import ReservaConFechaAmigable from "../components/ReservaConFechaAmigable";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function Findetalleres() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [reservaPendiente, setReservaPendiente] =
    useState<ReservaPendiente | null>(null);
  const [disponibilidadesProcesadas, setDisponibilidadesProcesadas] = useState<
    Map<string, DisponibilidadTerapeuta>
  >(new Map());

  // --- EFECTO PARA CARGAR Y PROCESAR LAS DISPONIBILIDADES AL MONTAR EL COMPONENTE ---
  useEffect(() => {
    const fetchAndProcessDisponibilidades = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
        const response = await fetch(`${apiBaseUrl}/disponibilidades`);
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
          const servicioDelRow = row.especialidad_servicio; // Obtener el nombre del servicio/taller

          if (
            !nombreDelTerapeuta ||
            terapeutaIdDelRow === undefined ||
            terapeutaIdDelRow === null ||
            !servicioDelRow // Validación crucial para el servicio
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
              disponibilidadPorServicio: {}, // ¡Inicializa con la estructura correcta!
            });
          } else {
            // Asegúrate de que el terapeuta ya tiene el ID asignado
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

          // Asegúrate de que la disponibilidad para el servicio exista
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
        // console.log("Disponibilidades procesadas:", aggregatedDisponibilidades);
      } catch (error) {
        console.error(
          "ERROR Findetalleres: Error al cargar y procesar las disponibilidades:",
          error
        );
      }
    };
    fetchAndProcessDisponibilidades();
  }, []);
  // Función para obtener la disponibilidad por terapeuta Y por servicio
  const getDisponibilidadForTerapeutaAndService = (
    terapeutaNombre: string,
    servicioNombre: string
  ): { [fecha: string]: string[] } | undefined => {
    const terapeutaDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    if (!terapeutaDisp) {
      return undefined;
    }
    // Retorna la disponibilidad por fecha para el servicio específico
    return terapeutaDisp.disponibilidadPorServicio[servicioNombre];
  };

  const terapias: TerapiaItem[] = [
    // {
    //   img: mcab1,
    //   title: "Reprograma tu mente (Péndulo)",
    //   terapeuta: "Marcela Cabezas",
    //   terapeuta_id: 25,
    //   description:
    //     "Terapia que utiliza el Péndulo para identificar bloqueos subconscientes y reprogramar patrones mentales limitantes, promoviendo la sanación emocional y el bienestar integral.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
    // {
    //   img: mcab2,
    //   title: "Enseña a tu cuerpo a descansar (Pendulo)",
    //   terapeuta: "Marcela Cabezas",
    //   terapeuta_id: 25,
    //   description:
    //     "Terapia que emplea el Pendulo para armonizar la energía del cuerpo y la mente, ayudándo a liberar tensiones y enseñar al cuerpo a alcanzar un estado profundo de descanso y equilibrio.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
    // {
    //   img: anaa,
    //   title: "Fortaleciendo mi diálogo interno",
    //   terapeuta: "Ana Aros",
    //   terapeuta_id: 23,
    //   description:
    //     "Este taller busca cambiar nuestro lenguaje interno y la forma en cómo nos tratamos a nosotros mismos, generando un diálogo sano, respetuoso y amoroso en en diario vivir.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },

    {
      img: pam1,
      title: "Círculo de Mujeres 'Cerrando ciclos'",
      terapeuta: "Pamela Benavides",
      terapeuta_id: 31,
      description:
        "Sanaremos en Clan nuestras memorias uterinas de dolor, para cerrar ciclos ancestrales de sufrimiento femenino familiar. Con meditación guiada liberaremos el dolor acumulado. Será un momento de compartir en relajo, distención y sanación en conjunto.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    {
      img: pam2,
      title: "Aprende a proteger tu Aura",
      terapeuta: "Pamela Benavides",
      terapeuta_id: 31,
      description:
        "Aprenderás que es el Aura y Chakras. Como limpiar tus cuerpos energéticamente. Dominarás técnicas básicas de protección contra ataques energéticos, envidias y vampiros energéticos.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    {
      img: sarita1,
      title: "Gratitud y Manifestación: Crea tu Ritual de Abundancia 2026:",
      terapeuta: "Sarita Infante",
      terapeuta_id: 26,
      description:
        "Experiencia suave y bonita con journaling + numerología + visualización",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    {
      img: sarita2,
      title: "Reescribe tu Historia 2025: Del Dolor a la Luz",
      terapeuta: "Sarita Infante",
      terapeuta_id: 26,
      description:
        "Un taller profundo de resignificación: heridas, aprendizajes, propósito. Súper transformador y alineado contigo.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    {
      img: gab1,
      title: "Taller de Piso Pélvico: Conexión, Fuerza y Bienestar",
      terapeuta: "Gabriela Pinto",
      terapeuta_id: 34,
      description:
        "Un espacio práctico y educativo donde exploraremos la anatomía del piso pélvico y la pelvis, comprendiendo su función y cómo influye en nuestra salud diaria. Aprenderás estrategias para prevenir la incontinencia urinaria, aliviar el dolor lumbo–sacro y mejorar la postura de los órganos internos a través de ejercicios y hábitos saludables. También abordaremos cómo fortalecer esta zona puede optimizar la función sexual y, para quienes lo necesiten, ofreceremos herramientas específicas de preparación al parto, favoreciendo un embarazo y nacimiento más conscientes. Evitemos el “me hice pipi”",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    {
      img: gab2,
      title: "Taller de Salud Pélvica y Bienestar Urinario",
      terapeuta: "Gabriela Pinto",
      terapeuta_id: 34,
      description:
        "Un encuentro informativo y práctico para comprender la anatomía del piso pélvico y la pelvis, y cómo su funcionamiento influye en la salud urinaria. Conversaremos sobre estrategias para prevenir infecciones urinarias, reconocer y manejar el síndrome de vejiga irritable, y comprender posibles causas del dolor al orinar. Además, revisaremos hábitos saludables para el cuidado de la vejiga, promoviendo una mejor calidad de vida desde la educación y la autoconsciencia corporal.Evitemos el “me duele hacer pipi” ",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    // {
    //   img: danza,
    //   title: "Danza Contemporánea",
    //   terapeuta: "Catalina Sánchez",
    //   terapeuta_id: 33,
    //   description:
    //     "Este taller ofrece un espacio de exploración corporal usando la técnica de la danza contemporánea, guiando a los participantes a través de movimientos básicos. El objetivo es crear un pequeño fraseo de danza como producto final, utilizando música motivadora y premisas que fomenten la exploración. Solo necesitas un espacio libre para moverte, agua y un computador para un encuentro personal y colectivo con el movimiento.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
    // {
    //   img: altar,
    //   title: "Como Crear Tu Altar",
    //   terapeuta: "Ana Luisa Solervicens",
    //   terapeuta_id: 13,
    //   description:
    //     "Un encuentro para conectar con la energía sagrada de tu espacio personal. En este taller aprenderás a diseñar y consagrar tu propio altar, comprendiendo el significado de cada elemento y cómo alinearlo con tus intenciones durante una hora, exploraremos los tipos de altares, la elección consciente de objetos, colores y aromas, y realizaremos una activación energética para consagrarlo",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
    // {
    //   img: abundanc,
    //   title: "Despierta tu Energía de Prosperidad",
    //   terapeuta: "Ana Luisa Solervicens",
    //   terapeuta_id: 13,
    //   description:
    //     "Este taller vivencial será espacio para aprender a atraer y activar la energía de la prosperidad a través de rituales conscientes. Descubrirás cómo preparar tu altar, elegir elementos simbólicos, y realizar rituales guiados para abrir tus caminos de abundancia. Una experiencia práctica y espiritual para conectar con la gratitud, la confianza y el merecimiento.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
    // {
    //   img: creadordigital,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeuta_id: 10,
    //   description:
    //     "Descubre el poder simbolico y energético del fuego a través de la magia con velas. En este taller aprenderás cómo utilizar las velas para enfocar intenciones atraer energías positivas y crear rituales sencillos pero poderosos.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
    // {
    //   img: creadordigital,
    //   title: "Taller de Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeuta_id: 10,
    //   description:
    //     "Descubre el poder simbolico y energético del fuego a través de la magia con velas. En este taller aprenderás cómo utilizar las velas para enfocar intenciones atraer energías positivas y crear rituales sencillos pero poderosos.",
    //   precio: 10000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 10000 }],
    // },
  ];

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
    if (!reservaPendiente) {
      alert("No hay reserva pendiente para confirmar.");
      return;
    }

    const reservaDataToSend = {
      servicio: "Finde de Talleres",
      especialidad: reservaPendiente.terapia,
      fecha: fechaHora.toISOString().split("T")[0],
      hora: fechaHora.toTimeString().split(" ")[0].substring(0, 5),
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
          `Error desconocido al confirmar la reserva: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json();
      addToCart(confirmedReservation);
      alert(
        `¡Taller ${confirmedReservation.especialidad} reservado para el ${confirmedReservation.fecha} a las ${confirmedReservation.hora}! Lo hemos añadido a tu carrito para que puedas completar el pago.`
      );
      setReservaPendiente(null);
    } catch (error: any) {
      console.error("ERROR al confirmar la reserva:", error);
      alert(`No se pudo completar la reserva: ${error.message}`);
    }
  };

  const disponibilidadParaTallerEspecifico = reservaPendiente
    ? getDisponibilidadForTerapeutaAndService(
        reservaPendiente.terapeutaNombre,
        reservaPendiente.terapia // Pasa el nombre del servicio/taller aquí
      )
    : undefined;

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Fin de semana de Talleres
        </h1>
        <CartIcon />
      </header>

      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Bienvenido al Finde de Talleres
      </h2>
      <h1 className="text-3xl font-bold text-center text-pink-700 mb-6"></h1>
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center"></p>
      <div className="flip-wrapper-container mt-10">
        {terapias.map((t, i) => (
          <div key={i} className="flip-wrapper">
            <div className="flip-card">
              <div className="flip-inner">
                <div className="flip-front">
                  <img src={t.img} />
                  <div className="nombre-overlay">
                    <p
                      className="font-bold text-"
                      style={{ pointerEvents: "none" }}
                    >
                      {t.title}
                    </p>
                  </div>
                </div>
                <div className="flip-back flex flex-col justify-between p-1">
                  <div className="overflow-y-auto max-h-[75%]">
                    <h3 className="mb-2 font-bold text-lg leading-tight">
                      {t.terapeuta !== "Disponible" && (
                        <span className="text-sm text-gray-600 block">
                          {t.terapeuta}
                        </span>
                      )}
                      {t.title}
                    </h3>
                    <div className="text-sm">
                      {t.description.split("\n").map((line, index) => (
                        <p
                          key={index}
                          className="mb-1 text-center text-xs sm:text-sm"
                          style={{ pointerEvents: "none" }} // <<-- ¡CRÍTICO! Deshabilita el clic en el texto
                        >
                          {line}
                        </p>
                      ))}
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                  <form // CLASE MODIFICADA: Cambiamos 'bottom-0' por el estilo en línea para elevarlo
                    className=" absolute left-0 p-4 pt-2 z-2 flex-shrink-0"
                    style={{ bottom: "30px" }} // <--- AJUSTE CLAVE: Lo mueve 10px hacia arriba
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {/* Aseguramos que los botones siempre estén en la capa superior (z-30) */}
                    {t.opciones && t.opciones.length > 0 ? (
                      t.opciones.map((op: OpcionSesion, j: number) =>
                        t.isDisabled ? (
                          <button
                            key={j}
                            type="button"
                            disabled
                            className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed relative z-30"
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
                            className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300 relative z-30"
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
                        className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed relative z-30"
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
                        className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300 relative z-30"
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
                disponibilidadParaTallerEspecifico
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
