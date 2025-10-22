import { useNavigate } from "react-router-dom";
// Asegúrate de que este componente CarruselStaff usa Tailwind CSS para una consistencia visual
import CarruselStaff from "./CarruselStaff";

const TerapeutasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {" "}
      {/* Fondo suave y padding superior para la navegación fija */}
      <section
        id="terapeutas"
        className="py-12 px-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl my-10 border border-gray-100" // Contenedor estilizado
      >
        {/* Título Principal */}
        <h2 className="text-4xl font-extrabold text-center text-pink-700 mb-2 tracking-tight">
          Nuestros Terapeutas
        </h2>

        {/* Subtítulo decorativo */}
        <p className="text-center text-lg text-gray-500 mb-8 font-light">
          Encuentra la guía perfecta para tu camino de sanación.
        </p>

        {/* Bloque de Información */}
        <div className="bg-pink-50 p-6 rounded-xl border-l-4 border-pink-500 mb-10">
          <p className="text-gray-700 leading-relaxed text-base">
            <strong className="text-pink-600">¡Siguelos!</strong> Haz clic en la
            imagen de cada profesional para ir directamente a su perfil de
            Instagram. Así podrás conocer su trayectoria, su energía y su
            estilo, y asegurarte de que resuene contigo antes de agendar.
            ¡Encuentra tu guía y comienza tu proceso de sanación hoy!
          </p>
        </div>

        {/* Carrusel del Staff */}
        <CarruselStaff />

        {/* Botón de Navegación Estilizado */}
        <button
          onClick={() => navigate("/#contacto")}
          className="mt-12 px-8 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition duration-300 transform hover:scale-105 shadow-lg block mx-auto"
        >
          Volver al Inicio
        </button>
      </section>
    </div>
  );
};

export default TerapeutasPage;
