import "../styles/flipCards.css"; // Asegúrate de tener los estilos aquí o adaptarlos a Tailwind

import marcela from "../assets/marcela.jpeg";
import terapeuta11 from "../assets/Terapeuta11.jpeg";
import sanchez from "../assets/sanchez.jpeg";
import terapeuta14 from "../assets/Terapeuta14.jpeg";
import crisol from "../assets/crisol.jpeg";
import sarita from "../assets/sarita.jpeg";
import renata from "../assets/renata.jpeg";
import terapeuta5 from "../assets/Terapeuta5.jpg";
import terapeuta1 from "../assets/Terapeuta1.jpg";

const alianzas = [
  {
    nombre: "Paulina Villablanca Perez",
    url: "https://www.instagram.com/gotitasdeamor38/",
    imagen: terapeuta11,
    descripcion:
      "Paulina Villablanca: Educadora de párvulos, Terapeuta Holística integral, Terapeuta floral (especializada en niños, niñas, adolescentes y neurodiversidad), Consteladora familiar (individual y grupal), Sanadora de heridas de infancia, Tarotista (predictiva y terapéutica).",
  },
  {
    nombre: "Marcela Cabezas",
    url: "https://www.instagram.com/marceterapeuta.cl/",
    imagen: marcela,
    descripcion:
      "Desde muy pequeña sentí una gran empatía por las personas que sufrían en silencio, me apasionaba entender el motivo de sus dificultades y poder ayudarlas de alguna manera. En muchos momentos de mi vida, ayudé sin saberlo, me daba cuenta cuando recibía su agradecimiento y me llenaba de paz. Cuando me empecé a formar cómo terapeuta, entendí que soy un canal para las personas y que esto, es lo que me apasiona",
  },
  {
    nombre: "Ana Luisa Solervicens",
    url: "https://www.instagram.com/susurro_ancestralcl/",
    imagen: terapeuta14,
    descripcion:
      "Ana Luisa: Fundadora de Susurro Ancestral. Soy terapeuta holística y artesana del alma, guiada por la sabiduría ancestral y la energía de la naturaleza. A través de terapias energéticas, oráculos y rituales, acompaño a quienes buscan reconectar con su esencia, sanar desde lo profundo y abrir caminos de armonía y abundancia. Mi amor por lo sagrado también se expresa en cada vela que creo: piezas únicas cargadas de intención, cuarzos, hierbas y colores que equilibran cuerpo, mente y espíritu. Cada creación está diseñada para ser un susurro de luz en tu camino. Creo en la magia que habita en lo simple, en la fuerza de los rituales cotidianos y en el poder transformador del amor propio. Mis terapias son: lectura de runas, oráculo Ogham, Gemoterapia, Radiestesia y Radiónica. Además, realizo trabajos de limpieza, armonización y velomancia. Te invito a compartir este viaje de sanación, creación y reconexión.",
  },
  {
    nombre: "Catalina Sánchez",
    url: "https://www.instagram.com/psico_cata/",
    imagen: sanchez,
    descripcion:
      "Mujer quechua, hija de profesores, criada en un hogar lleno de arte: danza, música, pintura,literatura. De profesión Psicóloga con gran vocación por la salud mental digna. Trabajo desde la metodología humanista, con perspectiva de derechos humanos. Empleando espacios de salud mental a través de las artes. Apasionada de la costura y el bordado. Bailarina desde la primera infancia. Ejecutora de talleres de Arteterapia para infancias, adolescencias y adultos.",
  },
  {
    nombre: "Crisolde Valenzuela",
    url: "https://www.instagram.com/terapias_crisol/",
    imagen: crisol,
    descripcion:
      "Más de 40 años de tarotista y terapeuta holística y canalizadora del alma, acompaño procesos de sanación emocional y espiritual como coach de vida,integrando: biomagnetismo emocional, tarot terapéutico, registros akashicos, alineación de chakras y numerología emocional. Mi propósito es guiar a cada persona hacia su renacimiento interior &quot;sanación qué nace del alma",
  },
  {
    nombre: "Sarita Infante",
    url: "https://www.instagram.com/sarita.infante.coachdelser/",
    imagen: sarita,
    descripcion:
      "Mi camino como terapeuta nació desde una búsqueda profunda: encontrar sentido, propósito y una forma de habitar la vida desde el alma. Durante años me formé como coach profesional, guiando procesos de transformación desde la mente y la acción. Sin embargo, fue en mi propio viaje interior donde comprendí que el verdadero cambio comienza cuando recordamos quiénes somos en esencia. De ese despertar nació en mí la figura de Coach del SER: un acompañamiento que va más allá de las palabras, donde la escucha se vuelve sagrada y cada encuentro es un portal de reconexión con la verdad interior. Mi labor no es “arreglar” a nadie, sino sostener el espacio para que cada alma pueda recordar su luz, su poder y su camino. Trabajo desde la presencia amorosa, la sensibilidad y la energía como lenguaje sutil. Creo en el poder de los procesos que honran la emoción, la intuición y la conexión con lo divino que habita en cada ser. “No vine a enseñar… vine a recordar contigo lo que ya habita en tu alma.",
  },
  {
    nombre: "Renata Santoro",
    url: "https://www.instagram.com/aprendeasanarte/",
    imagen: renata,
    descripcion:
      "Comencé realizando mi práctica profesional en trauma severo para el programa PRAIS en el Hospital Barros Lucos. Posteriormente, me he dedicado al área clínica de forma independiente, con especialidad en neurodivergencia (TEPT-C, TDAH, trastorno bipolar y depresión) además de otros trastornos como alimenticios y del sueño, siempre con un enfoque de género. Luego, de 15 años de experiencia, tengo las habilidades de intervención en crisis y combino mis conocimientos desde el piscoanalisis, neurociencias y medicina ancestral de nuestros pueblos originarios. “No vine a enseñar… vine a recordar contigo lo que ya habita en tu alma.",
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
];

const CarruselStaff = () => {
  return (
    <section className="bg-white py-12 px-6">
           {" "}
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-700">
                Staff Terapéutico      {" "}
      </h2>
           {" "}
      <div className="flip-wrapper-container">
               {" "}
        {alianzas.map(({ nombre, url, imagen, descripcion }, index) => (
          <div className="flip-wrapper" key={index}>
                       {" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flip-card"
            >
                           {" "}
              <div className="flip-inner">
                {" "}
                {/* Agregar flip-inner para volteo si no estaba */}             
                 {" "}
                <div className="flip-front">
                                    <img src={imagen} alt={nombre} />
                  {/* INSERCIÓN CLAVE: Overlay del nombre */}
                  <div className="nombre-overlay">
                    <p>{nombre}</p>
                  </div>
                                 {" "}
                </div>
                               {" "}
                <div className="flip-back">
                                   {" "}
                  <p className="font-semibold mb-2">{nombre}</p>{" "}
                  {/* También agregamos el nombre en el back, aunque ya debería estar implícito */}
                                    <p className="text-sm">{descripcion}</p>   
                             {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </a>
                     {" "}
          </div>
        ))}
             {" "}
      </div>
         {" "}
    </section>
  );
};

export default CarruselStaff;
