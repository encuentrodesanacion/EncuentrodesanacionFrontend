// frontend/src/pages/findetalleres.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes - Asegúrate de que los nombres de archivo coincidan EXACTAMENTE
import Sentido from "../assets/Sentido.jpg";
import Velas from "../assets/Velas.jpg";
import Abrazando from "../assets/Abrazando.jpg";
import Volveranacer from "../assets/Volveranacer.jpg";
import herbolaria from "../assets/Herbolaria.jpg";
import creadorvirtual from "../assets/creadorvirtual.jpg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReservaConFecha from "../components/ReservaConFecha";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem, // Para los datos crudos del backend
  DisponibilidadTerapeuta, // Para los datos procesados y agregados
  ReservaPendiente,
  Reserva,
} from "../types/index";

export default function findetalleres() {
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
            // Valida también el ID
            console.warn(
              `DEBUG Findetalleres: Fila de disponibilidad sin nombre de terapeuta o ID de terapeuta (${terapeutaIdDelRow}). Será ignorada.`,
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

          // if (dias.length === 0 || horas.length === 0) {
          //   console.warn(
          //     `DEBUG findetalleres: Fila de disponibilidad para ${nombreDelTerapeuta} en ${
          //       dias[0] || "N/A"
          //     } tiene días u horas vacías (después de getters).`,
          //     row
          //   );
          //   return;
          // }

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
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para obtener la disponibilidad de un terapeuta específico
  const getDisponibilidadForTerapeuta = (
    terapeutaNombre: string
  ): DisponibilidadTerapeuta | undefined => {
    // Ahora usa el Map 'disponibilidadesProcesadas' para obtener el objeto ya agregado
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
  // --- FIN OBTENER DISPONIBILIDAD ---

  // Tu lista de terapias - **IMPORTANTE: ASEGÚRATE DE QUE LOS NOMBRES DE TERAPEUTAS AQUÍ COINCIDAN EXACTAMENTE CON LOS NOMBRES EN TU BASE DE DATOS**
  // Deberías considerar que los datos de 'terapias' también podrían venir del backend en un futuro.
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
      especialidad: "Dime cómo naciste y te diré quien eres",
    },

    {
      img: Velas,
      title: "El poder de las velas",
      terapeuta: "Ana Luisa Solvervicens",
      terapeuta_id: 13,
      description:
        "Descubre el poder simbolico y energético del fuego a través de la magia con velas. En este taller aprenderás cómo utilizar las velas para enfocar intenciones atraer energías positivas y crear rituales sencillos pero poderosos.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
      especialidad: "El poder de las velas",
    },

    {
      img: Volveranacer,
      title: "Volver a Nacer",
      terapeuta: "Ema Iriarte",
      terapeuta_id: 21,
      description:
        "En este taller te invitamos a soltar memorias de dolor que se han integrado en el útero, específicamente en el momento de la concepción. Reconocemos que, al ser concebidos, ya heredamos programaciones ancestrales que pueden influir en nuestra vida. En este espacio comprenderás cómo el hecho de haber sido, por ejemplo, un bebé no esperado o no concebido por amor puede haber dejado una huella. A través de ejercicios específicos trabajaremos para resignificar el momento de tu concepción, y realizaremos un viaje consciente, mes a mes, por el período previo a tu nacimiento, permitiendo la sanación y liberación profunda.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
      especialidad: "Volver a Nacer",
    },
    {
      img: Abrazando,
      title: "Abrazando a nuestra niña interior",
      terapeuta: "Ema Iriarte",
      terapeuta_id: 21,
      description:
        "En este taller abrazaremos a ese niñ@ interior que, en su infancia, vivió momentos de soledad, tristeza, abusos, entre otras experiencias. A través de ejercicios específicos, viajaremos a esos momentos clave para poder sanar profundamente esas vivencias.",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
      especialidad: "Abrazando a nuestra niña interior",
    },
    {
      img: herbolaria,
      title: "Astrología y Herbolaria",
      terapeuta: "Carolina Provoste",
      terapeuta_id: 22,
      description:
        "Aprenderás las propiedades medicinales de algunas plantas y la relación que hay entre ellas. Tambien podrás aprender a preparar tinturas madres de aceites macerados, ungüentos medicinales. Además, aprenderás a personalizar tus tratamientos",
      precio: 10000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 10000 }],
      especialidad: "Astrología y Herbolaria",
    },

    {
      img: creadorvirtual,
      title: "Cruz",
      terapeuta: "Alice Basay",
      terapeuta_id: 10, // Asumiendo que este es el ID de Alice Basay
      description: "Correo de Prueba.",
      precio: 10000,
      opciones: [{ sesiones: 1, precio: 10000 }],
      especialidad: "Cruz",
    },
    {
      img: creadorvirtual,
      title: "Cruzada",
      terapeuta: "Alice Basay",
      terapeuta_id: 10, // Asumiendo que este es el ID de Alice Basay
      description: "Correo de Prueba.",
      precio: 10000,
      opciones: [{ sesiones: 1, precio: 10000 }],
      especialidad: "Cruzada",
    },
  ];

  // Mostrar formulario para seleccionar fecha y hora
  const reservar = (
    terapiaTitle: string,
    terapiaPrecio: number,
    terapeutaNombre: string,
    terapeutaId: number,
    especialidad: string
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
      especialidad: especialidad,
    });
  };

  const confirmarReserva = (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => {
    if (!reservaPendiente) return;

    const reserva: Reserva = {
      id: Date.now(), // Genera un ID único
      servicio: "Finde de talleres",
      especialidad: reservaPendiente.terapia, // Mantén esto si la especialidad es la misma que la terapia
      fecha: fechaHora.toISOString().split("T")[0],
      hora: fechaHora.toTimeString().split(" ")[0].substring(0, 5), // Formato HH:MM
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      terapeuta: reservaPendiente.terapeutaNombre,
      terapeutaId: reservaPendiente.terapeutaId,
      sesiones: 1,
      cantidad: 1,
    };
    console.log(
      "DEBUG FRONTEND: Valor de reserva.terapeuta antes de addToCart:",
      reserva.terapeuta
    );

    console.log(
      "Objeto Reserva FINAL a añadir al carrito desde findetalleres:",
      reserva
    );
    addToCart(reserva);
    console.log(
      "Objeto Reserva FINAL a añadir al carrito desde findetalleres:",
      reserva
    );

    alert(
      `Reserva agregada: ${reserva.servicio} el ${reserva.fecha} a las ${reserva.hora}. Te contactaremos al ${reserva.telefonoCliente}.`
    );

    setReservaPendiente(null); // Cierra el modal de fecha/hora
  };
  // --- OBTENER LA DISPONIBILIDAD DEL TERAPEUTA SELECCIONADO ---
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(reservaPendiente.terapeutaNombre)
    : undefined;
  // --- FIN OBTENER DISPONIBILIDAD ---
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
                                t.terapeuta_id,
                                t.especialidad
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
                    t.isDisabled ? (
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
                            t.terapeuta_id,
                            t.especialidad
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
              terapeutaId={reservaPendiente.terapeutaId}
              especialidad={reservaPendiente.especialidad}
            />
          </div>
        </div>
      )}
    </div>
  );
}
