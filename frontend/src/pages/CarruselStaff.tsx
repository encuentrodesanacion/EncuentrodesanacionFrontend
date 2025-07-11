import "../styles/flipCards.css"; // Asegúrate de tener los estilos aquí o adaptarlos a Tailwind

import terapeuta3 from "../assets/Terapeuta3.jpg";
import terapeuta8 from "../assets/Terapeuta8.jpg";
import terapeuta1 from "../assets/Terapeuta1.jpg";
import terapeuta11 from "../assets/Terapeuta11.jpeg";
import terapeuta7 from "../assets/Terapeuta7.jpg";
import terapeuta6 from "../assets/Terapeuta6.jpg";
import terapeuta13 from "../assets/Terapeuta13.jpeg";
import terapeuta19 from "../assets/Terapeuta19.jpeg";
import terapeuta14 from "../assets/Terapeuta14.jpeg";
import terapeuta18 from "../assets/Terapeuta18.jpeg";
import terapeuta20 from "../assets/Terapeuta20.jpeg";
import terapeuta12 from "../assets/Terapeuta12.jpeg";
import terapeuta17 from "../assets/Terapeuta17.jpeg";
import terapeuta5 from "../assets/Terapeuta5.jpg";
import terapeuta16 from "../assets/Terapeuta16.jpeg";
const alianzas = [
  {
    nombre: "Monica Gatica",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta3,
    descripcion:
      "Mónica Gatica: Terapeuta Holística Integrativa, especializada en el acompañamiento de procesos de sanación energética y empoderamiento personal. A través de herramientas como la Cruz de Ankh, el Péndulo Hebreo, la Radiestesia, la Canalización, Tameana, el Tarot y la armonización con frecuencias, facilita espacios de transformación profunda. Además, comparte su conocimiento a través de cursos y talleres, brindando a otros la oportunidad de explorar el mundo energético y aplicar estas técnicas en su vida.",
  },
  {
    nombre: "Macarena Del Río",
    url: "https://www.instagram.com/templo.sirio/",
    imagen: terapeuta6,
    descripcion:
      "Macarena del Río: Maestría en Reiki Usui, Registros Akáshicos, Maestría Reiki Seichim Sekhem y Horus, Canalización de la Rosa, Terapia con Cruz de Ankh, Orquídeas del Amazonas, Constelaciones Familiares, Lógica Biológica del Síntoma, Regresiones, Programación Neurolingüística, Alquimia Egipcia, Extracción de Almas Perdidas y Recuperación del Alma, Tarot Egipcio, Tarot Osho Zen, Diplomado en Metafísica, El Cerebro como Aliado (Neurociencia), Neurociencia Maternal.",
  },
  {
    nombre: "Paulina Villablanca Perez",
    url: "https://www.instagram.com/gotitasdeamor38/",
    imagen: terapeuta11,
    descripcion:
      "Paulina Villablanca: Educadora de párvulos, Terapeuta Holística integral, Terapeuta floral (especializada en niños, niñas, adolescentes y neurodiversidad), Consteladora familiar (individual y grupal), Sanadora de heridas de infancia, Tarotista (predictiva y terapéutica).",
  },
  {
    nombre: "Ana Luisa Solervicens",
    url: "https://www.instagram.com/susurro_ancestralcl/",
    imagen: terapeuta14,
    descripcion:
      "Ana Luisa: fundadora de Susurro Ancestral. Soy terapeuta holística y artesana del alma, guiada por la sabiduría ancestral y la energía de la naturaleza. A través de terapias energéticas, oráculos y rituales, acompaño a quienes buscan reconectar con su esencia, sanar desde lo profundo y abrir caminos de armonía y abundancia. Mi amor por lo sagrado también se expresa en cada vela que creo: piezas únicas cargadas de intención, cuarzos, hierbas y colores que equilibran cuerpo, mente y espíritu. Cada creación está diseñada para ser un susurro de luz en tu camino. Creo en la magia que habita en lo simple, en la fuerza de los rituales cotidianos y en el poder transformador del amor propio. Mis terapias son: lectura de runas, oráculo Ogham, Gemoterapia, Radiestesia y Radiónica. Además, realizo trabajos de limpieza, armonización y velomancia. Te invito a compartir este viaje de sanación, creación y reconexión.",
  },
  {
    nombre: "Brenda Rivas",
    url: "https://www.instagram.com/trazos_del_alma2024/",
    imagen: terapeuta1,
    descripcion:
      "Brenda Rivas: En mi trayectoria en el campo de la salud, evidencié cómo las patologías o padecimientos físicos constituían el pilar en los cuidados de enfermería, restando importancia al cuerpo energético. Por lo que me interesé en el estudio de la biodecodificación emocional, llevándome a profundizar en la filosofía holística, tratando así al paciente en su totalidad: espíritu, alma y cuerpo. Las Terapias holísticas que realizo son : Canalización energética - Apertura de Registros Akáshicos - Lectura del Tarot Rider Waite - Lectura del Oráculo Angelical - Lectura del Oráculo de Vidas Pasadas - Consulta de Runas Vikingas - Reiki Unitario - Reiki Angelical",
  },
  {
    nombre: "Sandra Da Silva",
    url: "https://www.instagram.com/serendipiall/",
    imagen: terapeuta5,
    descripcion:
      "Sandra Da Silva: Terapeuta Holistica Integral. Mi conexión con el mundo Holistico inició para superar un proceso emocional personal, profundizando en distintas herramientas en las que me apoye para sanar y ahora pongo al servicio del bienestar de quien lo requiera: Terapia de Respuesta Espiritual - Purificación y Limpieza de Energías Negativas - Sanacion con Péndulo Hebreo - Liberación de Implantes - Sanacion Energética con Cruz de Anhk - Conexión Angelical. Mi propósito es brindarles un canal de expansión que les permita sanar desde la consciencia de lo vivido y conectar con su Plan de Alma original.",
  },
  {
    nombre: "Paola Quintero",
    url: "https://www.instagram.com/olas.de.sanacion/",
    imagen: terapeuta8,
    descripcion:
      "Paola Quintero : Terapeuta del alma. Acompaño procesos de sanación a través del tarot, la cafeomancia, la astrología evolutiva y las constelaciones familiares. Trabajo con los ancestros, honro la tribu y creo espacios donde lo sagrado femenino puede florecer.",
  },
  {
    nombre: "Fabiola Valenzuela",
    url: "https://www.instagram.com/espacio_hija_de_la.luz/",
    imagen: terapeuta7,
    descripcion:
      "Fabiola Valenzuela: Hola, hermosa alma.  Me encuentro en este plano viviendo mi propósito de ayudarte a recordar tu verdadera esencia a través de diferentes terapias holísticas que te ayudarán y guiarán en las diferentes áreas de tu vida; y también con talleres y cursos online para empoderarte y que puedas también servir al amor. Mis terapias son: Cirugía Astral con Anubis Limpieza con Cruz Ankh Multisistemas de Reiki (Lunar, Usui, Kundalini, Money, Ancestral y otros) Sanación Angelical Mesa Ganesha Prosperidad Lecturas de Tarot Terapéutico Registros Akáshicos",
  },
  {
    nombre: "Marlene Ramírez",
    url: "https://www.instagram.com/union.espiritual/",
    imagen: terapeuta19,
    descripcion:
      "Marlene Ramírez: Terapeuta Integral en niños y adultos. Llevo 8 años de experiencia en distintas terapias complementarias. Mis terapias son las siguientes: Reiki (distintos estilos), Liberación de Emociones Atrapadas, Lectura de Tarot Osho, Constelaciones Familiares y Ancestrología, Terapia Kármica y Corte de Lazos, Mesas Radiónicas, Alineación de Chacras con Péndulo y Gemoterapia, Tameana, Limpiezas Energéticas (casa y persona), Angoterapia, Registros Akáshicos (normales y angelicales).",
  },

  {
    nombre: "Viviana Espinoza",
    url: "https://www.instagram.com/sanacion_munay/",
    imagen: terapeuta18,
    descripcion:
      "Viviana Espinoza: Consteladora Familiar Individual Con dos años de experiencia acompañando en el proceso de Sanación a consultantes presencial y online desde la comuna de Colina-Santiago, Chile. Estudios de Cirugía Astral y Reiki Usui nivel 1.",
  },
  {
    nombre: "Ema Iriarte",
    url: "https://www.instagram.com/amatistadelalmamujermedicina/",
    imagen: terapeuta20,
    descripcion:
      "Ema Iriarte: Tengo 15 años en este bello mundo holístico y soy Maestra de Reiki de varios sistemas; consteladora; terapeuta floral; canalizadora. Practico círculo de mujeres, medicina de cacao, soy mujer medicina.",
  },
  {
    nombre: "Katalina Rencoret",
    url: "https://www.instagram.com/matices_de_gris/",
    imagen: terapeuta12,
    descripcion:
      "Katalina Rencoret: ¡Hola! Mi nombre es Katalina (si, con K) Rencoret. Puedes decirme Kata, Matiz o Matices como mi Instagram, Soy muy joven; sin embargo, cuento con mucha experiencia como terapeuta, ya que me inicié en este mundo aproximadamente a los 14 años, cuando encontré el tarot de mi abuela trascendida. En ese momento, el tarot se convirtió en una extensión de mí, un reflejo de quién fui y quién soy. Actualmente soy maestra en Reiki Usui, radiónica, en armonización de aura y alineación de chakras. Además de ello, soy profesora de Castellano y en el taller -Escribir desde las raíces: Tarot y memoria ancestral- puedo mezclar mis dos grandes amores: la escritura y la sanación. Deseo expandir este amor por la espiritualidad y acompañarte en tu proceso personal de aprendizaje, sanación y camino de luz ¡Espero nos veamos pronto!",
  },
  {
    nombre: "Johana Miranda",
    url: "https://www.instagram.com/johana.e.munoz/",
    imagen: terapeuta17,
    descripcion:
      "Johana Miranda Muñoz: Mi don es ver más allá de lo superficial, a través del alma. Mi misión es ayudarte a sanar en todos los niveles: mente, cuerpo y espíritu, Para Lo Cual Te Ofrezco Diversas Terapias: *Clarividencia *Terapéutica: *Velomancia *Radiónica Y Radiestesia *Radiónica Bajada De Peso",
  },

  {
    nombre: "Gabriel Moreno",
    url: "https://www.instagram.com/biomagnetismo558/",
    imagen: terapeuta16,
    descripcion:
      "Experto en Bioenergía desde hace 30 años, dictando formación de Terapeutas en Argentina, México, Chile, astrólogo, y profesor de meditación desde hace 35 años",
  },
  {
    nombre: "Rosa Santimone",
    url: "https://www.instagram.com/rosasantimone/",
    imagen: terapeuta13,
    descripcion:
      "Rosa Santimone: Terapeuta holística. A través de un enfoque integral, te ofrezco diversas herramientas para sanar, equilibrar y potenciar tu vida: REIKI USUI, TAROT TERAPÉUTICO, PÉNDULO HEBREO, RUEDA DE LA VIDA. ¡Permíteme acompañarte para iniciar este viaje de transformación!",
  },
];

const CarruselStaff = () => {
  return (
    <section className="bg-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-700">
        Staff Terapéutico
      </h2>
      <div className="flip-wrapper-container">
        {alianzas.map(({ nombre, url, imagen, descripcion }, index) => (
          <div className="flip-wrapper" key={index}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flip-card"
            >
              <div className="flip-front">
                <img src={imagen} alt={`Imagen de ${nombre}`} />
              </div>
              <div className="flip-back">
                <p className="font-semibold mb-2"></p>
                <p className="text-sm">{descripcion}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarruselStaff;
