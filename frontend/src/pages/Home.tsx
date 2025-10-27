import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  Earth,
  Heart,
  SmilePlus,
  Brain,
  Star,
  Orbit,
  Ear,
} from "lucide-react";
// import ReservaHora from "../ReservaHora";
import Whatsapp from "../assets/ASTRONAUTA3.png";
import CarruselAlianzas from "./CarruselAlianzas";
import Fondo3 from "../assets/Fondo3.jpg";
import SpaPrincipal from "../assets/SpaPrincipal.jpeg";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import FindeTalleres from "../assets/FindeTalleres.jpeg";
import { Link } from "react-router-dom";
import Giftcard from "../pages/Gifcard";
import CartIcon from "../components/CartIcon";
import SpaLittle from "../assets/Spa Little.jpeg";
import "../index.css";

// Importa tu imagen de fondo aquí.
// Asegúrate de que la ruta sea correcta. Por ejemplo, si tu imagen se llama 'fondo_spa.jpg'
// y está en la carpeta 'assets', la ruta sería:
import Cristal from "../assets/Cristal.jpg"; // ¡Cambia esto por la ruta real de tu imagen!
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // menú mobilea
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar la recarga de la página
    setIsSubmitting(true); // Deshabilitar el botón

    // Validaciones básicas en el frontend
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      alert("Por favor, completa todos los campos.");
      setIsSubmitting(false);
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      alert("Por favor, ingresa un email válido.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/comentarios`, {
        // Llama a tu nueva API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      if (response.ok) {
        alert("¡Mensaje enviado con éxito! Gracias por tu sugerencia.");
        setNombre(""); // Limpiar el formulario
        setEmail("");
        setMensaje("");
      } else {
        const errorData = await response.json();
        alert(
          `Error al enviar mensaje: ${errorData.mensaje || "Error desconocido"}`
        );
        console.error("Error al enviar comentario:", errorData);
      }
    } catch (error) {
      console.error("Error de red o del servidor:", error);
      alert("Hubo un problema de conexión. Intenta de nuevo más tarde.");
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  return (
    // Aplica las clases de Tailwind y el estilo de la imagen de fondo al div principal
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative z-0 overflow-auto"
      style={{ backgroundImage: `url(${Cristal})` }}
    >
      {/* Navigation */}
      <nav className="bg-purple-600/95 fixed w-full z-10 border-b border-pastel-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo o Título */}
            <div className="flex items-center">
              <span className="text-2xl font-light text-white">
                <div>
                  <span className="text-bisque-200 font-bold">
                    SPA HOLÍSTICO{" "}
                  </span>
                  <span className="text-cyan-400 font-bold">ONLINE</span>
                </div>
              </span>
            </div>

            {/* Menú de escritorio */}
            <div className="hidden md:flex items-center justify-start gap-6 p-4 pl-2">
              <a
                href="#inicio"
                className="text-blue-300 hover:text-white font-bold"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-blue-300 hover:text-white font-bold"
              >
                Servicios
              </a>
              <a
                href="#alianzas"
                className="text-blue-300 hover:text-white font-bold"
              >
                Alianzas
              </a>
              <a
                href="#otros"
                className="text-blue-300 hover:text-white font-bold"
              >
                Días de ofrenda
              </a>
              <Link
                to="/Staff-Terapéutico"
                className="text-blue-300 hover:text-white font-bold"
              >
                Staff Terapeutico
              </Link>
              <Link
                to="/nuestra-comunidad"
                className="text-blue-300 hover:text-white font-bold"
              >
                Nuestra Comunidad
              </Link>
              <Link
                to="/quienes-somos"
                className="text-blue-300 hover:text-white font-bold"
              >
                Misión
              </Link>
            </div>

            {/* Menú móvil + Cart Icon */}
            <div className="flex items-center gap-1 mr-auto">
              <CartIcon />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white/70 hover:text-pastel-green"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil desplegable (COINCIDE AHORA CON EL DE ESCRITORIO) */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-black/95 to-black/90 border-t border-pastel-green/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Enlaces de ancla */}
              <a
                href="#inicio"
                onClick={() => setIsMenuOpen(false)} // Cerrar al hacer clic (buena práctica)
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Servicios
              </a>
              <a
                href="#alianzas"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Alianzas
              </a>
              <a
                href="#otros"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Días de ofrenda
              </a>

              {/* Enlaces de Link (react-router-dom) */}
              <Link
                to="/Staff-Terapéutico"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Staff Terapeutico
              </Link>
              <Link
                to="/nuestra-comunidad"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Nuestra Comunidad
              </Link>
              <Link
                to="/quienes-somos"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Misión
              </Link>

              {/* Eliminado el ancla a #contacto que no estaba en el menú de escritorio */}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-20 pb-12 md:pt-32 md:pb-24 bg-gradient-to-r from-pastel-green/20 to-pastel-mint/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 mb-6">
                {" "}
              </h1>
              <p className="text-1xl md:text-3xl  text-black-500 mb-2 font-bold  ">
                Bienvenido Valiente al Primer Spa Holístico Online. De Chile
                para el Mundo. Aquí encontrarás a los mejores especialistas
                Holísticos quiénes te ayudarán a avanzar en tu proceso de
                Sanación, ya sea emocional, física, mental y/o espiritual.
              </p>
            </div>
            <div className="relative">
              <img
                src={Fondo3}
                alt="Encuentro de sanación"
                className="rounded-2xl shadow-xl"
                style={{ borderRadius: "50%" }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-pastel-green/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section
        id="servicios"
        className="py-16 md:py-24 bg-gradient-to-r from-fuchsia-200 to-pink-600 text-white font-bold"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="md:text-5xl font-light text-center mb-12 text-cyan-300/95 font-bold">
            Servicios Principales
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="w-8 h-8 mb-4 text-yellow-500" />,
                title:
                  "Formación de Terapeutas de la Luz (Con mención en diferentes áreas seleccionadas)",
                description:
                  "Espacio enfocado en tu Formación como Terapeuta. Queremos que alcances tu mejor potencial de la mano de los terapeutas más destacados.",
                price: "Desde $40.000CLP / €37 / 43USD por sesión",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <a
                      href="#reserva"
                      onClick={() => {
                        setServicioSeleccionado("Terapeutas de la luz");
                        setEspecialidadSeleccionada("");
                      }}
                    ></a>
                    <Link
                      to="/terapeutasdeluz"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      Ingresa Aquí
                    </Link>
                  </div>
                ),
              },
              {
                icon: <Heart className="w-8 h-8 mb-4 text-yellow-500" />,
                title: "Tratamiento Integral",
                description:
                  "Pack de sesiones para avanzar en tu proceso de sanación física, mental, emocional y/o espiritual.",
                price: "Desde 88.000CLP / €80 / 93USD",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/tratamientointegral"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      Ingresa Aquí
                    </Link>
                  </div>
                ),
              },
              {
                icon: <Orbit className="w-8 h-8 mb-4 text-yellow-500" />,
                title: "Talleres Mensuales",
                description:
                  "Encuentros grupales para reconectar con tu esencia, liberar bloqueos y activar tu energía interior. (Yoga, Yoga Infantil, Pilates, etc.)",
                price: "Desde 35.000CLP / €32 / $37USD,",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/tallermensual"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      Ingresa Aquí
                    </Link>
                  </div>
                ),
              },
              // {
              //   icon: <Orbit className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: "Alianzas",
              //   description:
              //     "¿Tienes un proyecto, emprendimiento o servicio alineado con el bienestar, conciencia o la transformación personal? Te ofrecemos visibilidad real, contarás con mayor alcance y tus clientes podrán contar con beneficios en nuestro sitio web: ¡Cientos de personas podrán descubrirte!, Nos mueve la colaboración genuina. Únete y forma parte de una red de almas con propósito",

              //   button: (
              //     <div className="flex flex-col gap-2 mt-4">
              //       <a
              //         href="https://forms.gle/n9cKSVDw9vjzB8QC8"
              //         target="_blank"
              //         rel="noopener noreferrer"
              //         className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 text-center"
              //       >
              //         Realizar Formulario
              //       </a>
              //     </div>
              //   ),
              // },
              // {
              //   icon: <Earth className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: "Spa Holístico al Mundo",
              //   description:
              //     "Aprende a manejar tu propio Spa Holístico para poder expandir la Sanación en tu país. (excluye Chile)",
              //   price: "Desde los €150 / $163USD",
              //   button: (
              //     <a
              //       href="https://wa.me/56976557902?text=%C2%A1Quiero%20expandir%20la%20sanaci%C3%B3n%20en%20mi%20pa%C3%ADs!%2C%20por%20favor%2C%20dame%20mas%20informaci%C3%B3n."
              //       target="_blank"
              //       rel="noopener noreferrer"
              //       className="inline-block mt-4 px-4 py-2 bg-cyan-400/60 text-black font-medium rounded-full hover:bg-pastel-green/80 transition"
              //     >
              //       Contáctanos
              //     </a>
              //   ),
              // },
              {
                icon: <Earth className="w-8 h-8 mb-4 text-yellow-500" />,
                title: "EncuentroFacil",
                description:
                  " Sección de Agendamiento: Tu Bienestar a un Solo Clic. El sistema que te garantiza claridad, seguridad y la hora perfecta con tu profesional.",
                price: "Desde 25.000CLP / €32 / $35USD,",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    {/* <Link
                      to="/encuentrofacil"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      Ingresa Aquí
                    </Link> */}
                  </div>
                ),
              },
              {
                icon: <SmilePlus className="w-8 h-8 mb-4 text-yellow-500" />,
                title: "GiftCard",
                description:
                  " El Regalo Perfecto está Aquí! Compra una GiftCard con Valor Amoroso y Transforma la vida de un ser querido con una inversión en su bienestar.",
                price: "Desde 25.000CLP / €32 / $35USD,",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    {/* <Link
                      to="/giftcard"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      Ingresa Aquí
                    </Link> */}
                  </div>
                ),
              },
              // {
              //   icon: <Orbit className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: "Alianzas",
              //   description:
              //     "¿Tienes un proyecto, emprendimiento o servicio alineado con el bienestar, conciencia o la transformación personal? Te ofrecemos visibilidad real, contarás con mayor alcance y tus clientes podrán contar con beneficios en nuestro sitio web: ¡Cientos de personas podrán descubrirte!, Nos mueve la colaboración genuina. Únete y forma parte de una red de almas con propósito",

              //   button: (
              //     <div className="flex flex-col gap-2 mt-4">
              //       <a
              //         href="https://forms.gle/n9cKSVDw9vjzB8QC8"
              //         target="_blank"
              //         rel="noopener noreferrer"
              //         className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 text-center"
              //       >
              //         Realizar Formulario
              //       </a>
              //     </div>
              //   ),
              // },

              {
                icon: <Brain className="w-8 h-8 mb-4 text-yellow-500" />,
                title: "Mente y ser",
                description:
                  "El Pilar Clínico para tu Crecimiento Profundo.  Espacio exclusivo de Psicólogos Clínicos con visión en la sanación del Ser.",
                price: "Desde 120.000CLP / €109 / $127USD,",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/psicologos"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      Ingresa Aquí
                    </Link>
                  </div>
                ),
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-2xl">
                {service.icon}
                <h3 className="text-xl font-light mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <p className="text-pastel-green font-light">{service.price}</p>
                {service.button && service.button}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="alianzas">
        <CarruselAlianzas />
      </section>
      {/* Componente ReservaHora agregado aquí abajo */}

      {/* Blog Preview Section */}
      <section
        id="otros"
        className="py-0 bg-gradient-to-r from-pastel-green to-pastel-mint/10"
      >
        <div className="bg-gradient-to-r from-fuchsia-200 to-pink-600 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl text-yellow-400 text-center py-25 md:py-12 font-bold">
            Días de Ofrenda
            <p>(POR TIEMPO LIMITADO)</p>
          </h2>

          {/* Contenedor deslizable con snap */}
          <div className="flex justify-center flex-wrap gap-6 pb-6">
            {[
              {
                title: "Finde de Talleres Grupales",
                image: FindeTalleres,
                excerpt:
                  "Talleres y terapias grupales a valor amoroso durante 3 días",
                buttonText: "Reserva tu cupo",
                link: "/findetalleres",
                isDisabled: true,
              },
              {
                title: "SPA PRINCIPAL",
                image: SpaPrincipal,
                excerpt:
                  "Espacio donde los terapeutas se reúnen para ofrendar sus terapias...",
                buttonText: "Ir al Spa Principal",
                link: "/spaprincipal",
                isDisabled: false,
              },
              {
                title: "SPA LITTLE",
                image: SpaLittle,
                excerpt: "Espacio donde nuevos terapeutas están creciendo...",
                buttonText: "Reserva tu hora",
                link: "/spalittle",
                isDisabled: true,
              },
            ].map((post, index) => (
              <div
                key={index}
                className="min-w-[300px] max-w-xs bg-white rounded-2xl overflow-hidden shadow-lg flex-shrink-0 snap-start"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 text-center">
                    {post.title}
                  </h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                  {post.isDisabled ? ( // <-- Lógica condicional para el botón
                    <span
                      className="text-gray-400 mt-4 inline-block font-medium cursor-not-allowed"
                      style={{ pointerEvents: "none" }} // Evita eventos de click
                    >
                      {post.buttonText} →
                    </span>
                  ) : (
                    <Link
                      to={post.link}
                      className="text-black hover:text-pastel-green mt-4 inline-block font-medium"
                    >
                      {post.buttonText} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Link to="/quienes-somos" className="block">
                <h2 className="text-3xl md:text-4xl font-light mb-6 hover:underline cursor-pointer">
                  Quiénes Somos
                </h2>
              </Link>
              <Link to="/Staff-Terapéutico" className="block">
                <h2 className="text-3xl md:text-4xl font-light mb-6 hover:underline cursor-pointer">
                  Staff Terapéutico
                </h2>
              </Link>
              <div>
                <Link to="/nuestra-comunidad" className="block">
                  <h2 className="text-3xl md:text-4xl font-light mb-6 hover:underline cursor-pointer">
                    Nuestra Comunidad
                  </h2>
                </Link>
              </div>
              <p className="text-gray-400 mb-8">
                Da el primer paso hacia una vida más consciente y equilibrada.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-400">
                  <span className="font-light mr-2">Email:</span>
                  spaholistico@encuentrodesanacion.com
                </p>
                <p className="flex items-center text-gray-400">
                  <span className="font-light mr-2">Teléfono:</span>
                  +569 7655 7902
                </p>
                <div className="flex space-x-4 mt-6">
                  <a
                    href="https://www.instagram.com/encuentrodesanacion/"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.youtube.com/@SpaEncuentroDeSanaci%C3%B3n"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {" "}
              {/* Agrega onSubmit */}
              <div>
                <h1 className="text-center text-lg font-semibold text-white mb-4">
                  Si tienes alguna sugerencia o problema de navegación en la
                  página web, escríbelo aquí para tener respuestas del soporte
                  técnico e ir mejorando este espacio para todos.
                </h1>

                <label
                  htmlFor="name"
                  className="block text-sm font-light text-gray-300"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-lg bg-white-900 border border-gray-800 text-black focus:ring-pastel-green focus:border-pastel-green"
                  value={nombre} // Conectar con el estado `nombre`
                  onChange={(e) => setNombre(e.target.value)} // Actualizar el estado
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-light text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-lg bg-white-900 border border-gray-800 text-black focus:ring-pastel-green focus:border-pastel-green"
                  value={email} // Conectar con el estado `email`
                  onChange={(e) => setEmail(e.target.value)} // Actualizar el estado
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-light text-gray-300"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-lg bg-white-900 border border-gray-800 text-black focus:ring-pastel-green focus:border-pastel-green"
                  value={mensaje} // Conectar con el estado `mensaje`
                  onChange={(e) => setMensaje(e.target.value)} // Actualizar el estado
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting} // Deshabilitar durante el envío
                className="w-full bg-gradient-to-r from-fuchsia-500/80 to-pink-500/90 mb-6 text-black px-6 py-3 rounded-full hover:bg-pastel-green/90 transition-colors"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}{" "}
                {/* Texto dinámico */}
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gradient-to-b from-black to-black/95 text-white py-12 border-t border-pastel-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-light mb-4">
                <span className="text-pastel-green">Encuentro de</span> Sanación
              </h3>
              <p className="text-gray-400">
                Transformando vidas a través del equilibrio holístico y el
                bienestar integral.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-light mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#inicio"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#servicios"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <a
                    href="#otros"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    Otros
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-light mb-4">Sígueme</h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/encuentrodesanacion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pastel-green transition-colors"
                >
                  <Instagram size={24} /> <h1>Encuentro de Sanación</h1>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="mb-2">
              {" "}
              {/* Agregamos un margen inferior para separar de los enlaces */}
              &copy; {new Date().getFullYear()} Encuentro de Sanación. Todos los
              derechos reservados.
            </p>
            {/* --- AQUÍ ES DONDE SE INTEGRA EL ENLACE --- */}
            <div className="flex justify-center space-x-4">
              {" "}
              {/* Contenedor para los enlaces de políticas */}
              <a
                href="/politicas-de-privacidad"
                className="text-gray-400 hover:text-pastel-green transition-colors"
              >
                Políticas de Privacidad
              </a>
              {/* Si tienes Términos y Condiciones, también iría aquí */}
              <a
                href="/terminos-y-condiciones"
                className="text-gray-400 hover:text-pastel-green transition-colors"
              >
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/56976557902?text=Deseo%20obtener%20m%C3%A1s%20informaci%C3%B3n%20de%20los%20servicios."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        // Mantener las clases para el fondo, forma, sombra y hover
        className="whatsapp-float bg-green-500 text-white rounded-full flex items-center justify-center p-4 shadow-lg hover:bg-green-600 transition-colors duration-200"
      >
        <img
          src={Whatsapp} // La ruta de la imagen de WhatsApp
          alt="WhatsApp Logo"
          className="w-8 h-8" // Ajusta el tamaño según necesites
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/32x32/cccccc/ffffff?text=WA"; // Fallback si la imagen no carga
            console.error(
              "Error al cargar la imagen de WhatsApp. Verifica la ruta."
            );
          }}
        />
      </a>
    </div>
  );
};
export default App;
