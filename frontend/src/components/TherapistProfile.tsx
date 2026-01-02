import { FC } from "react";
import { Terapeuta } from "../types/index";

interface TherapistProfileProps {
  terapeuta: Terapeuta;
  onClick: (terapeuta: Terapeuta) => void;
  callToActionText?: string;
}

const TherapistProfile: FC<TherapistProfileProps> = ({
  terapeuta,
  onClick,
  callToActionText,
}) => {
  const displayText = callToActionText || "Ver servicios y agendar";

  return (
    <div
      // AUMENTO DE ALTURA: Pasamos a h-[600px] para dar más aire al diseño
      className="flip-wrapper cursor-pointer w-[360px] h-[600px] m-4"
      onClick={() => onClick(terapeuta)}
    >
      <div className="flip-card w-full h-full">
        <div className="flip-inner w-full h-full">
          
          {/* Frente de la tarjeta */}
          <div className="flip-front w-full h-full">
            <img
              src={terapeuta.imagenPerfil}
              alt={terapeuta.nombre}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="nombre-overlay">
              <p className="font-bold text-lg">{terapeuta.nombre}</p>
            </div>
          </div>

          {/* Reverso de la tarjeta: Máximo espacio para descripción */}
          <div className="flip-back w-full h-full flex flex-col p-6 bg-white rounded-2xl border-0 border-pink-100 shadow-xl">
            {/* Título un poco más compacto */}
            <h3 className="mb-2 font-bold text-xl text-pink-700 text-center border-b border-pink-50 pb-1">
              {terapeuta.nombre}
            </h3>

            {/* CONTENEDOR DE DESCRIPCIÓN: Ahora ocupa la mayor parte de la card */}
            <div className="flex-grow overflow-y-auto mb-2 pr-0 custom-scrollbar">
              <p className="text-gray-800 text-sm md:text-base leading-relaxed text-left whitespace-pre-wrap">
                {displayText}
              </p>
            </div>

            {/* BOTÓN REDUCIDO: py-2 y text-sm para no robar protagonismo */}
            <button
              type="button"
              className="w-full py-1 bg-pink-600 text-white text-sm font-semibold rounded-full hover:bg-pink-700 transition-all shadow-sm active:scale-50"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;