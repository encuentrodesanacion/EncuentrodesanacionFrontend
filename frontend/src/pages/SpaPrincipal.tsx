// frontend/src/pages/SpaPrincipal.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes - Asegúrate de que los nombres de archivo coincidan EXACTAMENTE
import Terapeuta30 from "../assets/Terapeuta30.jpeg";
import Terapeuta11 from "../assets/Terapeuta11.jpeg";
import Terapeuta5 from "../assets/Terapeuta5.jpg";
import Terapeuta8 from "../assets/Terapeuta8.jpg";
import Terapeuta13 from "../assets/Terapeuta13.jpeg";
import Terapeuta14 from "../assets/Terapeuta14.jpeg";
import Terapeuta15 from "../assets/Terapeuta15.jpeg";
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
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function SpaPrincipal() {
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
          "DEBUG SpaPrincipal: Datos crudos de disponibilidades desde el backend (RawData):",
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
              `DEBUG SpaPrincipal: Fila de disponibilidad sin nombre de terapeuta o ID de terapeuta (${terapeutaIdDelRow}). Será ignorada.`,
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
              `DEBUG SpaPrincipal: Fila de disponibilidad para ${nombreDelTerapeuta} en ${
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
            `DEBUG SpaPrincipal: Procesando fila para ${nombreDelTerapeuta} (ID: ${terapeutaIdDelRow}):`,
            row
          );
          console.log(
            `DEBUG SpaPrincipal: Disponibilidad procesada para ${nombreDelTerapeuta} (currentTerapeutaDisp):`,
            currentTerapeutaDisp
          );
          console.log(
            `DEBUG SpaPrincipal: Disponibilidad por fecha para ${nombreDelTerapeuta} en ${dias[0]}:`,
            currentTerapeutaDisp.disponibilidadPorFecha[dias[0]]
          );
        });
        setDisponibilidadesProcesadas(aggregatedDisponibilidades);
        console.log(
          "DEBUG SpaPrincipal: Disponibilidades procesadas y agregadas (Map final):",
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
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para obtener la disponibilidad de un terapeuta específico
  const getDisponibilidadForTerapeuta = (
    terapeutaNombre: string
  ): DisponibilidadTerapeuta | undefined => {
    // Ahora usa el Map 'disponibilidadesProcesadas' para obtener el objeto ya agregado
    console.log(
      `DEBUG SpaPrincipal: Buscando disponibilidad para terapeuta: ${terapeutaNombre}`
    );
    const foundDisp = disponibilidadesProcesadas.get(terapeutaNombre);
    console.log(
      `DEBUG SpaPrincipal: Disponibilidad encontrada para ${terapeutaNombre}:`,
      foundDisp
    );
    return foundDisp;
  };
  // --- FIN OBTENER DISPONIBILIDAD ---

  // Tu lista de terapias - **IMPORTANTE: ASEGÚRATE DE QUE LOS NOMBRES DE TERAPEUTAS AQUÍ COINCIDAN EXACTAMENTE CON LOS NOMBRES EN TU BASE DE DATOS**
  // Deberías considerar que los datos de 'terapias' también podrían venir del backend en un futuro.
  const terapias: TerapiaItem[] = [
    {
      img: Terapeuta11,
      title: "Constelación Familiar Individual",
      terapeuta: "Paulina Villablanca",
      terapeuta_id: 2,
      description:
        "Es una herramienta terapéutica para tratar conflictos personales, familiares y laborales mediante la visualización de representantes que nos permiten tomar decisiones y reconciliarnos con nuestro linaje",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: Terapeuta14,
      title: "Armonía Magnética para la Abundancia",
      terapeuta: "Ana Luisa Solervicens",
      terapeuta_id: 13,
      description:
        "Esta terapia armoniza tu energía con la frecuencia dorada de la prosperidad, utilizando símbolos sagrados y vibraciones invisibles, despierta en ti el flujo natural de dar y recibir. Es un llamado silencioso a abrir el alma, liberar los miedos y permitir que la abundancia florezca desde adentro hacia afuera.",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: Terapeuta8,
      title: "Tarot Predictivo y/o Terapéutico",
      terapeuta: "Paola Quintero",
      terapeuta_id: 11,
      description:
        "El Tarot puede proporcionarte una mirada profunda y libre de juicios de una situación, periodo de tiempo o sistema familiar. Te dará herramientas y consejos prácticos para que llegues a la mejor resolución de un dilema o problema. Los mensajes se canalizan con ayuda de tus guías espirituales, quienes buscan sanarte y esclarecerte.",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta25,
      title: "Códigos Emocionales",
      terapeuta: "Mara Pol",
      terapeuta_id: 25,
      description:
        "Los Códigos Emocionales son una técnica de sanación energética que permite identificar y liberar emociones atrapadas que afectan el cuerpo, la mente y el alma. Utilizando test muscular y un imán,o un péndulo  a diatancia se accede al subconsciente para soltar bloqueos emocionales de forma suave, segura y no invasiva.",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta24,
      title: "Códigos del Alma",
      terapeuta: "Montserrat Méndez",
      terapeuta_id: 24,
      description:
        "Es una lectura profunda de tus números personales a través de la filosofía del Tantra que es una herramienta ancestral que revela la información oculta en tu fecha de nacimiento. A través de esta guía podrás descubrir tus dones espirituales, tus talentos naturales y comprender con mayor claridad aquellos aspectos que vienes a transformar y potenciar en esta vida",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: Terapeuta23,
      title: "Psicoterapia de un Curso de Milagros",
      terapeuta: "Veronica Chaparro",
      terapeuta_id: 23,
      description:
        "Es una sesión guiada por el Espíritu Santo. Vamos a la causa del efecto que adolece en el presente al valiente. El camino es encontrar la raíz emocional. Pasamos por constelar (entregar el problema a quién corresponda y ordenar el clan) y finaliza con  el auto perdón por el error de percepción.",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta28,
      title: "Decodificación de Útero",
      terapeuta: "Andrea Madariaga",
      terapeuta_id: 28,
      description:
        "¿Dolores que no entiendes? ¿Cansancio sin explicación? ¿Sientes que es momento de soltar algo viejo? Este espacio es para ti Vivenciaras -Decodificación del código del cuerpo; útero -Liberación de memorias y de lo que ya lo necesitas -Soltar cargas -Facilita conexión con tu esencia y tu energía -Favorece equilibrio,bienestar,salud y proceso de autoconomiento -Facilita la Integración en tu proceso  y escucha a tus recursos internos -Honrar tu historia",
      precio: 16000,
      isDisabled: true,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    // {
    //   img: creadorVirtual,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeuta_id: 10, // Asumiendo que este es el ID de Alice Basay
    //   description: "Correo de Prueba.",
    //   precio: 16000,
    //   opciones: [{ sesiones: 1, precio: 16000 }],
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
      servicio: "Spa Principal", // Nombre general del servicio de spa
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
      "DEBUG FRONTEND: Intentando crear reserva de Spa Principal en backend:",
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
        "DEBUG FRONTEND: Reserva de Spa Principal confirmada por backend:",
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
      console.error("ERROR al crear la reserva de Spa Principal:", error);
      alert(`No se pudo completar la reserva de Spa: ${error.message}`);
    }
  };
  // --- OBTENER LA DISPONIBILIDAD DEL TERAPEUTA SELECCIONADO ---
  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(reservaPendiente.terapeutaNombre)
    : undefined;
  // --- FIN OBTENER DISPONIBILIDAD ---
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
        (Del 31 de Julio al 02 de Agosto 2025)
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
