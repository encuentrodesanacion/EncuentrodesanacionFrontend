import TerapeutaPlaceholder from "../assets/ASTRONAUTA3.png";
import yuniver from "../assets/Alquimia.jpeg";
import yuniver2 from "../assets/tarotter.jpg";
import alicc from "../assets/alicc.jpg";
import caro from "../assets/caro.jpg";
import paulina from "../assets/paulina.png";
import constelacion from "../assets/Constelacionfam.png";
import tarot from "../assets/tarott.png";
import espejo from "../assets/Espej.png";
import lea from "../assets/Lea.png";
import constfam from "../assets/Constfam.png";
import constfam1 from "../assets/constfamgrup.png";
import nataly from "../assets/nataly.png";
import horoscopo from "../assets/horoscopo.png";
import Carta from "../assets/horoscopo.png";
import arteterapia from "../assets/arteterapia.png";
import cote from "../assets/cote.png";
import liberar from "../assets/liberar.png";
import Reset from "../assets/reset.png";
import ansiedad from "../assets/ansiedad.png";
import claudiad from "../assets/claudiad.png";
import tre from "../assets/tre.png";
import lazo from "../assets/lazo.png";
import terapgrupo from "../assets/terapgrupo.png";
import gaby from "../assets/gaby.jpeg";
import rehab from "../assets/gaby.png";
import vago from "../assets/vago.png";
import piso from "../assets/piso.png";
import cindy from "../assets/cindy.png";
import vortex from "../assets/vortex.png";
import liberacion from "../assets/liberacion.png";
import brenda from "../assets/brenda.png";
import trazos from "../assets/trazos.png";
import relajacion from "../assets/relajacion.png";
import bach from "../assets/bach.png";
import yogar from "../assets/yogar.png";
import fernanda from "../assets/fernanda.png";
import lecturareg from "../assets/lecturareg.png";
import tarotter from "../assets/tarotter.jpg";
import limpiezaener from "../assets/limpiezaener.png";
import constel from "../assets/constel.png";
import clau from "../assets/clau.png";
import taller from "../assets/poderb.png";
import counseling from "../assets/couselin.png";
import carolinaef from "../assets/carito ef.png";
// import caro from "../assets/caro.jpg";
// import caro from "../assets/caro.jpg";
// import caro from "../assets/caro.jpg";
import elevacion from "../assets/elevacionenergia.png";

import abundancia1 from "../assets/abundancia1.png";
import analuisa from "../assets/analuisa.jpg"
import annete from "../assets/Annete.jpg"
import tameana from "../assets/Tameanani.png";
import lecturarunas from "../assets/LecturaRunas.jpeg";
import sonoterapia from "../assets/Sonoterapia.png";
import { TerapiaItem, Terapeuta } from "../types/index";
import alicec from "../assets/Cocrea.jpeg";

export const terapeutasData: Terapeuta[] = [
  // ==========================================
  // PERFILES ELITE
  // ==========================================
  {
    id: 1,
    nombre: "Claudia Ibarra",
    email: "cibarraari@gmail.com",
    imagenPerfil: clau,
    callToActionTextCard:
      "Sanar no es solo aliviar el dolor, es rediseñar el lugar donde habita tu alma. Con más de una década de experiencia acompañando procesos humanos...",
    servicios: [
      {
        img: constel,
        title: "Constelaciones del Alma",
        terapeuta: "Claudia Ibarra",
        terapeuta_id: 1,
        description: "CONSTELACIONES DEL ALMA – HONRANDO LOS HILOS PARA TRANSFORMAR TU DESTINO...",
        precio: 58000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 58000 }],
      },
      {
        img: liberar,
        title: "El Poder de la Diosa 2026",
        terapeuta: "Claudia Ibarra",
        terapeuta_id: 1,
        description: "El Poder de la Diosa: Tu Potencial Femenino para el 2026...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: taller,
        title: "Taller El Poder Mágico de las Brujas",
        terapeuta: "Claudia Ibarra",
        terapeuta_id: 1,
        description: "¡DESPIERTA la HECHICERA QUE HAY EN TI!...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: counseling,
        title: "Counseling Terapéutico",
        terapeuta: "Claudia Ibarra",
        terapeuta_id: 1,
        description: "Counseling Terapéutico: El Diseño de tu Ruta de Sanación...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
    ],
  },
  // Paola Quintero (Pendiente de Datos)
  {
    id: 4,
    nombre: "Paulina Villablanca",
    email: "paulina@email.com",
    imagenPerfil: paulina,
    callToActionTextCard: "Si quieres resolver y sanar diversos aspectos de tu vida como son tu niñez...",
    servicios: [
      {
        img: constelacion,
        title: "Constelaciones Familiares Individuales",
        terapeuta: "Paulina Villablanca",
        terapeuta_id: 4,
        description: "Es una tecnica terapeutica para sanar conflictos emocionales...",
        precio: 24000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 24000 }],
      },
      {
        img: tarot,
        title: "Lectura Predictiva Y Terapéutica de Tarot",
        terapeuta: "Paulina Villablanca",
        terapeuta_id: 4,
        description: "A traves de esta tirada de tarot de 30 minutos...",
        precio: 20000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 20000 }],
      },
      {
        img: espejo,
        title: "Diagnostico Heridas de Infancia",
        terapeuta: "Paulina Villablanca",
        terapeuta_id: 4,
        description: "Por que es importante conocer y sanar tus heridas de infancia...",
        precio: 16000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 16000 }],
      },
    ],
  },
  {
    id: 2, // Nota: Se mantiene ID duplicado según el origen
    nombre: "Gabriela Pinto",
    email: "gabykinetre@gmail.com",
    imagenPerfil: gaby,
    callToActionTextCard:
      "Kinesiología Integral y Bienestar Consciente Mi propósito es acompañarte a redescubrir el lenguaje de tu cuerpo...",
    servicios: [
      {
        img: rehab,
        title: "Rehabilitacion Kinesica /Reconecta tu Ruta Corporal",
        terapeuta: "Gabriela Pinto",
        terapeuta_id: 2,
        description: "La terapia de Bienestar emocional consite en una primera instancia en descongestionar la mente...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: vago,
        title: "Activa tu Nervio Vago, Regula tu Estrés",
        terapeuta: "Gabriela Pinto",
        terapeuta_id: 2,
        description: "La calma en el cuerpo es la llave para regular la mente...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
      {
        img: piso,
        title: "Rehabilitación Piso Pelvico",
        terapeuta: "Gabriela Pinto",
        terapeuta_id: 2,
        description: "Acompaño y apoyo a mujeres en todas sus etapas vitales...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
    ],
  },

  // ==========================================
  // PERFILES PROFESIONALES
  // ==========================================
  {
    id: 9,
    nombre: "Fernanda Arce",
    email: "arcen.fernanda@gmail.com",
    imagenPerfil: fernanda,
    callToActionTextCard: "Fernanda Arce como Terapeuta Holística Integral guía a sus consultantes a reencontrarse con su paz interior...",
    servicios: [
      {
        img: lecturareg,
        title: "Lectura de Registros Akashicos",
        terapeuta: "Fernanda Arce",
        terapeuta_id: 9,
        description: "Reconecta con la sabiduría de tu Alma...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
      {
        img: tarotter,
        title: "Tarot Terapéutico",
        terapeuta: "Fernanda Arce",
        terapeuta_id: 9,
        description: "Respuestas para sanar. Si estás atravesando una crisis...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
      {
        img: limpiezaener,
        title: "Limpieza Energética",
        terapeuta: "Fernanda Arce",
        terapeuta_id: 9,
        description: "Libera tu carga y recupera tu equilibrio...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
    ],
  },
  {
    id: 5,
    nombre: "Brenda Rivas",
    email: "rbrenda895@gmail.com",
    imagenPerfil: brenda,
    callToActionTextCard: "Mi nombre es brenda rivas, en mi trayectoria en el campo de la salud evidencie...",
    servicios: [
      {
        img: trazos,
        title: "Canalización Energética",
        terapeuta: "Brenda Rivas",
        terapeuta_id: 5,
        description: "La canalizacion energetica es un metodo terapeutico que busca reconectar...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
    ],
  },
  {
    id: 6,
    nombre: "Cindy Palma",
    email: "cindipalma20@gmail.com",
    imagenPerfil: cindy,
    callToActionTextCard: "¿Cuánto tiempo más vas a cargar con una mochila que ni siquiera es tuya?...",
    servicios: [
      {
        img: vortex,
        title: "Vortex Aura Healing",
        terapeuta: "Cindy Palma",
        terapeuta_id: 6,
        description: "Es una terapia que se usa para limpiar, purificar...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: liberacion,
        title: "Liberación Emociones Atrapadas",
        terapeuta: "Cindy Palma",
        terapeuta_id: 6,
        description: "Con ésta herramienta te ayudo a gestionar y soltar emociones...",
        precio: 35000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 35000 }],
      },
      {
        img: horoscopo,
        title: "Horóscopo Chino",
        terapeuta: "Cindy Palma",
        terapeuta_id: 6,
        description: "El Horóscopo colabora en la revisión de ciclos del propio vivir...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
    ],
  },
  {
    id: 7,
    nombre: "Claudia Diaz",
    email: "dcclaudia21@gmail.com",
    imagenPerfil: claudiad,
    callToActionTextCard: "Soy Claudia Díaz Catalán, docente y terapeuta en Terapia de Respuesta Espiritual...",
    servicios: [
      {
        img: tre,
        title: "Terapia de Respuesta Espiritual",
        terapeuta: "Claudia Diaz",
        terapeuta_id: 7,
        description: "¿Sientes cansancio, bloqueos o confusión sin una causa clara?...",
        precio: 35000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 35000 }],
      },
      {
        img: lazo,
        title: "Cortar Lazos Familiares, Lealtades Ancestrales y Lazos Kármicos",
        terapeuta: "Claudia Diaz",
        terapeuta_id: 7,
        description: "¿Sientes lazos que te atan o limitan o situaciones que te drenan y no logras soltar?...",
        precio: 35000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 35000 }],
      },
      {
        img: terapgrupo,
        title: "TRE: Iniciación de Proyectos",
        terapeuta: "Claudia Diaz",
        terapeuta_id: 7,
        description: "¿Tu grupo, equipo o proyecto está estancado o con tensiones invisibles?...",
        precio: 35000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 35000 }],
      },
    ],
  },
  {
    id: 8,
    nombre: "Maria José Corvalán",
    email: "mariajose.cp.flga@gmail.com",
    imagenPerfil: cote,
    callToActionTextCard: "Soy María José, fonoaudióloga, coach y terapeuta, acompaño a personas...",
    servicios: [
      {
        img: liberar,
        title: "Liberación de Creencias Limitantes",
        terapeuta: "Maria José Corvalán",
        terapeuta_id: 8,
        description: "¿Sientes que algún área de tu vida no fluye como a ti te gustaría?...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: Reset,
        title: "Reset Emocional",
        terapeuta: "Maria José Corvalán",
        terapeuta_id: 8,
        description: "¿Y si algunas emociones que no has podido soltar aún estuvieran influyendo?...",
        precio: 29000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 29000 }],
      },
      {
        img: ansiedad,
        title: "Sanación Ansiedad",
        terapeuta: "Maria José Corvalán",
        terapeuta_id: 8,
        description: "¿Sientes que la ansiedad te desconecta de tu paz y tu poder?...",
        precio: 29000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 29000 }],
      },
    ],
  },
  {
    id: 10,
    nombre: "Natalie Bonysson",
    email: "nbonysson@gmail.com",
    imagenPerfil: nataly,
    callToActionTextCard: "Te acompaño en el autoconocimiento, a través de diversas guías...",
    servicios: [
      {
        img: horoscopo,
        title: "Horóscopo Chino",
        terapeuta: "Natalie Bonysson",
        terapeuta_id: 10,
        description: "El Horóscopo colabora en la revisión de ciclos del propio vivir...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: Carta,
        title: "Carta Natal China",
        terapeuta: "Natalie Bonysson",
        terapeuta_id: 10,
        description: "La Astrología China, con su cosmovisión, permite reconocerse como parte del mundo...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
      {
        img: arteterapia,
        title: "Taller Arteterapéutico: Conectando con el Verano",
        terapeuta: "Natalie Bonysson",
        terapeuta_id: 10,
        description: "El Arte-terapia colabora con el autoconocimiento y desarrollo personal...",
        precio: 30000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 30000 }],
      },
    ],
  },
  {
    id: 11,
    nombre: "Lea Parra",
    email: "leaparra@gmail.com",
    imagenPerfil: lea,
    callToActionTextCard: "Soy consteladora familiar y acompañante en procesos de conciencia...",
    servicios: [
      {
        img: constfam,
        title: "Constelaciones Familiares",
        terapeuta: "Lea Parra",
        terapeuta_id: 11,
        description: "Las Constelaciones Familiares son una herramienta terapeutica que permite observar dinamicas...",
        precio: 34000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 34000 }],
      },
      {
        img: constfam1,
        title: "Constelaciones Familiares Grupal",
        terapeuta: "Lea Parra",
        terapeuta_id: 11,
        description: "Las Constelaciones Familiares grupales de manera presencial...",
        precio: 20000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 20000 }],
      },
    ],
  },
  {
    id: 16,
    nombre: "Karla Flores",
    email: "ckarlaflorencia5@gmail.com",
    imagenPerfil: relajacion,
    callToActionTextCard: "Terapeuta holística, estudiante de último año de Psicología y deportista...",
    servicios: [
      {
        img: relajacion,
        title: "Sesión Relajación y Reconexión",
        terapeuta: "Karla Flores",
        terapeuta_id: 16,
        description: "Actividad orientada a la promoción del bienestar integral...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
      {
        img: bach,
        title: "Terapia Esencia Flores de DR.BACH",
        terapeuta: "Karla Flores",
        terapeuta_id: 16,
        description: "Actividad terapéutica orientada al acompañamiento emocional...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
      {
        img: yogar,
        title: "Yoga Restaurativo",
        terapeuta: "Karla Flores",
        terapeuta_id: 16,
        description: "Actividad orientada a la liberación de la tensión corporal...",
        precio: 25000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 25000 }],
      },
    ],
  },

  // ==========================================
  // PERFILES BÁSICOS
  // ==========================================
  {
    id: 12,
    nombre: "Ana Luisa Solervicens",
    email: "analuisasr@gmail.com",
    imagenPerfil: analuisa,
    callToActionTextCard: "Soy Ana Luisa, terapeuta holística y guía en lecturas de runas ancestrales...",
    servicios: [
      {
        img: lecturarunas,
        title: "Lectura de Runas",
        terapeuta: "Ana Luisa Solervicens",
        terapeuta_id: 12,
        description: "La lectura de runas es una práctica milenaria de origen nórdico...",
        precio: 18000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 18000 }],
      },
    ],
  },
  {
    id: 15,
    nombre: "Annette Wanninger",
    email: "anettewanninger@gmail.com",
    imagenPerfil: annete,
    callToActionTextCard: "Soy de Alemania y vivio en Chile desde hace 8 años...",
    servicios: [
      {
        img: sonoterapia,
        title: "Sonoterapia con meditación",
        terapeuta: "Annette Wanninger",
        terapeuta_id: 15,
        description: "La sonoterapia es un método médico holístico y alternativo...",
        precio: 16000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 16000 }],
      },
    ],
  },
  {
    id: 13,
    nombre: "Carolina Jiménez",
    email: "caje77@hotmail.com",
    imagenPerfil: caro,
    callToActionTextCard: "Cuenta Conmigo para encontrar, desde tu yo interior y desde tu realidad actual...",
    servicios: [
      {
        img: carolinaef, // Mantiene la referencia original de la imagen
        title: "Recupera tu Poder",
        terapeuta: "Carolina Jiménez",
        terapeuta_id: 13,
        description: "La terapia de Bienestar emocional consite en una primera instancia en descongestionar la mente...",
        precio: 40000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 40000 }],
      },
    ],
  },

  // ==========================================
  // ELEMENTOS COMENTADOS (Alice Basay)
  // ==========================================
  // {
  //   id: 17,
  //   nombre: "Alice Basay",
  //   ... (Contenido mantenido bajo comentario tal como solicitó)
  // }
];