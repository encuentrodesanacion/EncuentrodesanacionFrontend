import { useNavigate, Link } from "react-router-dom"; // Importamos 'Link'
// Importamos los íconos necesarios para las tres tarjetas
import { Instagram, Mail, HeartHandshake, Orbit } from "lucide-react";

// Componente funcional que renderiza las tres tarjetas
const ComunidadYLeads = () => (
  <section
    id="comunidad-leads"
    className="py-12 px-6 max-w-6xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-100"
  >
    <h2 className="text-4xl font-extrabold mb-10 text-center text-purple-800 leading-tight">
      Conéctate con Nuestra Luz: Comunidad, Staff y Alianzas
    </h2>

    {/* CAMBIO CLAVE: Utilizamos un grid de 3 columnas */}
    <div className="grid md:grid-cols-3 gap-8 items-stretch">
      {/* 1. Sección de Comunidad (Instagram) */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition duration-300 ease-in-out">
        <Instagram className="w-16 h-16 text-pink-500 mb-4 animate-bounce-slow" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          Únete a Nuestra Comunidad de Valientes
        </h3>
        {/* flex-grow asegura que el texto ocupe todo el espacio disponible para que el botón se alinee */}
        <p className="mb-6 text-gray-700 flex-grow">
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

      {/* 2. Sección de Staff/Contacto (Leads) */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition duration-300 ease-in-out">
        <Mail className="w-16 h-16 text-blue-500 mb-4 animate-pulse-slow" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          ¿Quieres ser parte del mejor Staff de terapeutas?
        </h3>
        <p className="mb-6 text-gray-700 flex-grow">
          Si sientes el llamado a co-crear y acompañar procesos de sanación, te
          invitamos a compartir tu talento con nuestra comunidad. ¡Completa este
          formulario!
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfJquSTvXzQ8wpNaznHzaW5NrvFAe_JS02Co3iqNWxItUkD8A/viewform?usp=sf_link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <HeartHandshake className="w-5 h-5 mr-2" /> Completar Formulario
        </a>
      </div>

      {/* 3. Sección de Alianzas (NUEVA INCORPORACIÓN) */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition duration-300 ease-in-out">
        <Orbit className="w-16 h-16 text-yellow-500 mb-4" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          Alianzas de Conciencia
        </h3>
        <p className="mb-6 text-gray-700 flex-grow">
          ¿Tienes un proyecto, emprendimiento o servicio alineado con el
          bienestar, conciencia o la transformación personal? Te ofrecemos
          visibilidad real, contarás con mayor alcance y tus clientes podrán
          contar con beneficios en nuestro sitio web: ¡Cientos de personas
          podrán descubrirte!, Nos mueve la colaboración genuina. Únete y forma
          parte de una red de almas con propósito.
        </p>

        <div className="flex flex-col gap-2 mt-auto w-full">
          <a
            href="https://forms.gle/n9cKSVDw9vjzB8QC8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-cyan-600 hover:to-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Realizar Formulario
          </a>
        </div>
      </div>
    </div>
  </section>
);

// Componente de página que envuelve la sección y el botón de navegación
const ComunidadYLeadsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gray-50">
      <ComunidadYLeads />

      {/* CONTENEDOR DE BOTONES (MODIFICADO) */}
      <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
        {/* BOTÓN 1: Volver al Inicio (Mantenido) */}
        <button
          onClick={() => navigate("/")} // Navegar a la raíz (Inicio)
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Volver al Inicio
        </button>

        {/* BOTÓN 2: Enlace Directo a Misión (NUEVO) */}
        {/* Usamos Link de react-router-dom para una navegación limpia a la ruta */}
        <Link
          to="/quienes-somos"
          className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
        >
          Conocer Nuestra Misión
        </Link>
      </div>
    </div>
  );
};

export default ComunidadYLeadsPage;
