import { useNavigate } from "react-router-dom";
import CarruselStaff from "./CarruselStaff";

const TerapeutasPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section id="terapeutas" className="py-10 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Nuestros Terapeutas</h2>
        <p className="mb-6"></p>
        <CarruselStaff />
      </section>

      <button
        onClick={() => navigate("/#contacto")}
        className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 block mx-auto"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default TerapeutasPage;
