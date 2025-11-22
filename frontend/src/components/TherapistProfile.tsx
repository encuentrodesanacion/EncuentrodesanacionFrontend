import { FC } from "react";
// Importamos la interfaz Terapeuta para garantizar el tipado correcto
import { Terapeuta } from "../types/index";

// 1. Definición de la interfaz de Props con el nuevo campo personalizable
interface TherapistProfileProps {
  terapeuta: Terapeuta;
  onClick: (terapeuta: Terapeuta) => void;
  // Propiedad opcional para personalizar el texto del Call to Action (CTA)
  callToActionText?: string;
}

const TherapistProfile: FC<TherapistProfileProps> = ({
  terapeuta,
  onClick,
  callToActionText, // 2. Destructuramos la nueva prop
}) => {
  // Definimos el texto que se mostrará. Si se proporciona callToActionText, lo usa,
  // si no, usa un texto por defecto.
  const displayText = callToActionText || "Ver servicios y agendar";

  return (
    <div
      className="flip-wrapper cursor-pointer"
      // La función onClick se llama al hacer clic en cualquier parte de la tarjeta
      onClick={() => onClick(terapeuta)}
    >
      <div className="flip-card">
        <div className="flip-inner">
          {/* Frente de la tarjeta (flip-front) */}
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

          {/* Reverso de la tarjeta (flip-back) */}
          <div className="flip-back flex flex-col justify-center items-center p-4">
            <h3 className="mb-2 font-bold text-lg text-center">
              {terapeuta.nombre}
            </h3>

            {/* 3. Utilizamos la variable displayText que contiene el texto personalizable */}
            <p className="mb-4 text-center text-sm text-gray-600">
              {displayText}
            </p>

            {/* El botón también llama a la misma función onClick definida en la tarjeta */}
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
