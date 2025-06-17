import { useNavigate } from "react-router-dom";
import { Instagram, Megaphone } from "lucide-react";

const ComunidadYLeads = () => (
  <section
    id="comunidad-leads"
    className="py-12 px-6 max-w-6xl mx-auto bg-gray-100 rounded-xl shadow-md"
  >
    <h2 className="text-3xl font-bold mb-8 text-center">
      Sé Parte de Nuestra Comunidad y Cuéntanos de Ti
    </h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="text-center">
        <Instagram className="w-5 h-5 text-pink-600" />
        <Megaphone className="w-5 h-5 text-pink-600" />
        <h3 className="text-2xl font-semibold mb-4">Nuestra Comunidad</h3>
        <p className="mb-4">
          Únete a nuestra Comunidad de Valientes y comparte tu camino de
          sanación.
        </p>
        <a
          href="https://www.instagram.com/channel/AbbEKXbK-X3-l_Ud/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Unirme a la Comunidad
        </a>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Queremos Conocerte Mejor
        </h3>
        <p className="mb-4">
          Completa nuestro formulario y sé parte de nuestra red de
          transformación.
        </p>
        <a
          href="https://tu-enlace-formulario.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Completar Formulario
        </a>
      </div>
    </div>
  </section>
);

const ComunidadYLeadsPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ComunidadYLeads />
      <button
        onClick={() => navigate("/#contacto")}
        className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 block mx-auto"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default ComunidadYLeadsPage;
