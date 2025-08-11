import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes (mantienen igual)

import Sentido from "../assets/Sentido.jpg";
import Sanando from "../assets/Sanando.jpg";

import creadordigital from "../assets/creadorvirtual.jpg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReservaConFecha from "../components/ReservaConFecha";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem,
  DisponibilidadTerapeuta,
  ReservaPendiente,
  Reserva,
} from "../types/index";

export default function findetalleres() {
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
        // ¡Importante! Asegúrate de que tu backend puede filtrar por tipo de servicio si lo necesitas,
        // o devuelve la disponibilidad general del terapeuta para este contexto de "talleres".
        const response = await fetch(`${apiBaseUrl}/disponibilidades`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData: RawDisponibilidadDBItem[] = await response.json();
        console.log(
          "DEBUG findetalleres: Datos crudos de disponibilidades desde el backend (RawData):",
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
            console.warn(
              `DEBUG Findetalleres: Fila de disponibilidad sin nombre de terapeuta o ID de terapeuta (${terapeutaIdDelRow}). Será ignorada.`,
              row
            );
            return;
          }

          if (!aggregatedDisponibilidades.has(nombreDelTerapeuta)) {
            aggregatedDisponibilidades.set(nombreDelTerapeuta, {
              nombreTerapeuta: nombreDelTerapeuta,
              terapeutaId: terapeutaIdDelRow,
              disponibilidadPorFecha: {},
            });
          } else {
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
            `DEBUG findetalleres: Procesando fila para ${nombreDelTerapeuta} (ID: ${terapeutaIdDelRow}):`,
            row
          );
          console.log(
            `DEBUG findetalleres: Disponibilidad procesada para ${nombreDelTerapeuta} (currentTerapeutaDisp):`,
            currentTerapeutaDisp
          );
          console.log(
            `DEBUG findetalleres: Disponibilidad por fecha para ${nombreDelTerapeuta} en ${dias[0]}:`,
            currentTerapeutaDisp.disponibilidadPorFecha[dias[0]]
          );
        });
        setDisponibilidadesProcesadas(aggregatedDisponibilidades);
        console.log(
          "DEBUG findetalleres: Disponibilidades procesadas y agregadas (Map final):",
          aggregatedDisponibilidades
        );
      } catch (error) {
        console.error(
          "ERROR findetalleres: Error al cargar y procesar las disponibilidades:",
          error
        );
      }
    };

    fetchAndProcessDisponibilidades();
  }, []);

  const getDisponibilidadForTerapeuta = (
    terapeutaNombre: string
  ): DisponibilidadTerapeuta | undefined => {
    console.log(
      `DEBUG findetalleres: Buscando disponibilidad para terapeuta: ${terapeutaNombre}`
    );
    const foundDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    console.log(
      `DEBUG findetalleres: Disponibilidad encontrada para ${terapeutaNombre}:`,
      foundDisp
    );
    return foundDisp;
  };

  // Tu lista de terapias - **Mantienen igual por ahora, pero considera obtenerlas del backend**
  const terapias: TerapiaItem[] = [
    {
      img: Sentido,
      title: "Dime cómo naciste y te diré quien eres",
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
        "Sientes que tuviste una infancia dificil;  que tuviste que crecer rápido; aveces tratas de recordar tu infancia y no llegan recuerdos. Si es así, este taller es para ti, conoceremos las heridas de infancia, nos conectaremos con tu niño/niña herida, y les daremos el amor que quizás faltó.",
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

  // --- MODIFICACIÓN CLAVE AQUÍ: AÑADIENDO LA LLAMADA AL BACKEND ---
  const confirmarReserva = async (
    // ¡Ahora es async!
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => {
    if (!reservaPendiente) {
      alert("No hay reserva pendiente para confirmar.");
      return;
    }

    // Preparamos los datos a enviar al backend
    // Asegúrate de que los nombres de las propiedades coincidan con lo que espera el backend
    const reservaDataToSend = {
      // No incluimos 'id' aquí; el backend lo generará
      servicio: "Finde de Talleres", // O el tipo de servicio específico para esta sección
      especialidad: reservaPendiente.terapia,
      fecha: fechaHora.toISOString().split("T")[0], // Formato "YYYY-MM-DD"
      hora: fechaHora.toTimeString().split(" ")[0].substring(0, 5), // Formato "HH:MM"
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      terapeuta: reservaPendiente.terapeutaNombre, // Nombre del terapeuta
      terapeutaId: reservaPendiente.terapeutaId, // ID del terapeuta
      sesiones: 1, // Para talleres es 1 sesión
      cantidadCupos: 1, // Asumimos que se reserva 1 cupo por reserva de taller
    };

    console.log(
      "DEBUG FRONTEND: Intentando confirmar reserva con el backend (reservaDataToSend):",
      reservaDataToSend
    );

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
      // *** CAMBIO CLAVE: Cambiar la ruta de `/reservar` a `/reservar-directa` ***
      const response = await fetch(`${apiBaseUrl}/reservar-directa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaDataToSend),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        // Mejorar el mensaje de error para el usuario
        const errorMessage =
          errorBody.mensaje ||
          `Error desconocido al confirmar la reserva: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // El backend ahora debería devolver el objeto de reserva creado con su 'id'
      const { reserva: confirmedReservation } = await response.json(); // Desestructurar para obtener el objeto 'reserva'

      console.log(
        "DEBUG FRONTEND: Reserva confirmada por el backend:",
        confirmedReservation
      );

      // Añadir la reserva (confirmada por el backend con su ID) al carrito del frontend
      addToCart(confirmedReservation);

      alert(
        `¡Taller ${confirmedReservation.especialidad} reservado para el ${confirmedReservation.fecha} a las ${confirmedReservation.hora}! Lo hemos añadido a tu carrito para que puedas completar el pago.`
      );

      setReservaPendiente(null); // Cierra el modal
    } catch (error: any) {
      console.error("ERROR al confirmar la reserva:", error);
      alert(`No se pudo completar la reserva: ${error.message}`);
    }
  };
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(reservaPendiente.terapeutaNombre)
    : undefined;

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Finde de talleres
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
      <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">
        (Del 18 al 20 de Julio)
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
              disponibilidadTerapeuta={terapeutaSeleccionadoDisponibilidad}
            />
          </div>
        </div>
      )}
    </div>
  );
}
