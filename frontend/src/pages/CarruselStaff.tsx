import "../styles/flipCards.css"; // Asegúrate de tener los estilos aquí o adaptarlos a Tailwind

import terapeuta3 from "../assets/Terapeuta3.jpg";
import terapeuta2 from "../assets/Terapeuta2.jpg";
import terapeuta1 from "../assets/Terapeuta1.jpg";
import terapeuta4 from "../assets/Terapeuta4.jpg";
import terapeuta5 from "../assets/Terapeuta5.jpg";
import terapeuta6 from "../assets/Terapeuta6.jpg";
import terapeuta10 from "../assets/Terapeuta10.jpeg";

const alianzas = [
  {
    nombre: "Monica Gatica",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta3,
    descripcion:
      "Mónica Gatica; Terapeuta Holística Integrativa, especializada en el acompañamiento de procesos de sanación energética y empoderamiento personal. A través de herramientas como la Cruz de Ankh, el Péndulo Hebreo, la Radiestesia, la Canalización, Tameana, el Tarot y la armonización con frecuencias, facilita espacios de transformación profunda. Además, comparte su conocimiento a través de cursos y talleres, brindando a otros la oportunidad de explorar el mundo energético y aplicar estas técnicas en su vida.",
  },
  {
    nombre: "Vanessa Henríquez",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta10,
    descripcion:
      "Vanessa Henríquez; Enfermera de profesión y terapeuta holística de corazón. Desde temprana edad, sentí una profunda conexión con el mundo espiritual y un llamado genuino a acompañar a otras personas en sus procesos de sanación y transformación. Mi propio camino de sanación me llevó a descubrir herramientas poderosas que hoy pongo al servicio de quienes buscan bienestar, equilibrio y reconexión interior. Las terapias que realizo resuenan profundamente con mi propósito: -Reiki -Limpieza de Chakras y espacios -Registros Akáshicos -Sanación del Alma con Radiestesia -Sanación del Niño Interior -Limpieza Uterina Actualmente estoy en formación como acupunturista para seguir complementando la medicina occidental con esta mirada más integral. Mi misión es ayudarte a sanar, reconectar con tu esencia y expandir tu energía.",
  },
  {
    nombre: "Monica Gatica",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta1,
    descripcion:
      "Mónica Gatica; Terapeuta Holística Integrativa, especializada en el acompañamiento de procesos de sanación energética y empoderamiento personal. A través de herramientas como la Cruz de Ankh, el Péndulo Hebreo, la Radiestesia, la Canalización, Tameana, el Tarot y la armonización con frecuencias, facilita espacios de transformación profunda. Además, comparte su conocimiento a través de cursos y talleres, brindando a otros la oportunidad de explorar el mundo energético y aplicar estas técnicas en su vida.",
  },

  {
    nombre: "Monica Gatica",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta4,
    descripcion:
      "Mónica Gatica Sandoval, Terapeuta Holística Integrativa, especializada en el acompañamiento de procesos de sanación energética y empoderamiento personal. A través de herramientas como la Cruz de Ankh, el Péndulo Hebreo, la Radiestesia, la Canalización, Tameana, el Tarot y la armonización con frecuencias, facilita espacios de transformación profunda. Además, comparte su conocimiento a través de cursos y talleres, brindando a otros la oportunidad de explorar el mundo energético y aplicar estas técnicas en su vida.",
  },
  {
    nombre: "Monica Gatica",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta6,
    descripcion:
      "Mónica Gatica Sandoval, Terapeuta Holística Integrativa, especializada en el acompañamiento de procesos de sanación energética y empoderamiento personal. A través de herramientas como la Cruz de Ankh, el Péndulo Hebreo, la Radiestesia, la Canalización, Tameana, el Tarot y la armonización con frecuencias, facilita espacios de transformación profunda. Además, comparte su conocimiento a través de cursos y talleres, brindando a otros la oportunidad de explorar el mundo energético y aplicar estas técnicas en su vida.",
  },
  {
    nombre: "Monica Gatica",
    url: "https://www.instagram.com/monicaingeborg.th/",
    imagen: terapeuta2,
    descripcion:
      "Mónica Gatica Sandoval, Terapeuta Holística Integrativa, especializada en el acompañamiento de procesos de sanación energética y empoderamiento personal. A través de herramientas como la Cruz de Ankh, el Péndulo Hebreo, la Radiestesia, la Canalización, Tameana, el Tarot y la armonización con frecuencias, facilita espacios de transformación profunda. Además, comparte su conocimiento a través de cursos y talleres, brindando a otros la oportunidad de explorar el mundo energético y aplicar estas técnicas en su vida.",
  },
  //   {
  //     nombre: "Encuentro de sanación",
  //     url: "https://www.instagram.com/encuentrodesanacion/",
  //     imagen: Encuentrodesanacion,
  //     descripcion: "Eventos de sanación y transformación. ¡Siente la energía!",
  //   },
  //   {
  //     nombre: "Tu Emprendimiento",
  //     url: "h",
  //     imagen: tuemprendimiento,
  //     descripcion: "Eventos de sanación y transformación. ¡Siente la energía!",
  //   },
  //   {
  //     nombre: "Encuentro de sanación",
  //     url: "https://www.instagram.com/encuentrodesanacion/",
  //     imagen: Encuentrodesanacion,
  //     descripcion: "Eventos de sanación y transformación. ¡Siente la energía!",
  //   },
];

const CarruselStaff = () => {
  return (
    <section className="bg-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-700">
        Staff Terapeutico
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
