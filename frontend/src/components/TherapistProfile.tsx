import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Terapeuta } from "../types/index"; // <-- Importar la interfaz centralizada

interface TherapistProfileProps {
  terapeuta: Terapeuta;
  onClick: (terapeuta: Terapeuta) => void;
}

const TherapistProfile: FC<TherapistProfileProps> = ({
  terapeuta,
  onClick,
}) => {
  return (
    <div
      className="flip-wrapper cursor-pointer"
      onClick={() => onClick(terapeuta)}
    >
      <div className="flip-card">
        <div className="flip-inner">
          <div className="flip-front">
            <img
              src={terapeuta.imagenPerfil}
              alt={terapeuta.nombre}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="nombre-overlay">
              <p>{terapeuta.nombre}</p>
            </div>
          </div>
          <div className="flip-back flex flex-col justify-center items-center p-4">
            <h3 className="mb-2 font-bold text-lg text-center">
              {terapeuta.nombre}
            </h3>
            <p className="mb-4 text-center text-sm text-gray-600">
              Ver servicios y agendar
            </p>
            <button
              type="button"
              className="w-full px-4 py-2 border rounded-full bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300"
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
