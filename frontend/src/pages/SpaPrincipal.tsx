// frontend/src/pages/SpaPrincipal.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes
import Terapeuta11 from "../assets/Terapeuta11.jpeg";
import Ximena from "../assets/ximena.jpg";
import Terapeuta14 from "../assets/Terapeuta14.jpeg";
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import Terapeuta12 from "../assets/Terapeuta12.jpeg";
import loreto from "../assets/loreto.jpg";
import terapeuta5 from "../assets/Terapeuta5.jpg";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import anaaros from "../assets/anaaros.jpg";
import angel from "../assets/Angel.jpeg";
import sarita from "../assets/sarita.jpeg";
import marcela from "../assets/marcela.jpeg";
import renata from "../assets/renata.jpeg";
import crisol from "../assets/crisol.jpeg";
import pamela from "../assets/pamela.jpeg";
import patricia from "../assets/patricia.jpeg";
import ReservaConFecha from "../components/ReservaConFecha";
import {
  OpcionSesion,
  TerapiaItem,
  RawDisponibilidadDBItem,
  DisponibilidadTerapeuta,
  ReservaPendiente,
} from "../types/index";
import parsePhoneNumberFromString from "libphonenumber-js";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function SpaPrincipal() {
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
        console.log("DEBUG SpaPrincipal: Datos crudos desde backend:", rawData);

        const aggregatedDisponibilidades = new Map<
          string,
          DisponibilidadTerapeuta
        >();

        rawData.forEach((row: RawDisponibilidadDBItem) => {
          const nombreDelTerapeuta = row.nombreTerapeuta;
          const terapeutaIdDelRow = row.terapeutaId;
          const servicioDelRow = row.especialidad_servicio; // Se obtiene el servicio

          if (
            !nombreDelTerapeuta ||
            terapeutaIdDelRow === undefined ||
            terapeutaIdDelRow === null ||
            !servicioDelRow
          ) {
            console.warn(
              `DEBUG SpaPrincipal: Fila de disponibilidad sin nombre, ID o servicio.`,
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
          }

          const currentTerapeutaDisp =
            aggregatedDisponibilidades.get(nombreDelTerapeuta)!;

          // Se asegura de que la disponibilidad para el servicio exista
          if (!currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow]) {
            currentTerapeutaDisp.disponibilidadPorServicio[servicioDelRow] = {};
          }

          const dias = Array.isArray(row.diasDisponibles)
            ? row.diasDisponibles
            : [];
          const horas = Array.isArray(row.horasDisponibles)
            ? row.horasDisponibles
            : [];

          if (dias.length === 0 || horas.length === 0) {
            console.warn(
              `DEBUG SpaPrincipal: Fila para ${nombreDelTerapeuta} sin días u horas.`
            );
            return;
          }

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
        console.log(
          "DEBUG SpaPrincipal: Disponibilidades procesadas:",
          aggregatedDisponibilidades
        );
      } catch (error) {
        console.error(
          "ERROR SpaPrincipal: Error al cargar y procesar las disponibilidades:",
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
      img: angel,
      title: "Tarot Terapéutico",
      terapeuta: "Angel Martin",
      terapeuta_id: 27,
      description:
        "El tarot como herramienta terapéutica y guía para encontrar el camino más indicado en el momento presente, complementado con la guía y respaldo de una sesión psicoterapéutica, trabajando lo presentado con las cartas en paralelo con el trabajo emocional, vivencial, y la historia de la persona.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: marcela,
      title: "Liberación Emociones Atrapadas",
      terapeuta: "Marcela Cabezas",
      terapeuta_id: 25,
      description:
        "Liberar emociones es el proceso de reconocer, expresar y soltar emociones reprimidas o no resultas. En la terapia se usan piedras energéticas para liberar emociones atrapadas, equilibrar los chakras y restaurar la armonía emocional y espiritual.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: sarita,
      title: "Raíz del SER",
      terapeuta: "Sarita Infante",
      terapeuta_id: 26,
      description:
        "Un espacio seguro y profundo para volver a ti. A través del coaching, PNL y canalizaciones, encuentras claridad, fuerza interior y dirección para tu vida. Juntos escuchamos tu alma, creamos metas, objetivos que te lleven a vivir en tu propósito",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: patricia,
      title: "Expansión de tu Ser",
      terapeuta: "Patricia Mondaca",
      terapeuta_id: 28,
      description:
        "Transforma tu crecimiento, nuestros pensamientos y emociones definen cómo nos relacionamos. Aquí te entrego herramientas para llevar tus heridas y emociones al siguiente nivel de liberación.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: pamela,
      title: "Sanación Álmica",
      terapeuta: "Pamela Benavides",
      terapeuta_id: 31,
      description:
        "Terapia energética que alinea tu cuerpo con tu Alma, limpiando toda interferencia (entidades, parásitos, hilos de conexión, magia ritual). Incluye masaje energético y campos de protección.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: renata,
      title: "La Medicina de los Animales",
      terapeuta: "Renata Santoro",
      terapeuta_id: 29,
      description:
        "Las cartas de la Medicina de los Animales recopila el conocimiento de los pueblos originarios, quienes lograban tener una conexión directa con los animales, quienes te guiarán a través de la Rueda de la Medicina a encontrar tu senda personal a través de la medicina de los animales.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: crisol,
      title: "Biomagnetismo Emocional",
      terapeuta: "Crisolde Valenzuela",
      terapeuta_id: 30,
      description:
        "Rastreo energético completo guiado con péndulo terapéutico,identificando los puntos del cuerpo donde existen bloqueos o emociones reprimidas,equilibrando el bloqueo a través  de colocación de imanes a distancia.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: Terapeuta14,
      title: "Abrecaminos con Fuego Sagrado",
      terapeuta: "Ana Luisa Solervicens",
      terapeuta_id: 13,
      description:
        "Abre camino con Fuego Sagrado es un ritual que utiliza una vela para desbloquear obstáculos y atraer nuevas oportunidades. Durante la sesión, se interpreta la danza de la llama, el color y la forma de la cera, descubriendo las energías que necesitas equilibrar y potenciar. Este ritual te invita a sanar bloqueos, atraer abundancia y clarificar tucamino, transformando la luz del fuego en guía y protecciónpara tu viaje espiritual",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: Terapeuta1,
      title: "Canalización Energética",
      terapeuta: "Brenda Rivas",
      terapeuta_id: 7,
      description:
        "La canalización energética es un método terapéutico que busca reconectar con nuestro poder espiritual, basándose en los conocimientos y habilidades psíquicas de una persona ,donde se canaliza la información que proviene de otras dimensiones. Es un proceso mediante el cual el terapeuta conecta con una fuente de sabiduría superior ,la información recibida durante la canalización nos permite ayudar al consultante a liberar y sanar traumas ,dolor miedos y bloqueos emocionales físicos energéticos o espirituales.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: terapeuta5,
      title: "Purificación y Limpieza de Energías Negativas",
      terapeuta: "Sandra Da Silva",
      terapeuta_id: 9,
      description:
        "Es una terapia de limpieza profunda que nos permite remover de tu ADN energético toda la contaminación energética absorbida y enviada por otras personas hacia ti, liberando tu energía de cargas que estancan e impiden tu evolución de vida. Nos permite liberar energías negativas producidas por tus pensamientos y emociones así como magia negra, brujerías, hechicerías, maldiciones, envidias y energías densas enviadas por alguien más.",
      precio: 16000,
      isDisabled: false,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    // {
    //   img: terapeuta28,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeuta_id: 10,
    //   description:
    //     "¿Dolores que no entiendes? ¿Cansancio sin explicación? ¿Sientes que es momento de soltar algo viejo? Este espacio es para ti Vivenciaras -Decodificación del código del cuerpo; útero -Liberación de memorias y de lo que ya lo necesitas -Soltar cargas -Facilita conexión con tu esencia y tu energía -Favorece equilibrio,bienestar,salud y proceso de autoconomiento -Facilita la Integración en tu proceso  y escucha a tus recursos internos -Honrar tu historia",
    //   precio: 1000,
    //   isDisabled: false,
    //   opciones: [{ sesiones: 1, precio: 1000 }],
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

    const reservaDataToSend = {
      servicio: "Spa Principal",
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
          `Error al confirmar la reserva de Spa: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json();
      addToCart(confirmedReservation);
      alert(
        `¡Reserva de Spa confirmada! ${confirmedReservation.especialidad} el ${confirmedReservation.fecha} a las ${confirmedReservation.hora}. Dirigete al carro de Compras para pagar tu reserva y así la(s) terapeuta(s)  pueda(n) comunicarse contigo. Agradecemos tu preferencia!`
      );
      setReservaPendiente(null);
    } catch (error: any) {
      console.error("ERROR al crear la reserva de Spa Principal:", error);
      alert(`No se pudo completar la reserva de Spa: ${error.message}`);
    }
  };

  // OBTENER LA DISPONIBILIDAD DEL TERAPEUTA SELECCIONADO
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeutaAndService(
        reservaPendiente.terapeutaNombre,
        reservaPendiente.terapia
      )
    : undefined;

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Spa Principal</h1>
        <CartIcon />
      </header>

      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
        Bienvenido al Spa Principal
      </h2>
      <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">
        (Del 3 al 5 de Noviembre 2025)
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
                <div className="flip-back relative z-20">
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
                    className="w-full px-2 relative z-10"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {t.opciones && t.opciones.length > 0 ? (
                      t.opciones.map((op: OpcionSesion, j: number) =>
                        t.isDisabled ? (
                          <button
                            key={j}
                            type="button"
                            disabled
                            className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed relative z-20"
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
                terapeutaSeleccionadoDisponibilidad
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
