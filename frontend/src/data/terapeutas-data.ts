// Importaciones de imágenes
import TerapeutaPlaceholder from "../assets/ASTRONAUTA3.png";
import alicc from "../assets/alicc.jpg";
import elevacion from "../assets/elevacionenergia.png";
// Puedes importar otras imágenes específicas de terapeutas aquí

import abundancia1 from "../assets/abundancia1.png";
import creadordigital from "../assets/Yunivers.jpeg";
import tameana from "../assets/Tameanani.png";
import sanando from "../assets/Sanando.jpg";
import { TerapiaItem, Terapeuta } from "../types/index";
import alicec from "../assets/Cocrea.jpeg";

export const terapeutasData: Terapeuta[] = [
  // {
  //   id: 10,
  //   nombre: "Este podrias ser tu",
  //   email: "de.serendipia@gmail.com",
  //   imagenPerfil: TerapeutaPlaceholder, // Reemplaza con la imagen real
  //   callToActionTextCard:
  //     "Muestra al mundo tu esencia. EncuentroFácil no es solo una plataforma de reserva; es una vitrina para tu misión y un espacio diseñado para que tu mensaje, por único que sea, llegue a la audiencia que te está buscando.",

  //   servicios: [
  //     {
  //       img: elevacion,
  //       title: "Elevación de energía vital",
  //       terapeuta: "Tu servicio",
  //       terapeuta_id: 10,
  //       description:
  //         "¿Estás agotado y frustrado de que tu cansancio te robe las mejores oportunidades, dejándote sin la energía vital que necesitas para crear la vida que deseas? En este ciclo de 3 noches, no solo sentirás alivio, sino que recuperarás la frecuencia de tu luz y la claridad mental para que puedas romper el ciclo de fatiga y vivir en un estado de vitalidad y enfoque. Esto es posible porque, a través de una re-calibración energética profunda, mi método garantiza la limpieza de la densidad y la rápida recarga de tu sistema, devolviéndote a tu centro en tan solo 3 sesiones.",

  //       precio: 65000,
  //       isDisabled: false,
  //       opciones: [{ sesiones: 1, precio: 65000 }],
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   nombre: "Paulina Villablanca",
  //   email: "paulina@email.com",
  //   imagenPerfil: terapeuta11, // Reemplaza con la imagen real
  //   callToActionTextCard: "Paulina ofrece jajakjsajkskj",
  //   servicios: [
  //     {
  //       img: sentido,
  //       title: "Dime cómo naciste, y te diré quién eres",
  //       terapeuta: "Paulina Villablanca",
  //       terapeuta_id: 2,
  //       description: "Descubramos tu proyecto Sentido...",

  //       precio: 10000,
  //       isDisabled: false,
  //       opciones: [{ sesiones: 1, precio: 10000 }],
  //     },
  //     {
  //       img: sanando,
  //       title: "Sanando mis heridas de infancia",
  //       terapeuta: "Paulina Villablanca",
  //       terapeuta_id: 2,
  //       description: "Sientes que tuviste una infancia difícil...",
  //       precio: 10000,
  //       isDisabled: false,
  //       opciones: [{ sesiones: 1, precio: 10000 }],
  //     },
  //   ],
  // },
  {
    id: 12,
    nombre: "Creador Virtual",
    email: "rosa@email.com",
    imagenPerfil: creadordigital,
    callToActionTextCard:
      "Este podrías ser tú muestra al mundo tu esencia. EncuentroFácil no es solo una plataforma de reserva; es una vitrina para tu misión y un espacio diseñado para que tu mensaje, por único que sea, llegue a la audiencia que te está buscando.",
    servicios: [
      {
        img: TerapeutaPlaceholder,
        title: "Servicios Digitales",
        terapeuta: "a",
        terapeuta_id: 12,
        description:
          "Asesoramiento Técnico Personalizado: Resuelve tus dudas sobre plataformas web y software para que la tecnología no sea una barrera, sino un aliado.",

        precio: 170000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 170000 }],
      },
      // {
      //   img: TerapeutaPlaceholder,
      //   title: "Todos los servicios",
      //   terapeuta: "Creador Digital",
      //   terapeuta_id: 12,
      //   description:
      //     "Aquí están todos los servicios disponibles de Creador Digital.",
      //   precio: 15000,
      //   isDisabled: false,
      //   opciones: [{ sesiones: 1, precio: 15000 }],
      // },
    ],
  },
  {
    id: 10,
    nombre: "Alice Basay",
    email: "de.serendipia@gmail.com",
    imagenPerfil: alicc, // Reemplaza con la imagen real
    callToActionTextCard:
      "Te guío a manifestar riqueza sostenible. Como Maestra Pleyadiana de Abundancia, desbloqueo tu Energía Vital a nivel de ADN para que el flujo de prosperidad sea constante y alegre.",
    enlaceMeet: "https://meet.google.com/xyz-abc-123",
    recursos: [
      {
        name: "Código de Esencia: Desbloquea la Confianza y el Propósito Único.",
        url: "https://url-a-tu-servidor.com/documentos/guia-meditacion.pdf",
      },
      {
        name: "Ver Video: Preparación para Sesión",
        url: "https://youtube.com/video-de-preparacion",
      },
      {
        name: "Preguntas Frecuentes",
        url: "https://encuentrodesanacion.com/faq",
      },
    ],
    servicios: [
      {
        img: elevacion,
        title: "Elevación de energía vital",
        terapeuta: "Alice Basay",
        terapeuta_id: 10,
        description:
          "¿Estás agotado y frustrado de que tu cansancio te robe las mejores oportunidades, dejándote sin la energía vital que necesitas para crear la vida que deseas? En este ciclo de 3 noches, no solo sentirás alivio, sino que recuperarás la frecuencia de tu luz y la claridad mental para que puedas romper el ciclo de fatiga y vivir en un estado de vitalidad y enfoque. Esto es posible porque, a través de una re-calibración energética profunda, mi método garantiza la limpieza de la densidad y la rápida recarga de tu sistema, devolviéndote a tu centro en tan solo 3 sesiones.",

        precio: 65000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 65000 }],
      },
      {
        img: tameana,
        title: "Tameana niños",
        terapeuta: "Alice Basay",
        terapeuta_id: 10,
        description:
          "¿Estás preocupado/a de que tu hijo/a no logre conectar con su potencial único, o sientes que tus heridas de infancia te siguen limitando hoy? En este proceso de 3 sesiones, tu hijo/a (o tu niño/a interior) no solo sentirá calma, sino que potenciará sus dones, habilidades y fortalezas con total confianza, abriendo sus propios caminos para ser y hacer exactamente lo que vino a realizar. Esto es posible gracias a una Terapia de Alta Vibración canalizada enfocada en la esencia pura del alma, garantizando la activación de su potencial y la sanación de las memorias de dolor de la infancia, creando un futuro de mayor plenitud, seguridad y propósito.",
        precio: 150000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 150000 }],
      },
      {
        img: abundancia1,
        title: "Manifestación del dinero",
        terapeuta: "Alice Basay",
        terapeuta_id: 10,
        description:
          "¿Estás cansado de esforzarte y sentir que el dinero se escapa, como si un bloqueo invisible impidiera la riqueza que mereces? Este Protocolo de 4 Noches te transformará en el imán de abundancia que estás destinado a ser, haciendo que la prosperidad fluya hacia ti con facilidad y de forma sostenible. Esto es posible porque iniciamos con una Elevación de Energía Vital para limpiar tu sistema y prepararlo para la alta frecuencia, seguido por tres noches de re-calibración profunda y focalizada en eliminar toda resistencia y anclar tu máximo merecimiento financiero.",
        precio: 115000,
        isDisabled: false,
        opciones: [{ sesiones: 3, precio: 115000 }],
      },
    ],
  },
  // Añade más terapeutas y sus servicios aquí
];
