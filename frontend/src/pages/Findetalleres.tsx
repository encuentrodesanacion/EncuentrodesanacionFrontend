// frontend/src/pages/Findetalleres.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes
import Sentido from "../assets/Sentido.jpg";
import Sanando from "../assets/Sanando.jpg";
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
    {
      img: Sentido,
      title: "Dime cómo naciste, y te diré quién eres",
      terapeuta: "Paulina Villablanca",
      terapeuta_id: 2,
      description:
        "Descubramos tu proyecto Sentido. A través de la indagación de tu Proyecto Sentido, puedes saber cómo las formas en que naciste te entregaron características de tu forma de ser (tipo de parto, emociones vividas por tus padres durante tu gestación, tipo de hijo/a, entre otros aspectos).",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },
    {
      img: Sanando,
      title: "Sanando mis heridas de infancia",
      terapeuta: "Paulina Villablanca",
      terapeuta_id: 2,
      description:
        "Sientes que tuviste una infancia difícil; que tuviste que crecer rápido; a veces tratas de recordar tu infancia y no llegan recuerdos. Si es así, este taller es para ti: conoceremos las heridas de infancia, nos conectaremos con tu niño/niña herida, y les daremos el amor que quizás faltó.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
    },

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
                  <p className="w-full px-2 mb-4 max-h-28 overflow-y-auto text-sm">
                    {t.description}
                  </p>
                  <form
                    className="w-full px-2 relative z-30"
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
            <ReservaConFecha
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
