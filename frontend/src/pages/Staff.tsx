import { useNavigate } from "react-router-dom";
import CarruselStaff from "./CarruselStaff";

const TerapeutasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Agregamos 'relative' a la sección para que el botón 'absolute' 
         se posicione respecto a este cuadro blanco.
      */}
      <section
        id="terapeutas"
        className="relative py-12 px-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl my-10 border border-gray-100"
      >
        {/* BOTÓN FLOTANTE (ABSOLUTE)
           - top-6 left-6: Posición en la esquina superior izquierda.
           - hidden sm:block: Opcional, puedes ocultarlo en móviles muy pequeños si prefieres.
        */}
        <button
          onClick={() => navigate("/#contacto")}
          className="absolute top-6 left-6 px-4 py-2 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition duration-300 shadow-md z-20"
        >
          ← Volver
        </button>

        {/* TÍTULO PRINCIPAL 
           Agregamos pt-8 (o más) para asegurar que el título baje y no 
           se solape con el botón en ninguna resolución.
        */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-pink-700 mb-2 tracking-tight pt-8 sm:pt-0">
          Nuestros Terapeutas Destacados
        </h2>

        <p className="text-center text-lg text-gray-500 mb-8 font-light">
          Encuentra la guía perfecta para tu camino de sanación.
        </p>

        {/* Bloque de Información */}
        <div className="bg-pink-50 p-6 rounded-xl border-l-4 border-pink-500 mb-10">
          <p className="text-gray-700 leading-relaxed text-base">
            <strong className="text-pink-600">¡Síguelos!</strong> Haz clic en la
            imagen de cada profesional para ir directamente a su perfil de
            Instagram.
          </p>
        </div>

        {/* Carrusel del Staff */}
        <CarruselStaff />
      </section>
    </div>
  );
};

export default TerapeutasPage;