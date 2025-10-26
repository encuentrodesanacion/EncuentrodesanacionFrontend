// src/components/PermanentPopup.tsx
import React from "react";

const PermanentPopup: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pink-600 text-white p-2 text-center z-20 shadow-lg">
      <p className="font-semibold text-lg">¡Atención!</p>
      <p className="mt-1">
        ​¡De la Certificación a la Práctica Real! ​Toda nuestra Formación
        incluye Prácticas a Distancia supervisadas, diseñadas para tu
        experiencia real. Al obtener tu título, tienes la oportunidad de
        comenzar a trabajar de inmediato y generar ingresos en nuestra
        plataforma web, uniéndote a nuestra red de profesionales
      </p>
    </div>
  );
};

export default PermanentPopup;
