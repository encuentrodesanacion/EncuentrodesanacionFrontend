// src/components/PermanentPopup.tsx
import React from "react";

const PermanentPopup: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pink-600 text-white p-4 text-center z-50 shadow-lg">
      <p className="font-semibold text-lg">¡Atención!</p>
      <p className="mt-1">
        Durante el mes de Septiembre, Todos los servicios estarán
        deshabilitados. Nos encontramos trabajando para ofrecer nuevas
        funcionalidades a nuestros valientes, ¡Felices Fiestas Patrias!
      </p>
    </div>
  );
};

export default PermanentPopup;
