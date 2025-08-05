import "../styles/flipCards.css"; // Asegúrate de tener los estilos aquí o adaptarlos a Tailwind

import terapeuta23 from "../assets/Terapeuta23.jpeg";
import terapeuta11 from "../assets/Terapeuta11.jpeg";
import terapeuta6 from "../assets/Terapeuta6.jpg";
import terapeuta14 from "../assets/Terapeuta14.jpeg";
import terapeuta24 from "../assets/Terapeuta24.jpeg";
import terapeuta5 from "../assets/Terapeuta5.jpg";
import terapeuta1 from "../assets/Terapeuta1.jpg";

const alianzas = [
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
      "Ana Luisa: Fundadora de Susurro Ancestral. Soy terapeuta holística y artesana del alma, guiada por la sabiduría ancestral y la energía de la naturaleza. A través de terapias energéticas, oráculos y rituales, acompaño a quienes buscan reconectar con su esencia, sanar desde lo profundo y abrir caminos de armonía y abundancia. Mi amor por lo sagrado también se expresa en cada vela que creo: piezas únicas cargadas de intención, cuarzos, hierbas y colores que equilibran cuerpo, mente y espíritu. Cada creación está diseñada para ser un susurro de luz en tu camino. Creo en la magia que habita en lo simple, en la fuerza de los rituales cotidianos y en el poder transformador del amor propio. Mis terapias son: lectura de runas, oráculo Ogham, Gemoterapia, Radiestesia y Radiónica. Además, realizo trabajos de limpieza, armonización y velomancia. Te invito a compartir este viaje de sanación, creación y reconexión.",
  },
  {
    nombre: "Veronica Chaparro",
    url: "https://www.instagram.com/ver.me.ser/",
    imagen: terapeuta23,
    descripcion:
      "Verónica Chaparro: una apasionada de la vida con 30 años de experiencia como Coach de Vida y Mentora Espiritual. Mi propósito es acompañar a las personas en su despertar espiritual a través de una práctica integral. Como Profesora de Yoga y Terapeuta Holística, mis sesiones y clases combinan diversas herramientas de sanación y crecimiento. Entre mis especialidades se encuentran la Biodanza, la Biodescodificación, las Constelaciones Familiares y las Barras de Access Consciousness. Además, soy Acompañante de Un Curso de Milagros y realizo Psicoterapia de Un Curso de Milagros, guiando a mis clientes a encontrar la paz interior y vivir con propósito. Mi mayor habilidad es escuchar y guiar con empatía, creando un espacio seguro para tu transformación.",
  },
  {
    nombre: "Brenda Rivas",
    url: "https://www.instagram.com/trazos_del_alma2024/",
    imagen: terapeuta1,
    descripcion:
      "Brenda Rivas: En mi trayectoria en el campo de la salud, evidencié cómo las patologías o padecimientos físicos constituían el pilar en los cuidados de enfermería, restando importancia al cuerpo energético. Por lo que me interesé en el estudio de la biodecodificación emocional, llevándome a profundizar en la filosofía holística, tratando así al paciente en su totalidad: espíritu, alma y cuerpo. Las Terapias holísticas que realizo son : Canalización energética - Apertura de Registros Akáshicos - Lectura del Tarot Rider Waite - Lectura del Oráculo Angelical - Lectura del Oráculo de Vidas Pasadas - Consulta de Runas Vikingas - Reiki Unitario - Reiki Angelical",
  },
  {
    nombre: "Montserrat Méndez López",
    url: "https://www.instagram.com/amara_esencia/",
    imagen: terapeuta24,
    descripcion:
      "Docente y terapeuta holística, Mujer Medicina, especializada en Biodecodificación, Numerología, Armonización Energética, Aromaterapia, Tantra y Sexualidad Integral. Como Mujer Medicina, sostengo y transmito saberes ancestrales de sanación, combinando herramientas espirituales y naturales para acompañar procesos de transformación personal. Actúo como puente entre lo visible y lo invisible, guiando a las personas hacia el equilibrio de su cuerpo, mente y espíritu. Acompaño procesos de autoconocimiento y desarrollo integral, abordando el bienestar desde lo emocional, espiritual y energético. Mi labor integra el conocimiento ancestral con técnicas contemporáneas, creando experiencias terapéuticas que promueven la armonización, la liberación de bloqueos y la reconexión con la esencia más auténtica de cada ser.",
  },
  {
    nombre: "Sandra Da Silva",
    url: "https://www.instagram.com/serendipiall/",
    imagen: terapeuta5,
    descripcion:
      "Sandra Da Silva: Terapeuta Holistica Integral. Mi conexión con el mundo Holistico inició para superar un proceso emocional personal, profundizando en distintas herramientas en las que me apoye para sanar y ahora pongo al servicio del bienestar de quien lo requiera: Terapia de Respuesta Espiritual - Purificación y Limpieza de Energías Negativas - Sanacion con Péndulo Hebreo - Liberación de Implantes - Sanacion Energética con Cruz de Anhk - Conexión Angelical. Mi propósito es brindarles un canal de expansión que les permita sanar desde la consciencia de lo vivido y conectar con su Plan de Alma original.",
  },

  {
    nombre: "Rosa Santimone",
    url: "https://www.instagram.com/rosasantimone/",
    imagen: terapeuta24,
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
