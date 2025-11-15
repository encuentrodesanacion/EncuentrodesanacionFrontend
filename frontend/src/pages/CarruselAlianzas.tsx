import React from "react";
// Cambiamos la importación: usamos useTranslation de react-i18next
import { useTranslation } from "react-i18next";

// Importaciones de imágenes y estilos (SE MANTIENEN IGUAL)
import Encuentrodesanacion from "../assets/Encuentrodesanacion.jpeg";
import "../styles/flipCards.css";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import tuemprendimiento from "../assets/tuemprendimiento.jpeg";
import TuLuz from "../assets/TuLuz.jpeg";
import Cocrea from "../assets/Cocrea.jpeg";
import Caldero from "../assets/Caldero.jpeg";
import yuniverse from "../assets/Yunivers.jpeg";

const CarruselAlianzas = () => {
  // 1. OBTENER la función t() DENTRO del componente para la reactividad
  const { t } = useTranslation();

  // 2. MOVER la definición del array DENTRO del componente
  // Esto asegura que t() se ejecute cada vez que el idioma cambie
  const alianzas = [
    {
      nombre: t("smudges_and_salts_title"),
      url: "https://www.instagram.com/el.caldero.de.la.maca?igsh=MXZwcTRyMW4ydmF0Ng==",
      imagen: Caldero,
      descripcion: t("smudges_and_salts_description"),
    },

    {
      nombre: t("healing_encounter_title"),
      url: "https://www.instagram.com/encuentrodesanacion/",
      imagen: TuLuz,
      descripcion: t("healing_encounter_description_1"),
    },
    {
      nombre: t("healing_encounter_cta_1"),
      url: "https://www.instagram.com/encuentrodesanacion/",
      imagen: Cocrea,
      descripcion: t("healing_encounter_description_2"),
    },
    {
      nombre: t("yuniverse_title"),
      url: "https://www.instagram.com/yuniverse_digital/",
      imagen: yuniverse,
      descripcion: t("yuniverse_description"),
    },
  ];

  return (
    <section className="bg-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-700">
        {t("alliances_title")}
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
