import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart } from "./CartContext";
import CartIcon from "../components/CartIcon";

// Importaciones de imágenes
import Terapeuta3 from "../assets/Terapeuta3.jpg";
import Terapeuta11 from "../assets/Terapeuta11.jpeg";
import Terapeuta5 from "../assets/Terapeuta5.jpg";
import Terapeuta8 from "../assets/Terapeuta8.jpg";
import creadorVirtual from "../assets/creadorvirtual.jpg";
import Terapeuta13 from "../assets/Terapeuta13.jpeg";
import Terapeuta14 from "../assets/Terapeuta14.jpeg";
import Terapeuta15 from "../assets/Terapeuta15.jpeg";

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

export default function SpaPrincipal() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [reservaPendiente, setReservaPendiente] =
    useState<ReservaPendiente | null>(null);
  const [disponibilidadesProcesadas, setDisponibilidadesProcesadas] = useState<
    Map<string, DisponibilidadTerapeuta>
  >(new Map());
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // --- EFECTO PARA CARGAR Y PROCESAR LAS DISPONIBILIDADES AL MONTAR EL COMPONENTE ---
  useEffect(() => {
    const fetchAndProcessDisponibilidades = async () => {
      // 1. Usa la variable de entorno de Netlify/Vite
      const apiUrl = import.meta.env.VITE_API_URL;

      // 2. Verifica que la variable exista
      if (!apiUrl) {
        const errorMessage =
          "CRITICAL ERROR: La variable de entorno VITE_API_URL no está configurada.";
        console.error(errorMessage);
        setError(errorMessage); // Guarda el error para mostrarlo al usuario
        return;
      }

      try {
        // 3. Construye la URL completa y correcta
        const fullUrl = `${apiUrl}/disponibilidades`;
        console.log(`Fetching data from: ${fullUrl}`); // Log para depurar la URL

        const response = await fetch(fullUrl);

        if (!response.ok) {
          throw new Error(
            `Error de red: ${response.status} - ${response.statusText}`
          );
        }

        const rawData: RawDisponibilidadDBItem[] = await response.json();
        console.log(
          "Datos crudos de disponibilidades desde el backend:",
          rawData
        );

        // --- Lógica para procesar los datos (sin cambios) ---
        const aggregatedDisponibilidades = new Map<
          string,
          DisponibilidadTerapeuta
        >();
        rawData.forEach((row) => {
          if (!row.nombreTerapeuta) return;
          if (!aggregatedDisponibilidades.has(row.nombreTerapeuta)) {
            aggregatedDisponibilidades.set(row.nombreTerapeuta, {
              nombreTerapeuta: row.nombreTerapeuta,
              disponibilidadPorFecha: {},
            });
          }
          const terapeutaDisp = aggregatedDisponibilidades.get(
            row.nombreTerapeuta
          )!;
          const fecha =
            typeof row.diasDisponibles === "string"
              ? row.diasDisponibles
              : row.diasDisponibles?.[0];
          if (fecha && Array.isArray(row.horasDisponibles)) {
            const horasExistentes =
              terapeutaDisp.disponibilidadPorFecha[fecha] || [];
            const horasNuevas = new Set([
              ...horasExistentes,
              ...row.horasDisponibles,
            ]);
            terapeutaDisp.disponibilidadPorFecha[fecha] =
              Array.from(horasNuevas).sort();
          }
        });

        setDisponibilidadesProcesadas(aggregatedDisponibilidades);
        console.log(
          "Disponibilidades procesadas y agregadas:",
          aggregatedDisponibilidades
        );
      } catch (err) {
        console.error("Error al cargar y procesar las disponibilidades:", err);
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido."
        );
      }
    };

    fetchAndProcessDisponibilidades();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // --- El resto de tu componente (sin cambios) ---

  const getDisponibilidadForTerapeuta = (
    terapeutaNombre: string
  ): DisponibilidadTerapeuta | undefined => {
    return disponibilidadesProcesadas.get(terapeutaNombre);
  };

  const terapias: TerapiaItem[] = [
    {
      img: Terapeuta3,
      title: "Liberación Memorias Uterinas",
      terapeuta: "Mónica Gatica",
      terapeuta_id: 5,
      description:
        "Es una Terapia para conectar con nuestro Centro Creativo, el útero sagrado y liberar patrones energéticos, emocionales y ancestrales que se almacenan en esta zona. Ayuda a sanar traumas pasados, mejorar la relación con la feminidad y potenciar la creatividad y el bienestar.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta11,
      title: "Constelaciones Familiares",
      terapeuta: "Paulina Villablanca",
      terapeuta_id: 2,
      description:
        "Es una herramienta terapéutica para tratar conflictos personales, familiares y laborales mediante la visualización de representantes que nos permiten tomar decisiones y reconciliarnos con nuestro linaje",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta13,
      title: "Péndulo Hebreo",
      terapeuta: "Rosa Santimone",
      terapeuta_id: 12,
      description:
        "Es una terapia de armonización energética que permite detectar y eliminar energías negativas, restaurando el equilibrio del cuerpo. También diagnostica el estado de los chakras y sistemas del cuerpo, regenera y equilibra su energía. Además, potencia el crecimiento personal, limpia y armoniza el aura y, a través de la cromoterapia, otorga mayores beneficios al consultante.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta5,
      title: "Purificación y limpieza de energías negativas",
      terapeuta: "Sandra Da Silva",
      terapeuta_id: 9,
      description:
        "¿Te sientes agotado/a sin mayor razón? ¿Cansado/a de atraer situaciones y personas tóxicas a tu vida? ¿Sientes que tus caminos están cerrados en el amor, el dinero y la salud? ¿No logras dormir bien por las noches o te despiertas con pesadillas? ¿Sientes presencias extrañas en tu hogar u oficina? ¿Estás irritable y tienes cambios bruscos de humor? ¡Está es la Terapia adecuada para ti! Es un proceso de sanación profunda que elimina bloqueos energéticos, entidades negativas y energías de baja vibración que afectan tu bienestar físico, emocional y espiritual, restaurando tu armonía y vitalidad.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: Terapeuta14,
      title: "Armonía Magnética para la Abundancia",
      terapeuta: "Ana Luisa Solvervicens",
      terapeuta_id: 15,
      description:
        "Esta terapia armoniza tu energía con la frecuencia dorada de la prosperidad, utilizando símbolos sagrados y vibraciones invisibles, despierta en ti el flujo natural de dar y recibir. Es un llamado silencioso a abrir el alma, liberar los miedos y permitir que la abundancia florezca desde adentro hacia afuera.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta15,
      title: "Registros Akáshicos ",
      terapeuta: "Laura Vicens",
      terapeuta_id: 17,
      description:
        "Los registros Akashicos son una fuente de información espiritual donde están guardadas las memorias de tu alma. A través de un viaje personal y canalización puedes recibir mensajes de tus guías, ancestros y seres de luz para comprender tu vida,sanar bloqueos y reconectar con tu propósito.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
    {
      img: Terapeuta8,
      title: "Tarot Predictivo y/o Terapia con Oráculos",
      terapeuta: "Paola Quintero",
      terapeuta_id: 11,
      description:
        "Cuenta la leyenda que Odín, buscando la sabiduría, se sacrifica y de su sangre brotan las runas. Estas, además de ser un alfabeto, son un oráculo con mensajes poderosos que te guiarán en tu camino. La lectura de runas es una herramienta de autoconocimiento y orientación que te permite comprender tu presente, explorar el pasado y vislumbrar el futuro, obteniendo claridad para tomar decisiones importantes. ¿Te sientes agotado/a sin mayor razón? ¿Cansado/a de atraer situaciones y personas tóxicas a tu vida? ¿Sientes que tus caminos están cerrados en el amor, el dinero y la salud? ¿No logras dormir bien por las noches o te despiertas con pesadillas? ¿Sientes presencias extrañas en tu hogar u oficina? ¿Estás irritable y tienes cambios bruscos de humor? ¡Está es la Terapia adecuada para ti! Es un proceso de sanación profunda que elimina bloqueos energéticos, entidades negativas y energías de baja vibración que afectan tu bienestar físico, emocional y espiritual, restaurando tu armonía y vitalidad.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },

    {
      img: creadorVirtual,
      title: "Regresión",
      terapeuta: "Alice Basay",
      terapeuta_id: 10, // Asumiendo que este es el ID de Alice Basay
      description: "Correo de Prueba.",
      precio: 16000,
      opciones: [{ sesiones: 1, precio: 16000 }],
    },
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

  const confirmarReserva = (
    fechaHora: Date,
    nombreCliente: string,
    telefonoCliente: string
  ) => {
    if (!reservaPendiente) return;

    const reserva: Reserva = {
      id: Date.now(),
      servicio: "Spa Principal",
      especialidad: reservaPendiente.terapia,
      fecha: fechaHora.toISOString().split("T")[0],
      hora: fechaHora.toTimeString().split(" ")[0].substring(0, 5),
      precio: reservaPendiente.precio,
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      terapeuta: reservaPendiente.terapeutaNombre,
      terapeutaId: reservaPendiente.terapeutaId,
      sesiones: 1,
      cantidad: 1,
    };

    addToCart(reserva);
    alert(
      `Reserva agregada: ${reserva.servicio} el ${reserva.fecha} a las ${reserva.hora}. Te contactaremos al ${reserva.telefonoCliente}.`
    );
    setReservaPendiente(null);
  };

  const terapeutaSeleccionadoDisponibilidad = reservaPendiente
    ? getDisponibilidadForTerapeuta(reservaPendiente.terapeutaNombre)
    : undefined;

  // Renderizado condicional si hay un error
  if (error) {
    return <div className="text-red-500 text-center mt-20">Error: {error}</div>;
  }

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
                      t.opciones.map((op: OpcionSesion, j: number) => (
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
                          className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700"
                        >
                          {op.sesiones} Sesión (${op.precio.toLocaleString()}{" "}
                          CLP)
                        </button>
                      ))
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
                        className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700"
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
