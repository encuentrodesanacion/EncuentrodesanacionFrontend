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
    nombre: "Ana Luisa Solervicens",
    url: "https://www.instagram.com/susurro_ancestralcl/",
    imagen: terapeuta14,
    descripcion:
      "Ana Luisa: Fundadora de Susurro Ancestral. Soy terapeuta holística y artesana del alma, guiada por la sabiduría ancestral y la energía de la naturaleza. A través de terapias energéticas, oráculos y rituales, acompaño a quienes buscan reconectar con su esencia, sanar desde lo profundo y abrir caminos de armonía y abundancia. Mi amor por lo sagrado también se expresa en cada vela que creo: piezas únicas cargadas de intención, cuarzos, hierbas y colores que equilibran cuerpo, mente y espíritu. Cada creación está diseñada para ser un susurro de luz en tu camino. Creo en la magia que habita en lo simple, en la fuerza de los rituales cotidianos y en el poder transformador del amor propio. Mis terapias son: lectura de runas, oráculo Ogham, Gemoterapia, Radiestesia y Radiónica. Además, realizo trabajos de limpieza, armonización y velomancia. Te invito a compartir este viaje de sanación, creación y reconexión.",
  },

  {
    nombre: "Sarita Infante",
    url: "https://www.instagram.com/sarita.infante.coachdelser/",
    imagen: sarita,
    descripcion:
      "Mi camino como terapeuta nació desde una búsqueda profunda: encontrar sentido, propósito y una forma de habitar la vida desde el alma. Durante años me formé como coach profesional, guiando procesos de transformación desde la mente y la acción. Sin embargo, fue en mi propio viaje interior donde comprendí que el verdadero cambio comienza cuando recordamos quiénes somos en esencia. De ese despertar nació en mí la figura de Coach del SER: un acompañamiento que va más allá de las palabras, donde la escucha se vuelve sagrada y cada encuentro es un portal de reconexión con la verdad interior. Mi labor no es “arreglar” a nadie, sino sostener el espacio para que cada alma pueda recordar su luz, su poder y su camino. Trabajo desde la presencia amorosa, la sensibilidad y la energía como lenguaje sutil. Creo en el poder de los procesos que honran la emoción, la intuición y la conexión con lo divino que habita en cada ser. “No vine a enseñar… vine a recordar contigo lo que ya habita en tu alma.",
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
