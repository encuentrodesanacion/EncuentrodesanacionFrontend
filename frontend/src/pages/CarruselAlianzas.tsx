import Encuentrodesanacion from "../assets/Encuentrodesanacion.jpeg";
import "../styles/flipCards.css"; // Asegúrate de tener los estilos aquí o adaptarlos a Tailwind
import creadorvirtual from "../assets/creadorvirtual.jpg";
import tuemprendimiento from "../assets/tuemprendimiento.jpeg";
import hazlo from "../assets/hazlo.jpg";
import confiaenelproceso from "../assets/confiaenelproceso.jpg";
import nuncaolvides from "../assets/nuncaolvides.jpg";

const alianzas = [
  {
    nombre: "@Creador_virtual",
    url: "https://www.instagram.com/creador_virtual/",
    imagen: creadorvirtual,
  },
  {
    nombre: "Encuentro de sanación",
    url: "https://www.instagram.com/encuentrodesanacion/",
    imagen: hazlo,
    descripcion: "Obtén visibilidad real y comparte sanación.",
  },
  {
    nombre: "¡Atrevete y sé parte de nuestras alianzas!",
    url: "h",
    imagen: confiaenelproceso,
    descripcion: "Obtén visibilidad real y comparte sanación.",
  },
  {
    nombre: "¡Atrevete y sé parte de nuestras alianzas!",
    url: "https://www.instagram.com/encuentrodesanacion/",
    imagen: nuncaolvides,
    descripcion: "Obtén visibilidad real y comparte sanación.",
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
