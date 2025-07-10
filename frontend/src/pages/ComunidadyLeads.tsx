import { useNavigate } from "react-router-dom";
import { Instagram, Mail, HeartHandshake } from "lucide-react"; // Importamos nuevos íconos

const ComunidadYLeads = () => (
  <section
    id="comunidad-leads"
    className="py-12 px-6 max-w-6xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-100"
  >
    <h2 className="text-4xl font-extrabold mb-10 text-center text-purple-800 leading-tight">
      Conéctate con Nuestra Luz: Comunidad y Contacto
    </h2>

    <div className="grid md:grid-cols-2 gap-10 items-start">
      {/* Sección de Comunidad */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition duration-300 ease-in-out">
        <Instagram className="w-16 h-16 text-pink-500 mb-4 animate-bounce-slow" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          Únete a Nuestra Comunidad de Valientes
        </h3>
        <p className="mb-6 text-gray-700">
          Encuentra inspiración, apoyo y comparte tu camino de sanación en
          nuestro espacio vibrante en Instagram. ¡Te esperamos con el corazón
          abierto!
          <br></br>
          <br></br>
        </p>
        <a
          href="https://www.instagram.com/channel/AbbEKXbK-X3-l_Ud/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-pink-600 hover:to-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <Instagram className="w-5 h-5 mr-2" /> Unirme a la Comunidad
        </a>
      </div>

      {/* Sección de Contacto/Leads con el nuevo texto */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition duration-300 ease-in-out">
        <Mail className="w-16 h-16 text-blue-500 mb-4 animate-pulse-slow" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          ¿Quieres ser parte del mejor Staff de terapeutas?
        </h3>
        <p className="mb-6 text-gray-700">
          Si sientes el llamado a co-crear y acompañar procesos de sanación, te
          invitamos a compartir tu talento con nuestra comunidad. ¡Completa este
          formulario!
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfJquSTvXzQ8wpNaznHzaW5NrvFAe_JS02Co3iqNWxItUkD8A/viewform?usp=sf_link" // ¡IMPORTANTE: Cambia esto por el enlace real de tu formulario!
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <HeartHandshake className="w-5 h-5 mr-2" /> Completar Formulario
        </a>
      </div>
    </div>
  </section>
);

const ComunidadYLeadsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10">
      <ComunidadYLeads />
      <button
        onClick={() => navigate("/#contacto")}
        className="mt-12 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default ComunidadYLeadsPage;
