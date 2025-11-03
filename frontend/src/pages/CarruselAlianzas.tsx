import Encuentrodesanacion from "../assets/Encuentrodesanacion.jpeg";
import "../styles/flipCards.css"; // Asegúrate de tener los estilos aquí o adaptarlos a Tailwind
import creadorvirtual from "../assets/creadorvirtual.jpg";
import tuemprendimiento from "../assets/tuemprendimiento.jpeg";
import TuLuz from "../assets/TuLuz.jpeg";
import Cocrea from "../assets/Cocrea.jpeg";
import Caldero from "../assets/Caldero.jpeg";
import yuniverse from "../assets/Yunivers.jpeg";
import venceraperse from "../assets/venceraperse.jpeg";

const alianzas = [
  {
    nombre: "Sahumos y Sales",
    url: "https://www.instagram.com/el.caldero.de.la.maca?igsh=MXZwcTRyMW4ydmF0Ng==",
    imagen: Caldero,
    descripcion:
      "Sumérgete en la pureza ancestral. Artículos para Sahumar y Sales. Diseñados para limpiar, purificar y armonizar tus espacios y tu energía. Eleva tu vibración y crea un santuario de paz en tu hogar.",
  },

  {
    nombre: "Encuentro de sanación",
    url: "https://www.instagram.com/encuentrodesanacion/",
    imagen: TuLuz,
    descripcion: "Obtén visibilidad real y comparte sanación.",
  },
  {
    nombre: "¡Atrevete y sé parte de nuestras alianzas!",
    url: "https://www.instagram.com/encuentrodesanacion/",
    imagen: Cocrea,
    descripcion: "Obtén visibilidad real y comparte sanación.",
  },
  {
    nombre: "Venceraperse - Diseño y Creacion de Espacios Digitales",
    url: "https://www.instagram.com/venceraperse/",
    imagen: venceraperse,
    descripcion:
      "Sabemos que tu visión es ilimitada. Ayudamos a empresas y profesionales en su lanzamiento a Internet , ofrecemos servicios de creación de páginas web que amplificarán tu mensaje y te conectarán con tu audiencia global. Expande tu alcance y materializa tu potencial en el vasto cosmos digital.",
  },
];

const CarruselAlianzas = () => {
  return (
    <section className="bg-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-700">
        ALIANZAS
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
                <p className="font-semibold mb-2">{nombre}</p>
                <p className="text-sm">{descripcion}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarruselAlianzas;
