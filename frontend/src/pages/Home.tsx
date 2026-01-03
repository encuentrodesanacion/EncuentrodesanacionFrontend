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
// import CarruselAlianzas from "./CarruselAlianzas";
import Fondo3 from "../assets/Fondo3.jpg";
import SpaPrincipal from "../assets/SpaPrincipal.jpeg";
import creadorvirtual from "../assets/creadorvirtual.jpg";
import FindeTalleres from "../assets/FindeTalleres.jpeg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Giftcard from "../pages/Gifcard";
import CartIcon from "../components/CartIcon";
import encuentrofacil from "../assets/EncuentroFácil.png";
import "../index.css";
import LanguageSwitcher from "../components/LanguageSwitcher";
// Importa tu imagen de fondo aquí.
// Asegúrate de que la ruta sea correcta. Por ejemplo, si tu imagen se llama 'fondo_spa.jpg'
// y está en la carpeta 'assets', la ruta sería:
import Cristal from "../assets/Cristal.jpg"; // ¡Cambia esto por la ruta real de tu imagen!
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // menú mobile
  // ESTADO DEL TOOLTIP DE NAVEGACIÓN
  const [showTooltip, setShowTooltip] = useState(false);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  // EFECTO PARA SCROLL SUAVE
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      if (response.ok) {
        alert("¡Mensaje enviado con éxito! Gracias por tu sugerencia.");
        setNombre("");
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
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative z-0 overflow-auto"
      style={{ backgroundImage: `url(${Cristal})` }}
    >
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav className="bg-purple-600/95 fixed w-full z-10 border-b border-pastel-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* HACEMOS EL CONTENEDOR RELATIVO PARA EL TOOLTIP */}
          <div className="flex justify-between h-16 items-center">
            {/* 1. LADO IZQUIERDO: Idioma y Título */}
            <div className="flex items-center flex-shrink-0">
              {/* Botones de Idioma / Selector */}
              <div className="flex items-center gap-2 mr-4">
                {/* Botón ES: Siempre visible, cambia el idioma a español */}
                <button
                  onClick={() => changeLanguage("es")}
                  className={`text-sm font-bold transition-colors duration-200 ${
                    i18n.language === "es"
                      ? "text-white"
                      : "text-blue-300 hover:text-white"
                  }`}
                >
                  ES
                </button>

                <span className="text-blue-300">|</span>

                {/* LÓGICA CONDICIONAL AQUÍ */}
                {i18n.language !== "en" ? (
                  /* Muestra el BOTÓN EN cuando el idioma NO es inglés (ej. ES) */
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`text-sm font-bold transition-colors duration-200 ${
                      i18n.language === "en"
                        ? "text-white"
                        : "text-blue-300 hover:text-white"
                    }`}
                  >
                    EN
                  </button>
                ) : (
                  /* Muestra el SELECTOR COMPLETO cuando el idioma ES inglés */
                  <LanguageSwitcher />
                )}
              </div>

              {/* Título de la página */}
              <span className="text-2xl font-light text-white">
                <span className="text-bisque-200 font-bold">
                  <h2>{t("spaholistico")}</h2>
                </span>
                <span className="text-cyan-400 font-bold">ONLINE</span>
              </span>
            </div>

            {/* 2. CENTRO: Menú de escritorio (Oculto en móvil) */}
            <div className="hidden md:flex items-center justify-start gap-6 p-8 pl-2">
              <a
                href="#servicios"
                className="text-blue-300 hover:text-white font-bold"
              >
                {t("nav_servicios")}
              </a>

              {/* <a
                href="#otros"
                className="text-blue-300 hover:text-white font-bold"
              >
                {t("nav_ofrenda")}
              </a> */}
             
              <Link
                to="/encuentrofacil"
                className="text-blue-300 hover:text-white font-bold"
              >
              Encuentro Facil
              </Link>
              {/* <Link
                to="/Staff-Terapéutico"
                className="text-blue-300 hover:text-white font-bold"
              >
                {t("nav_staff")}
              </Link> */}
              <Link
                to="/nuestra-comunidad"
                className="text-blue-300 hover:text-white font-bold"
              >
                {t("nav_comunidad")}
              </Link>
            </div>

            {/* 3. LADO DERECHO: Botón de Menú Móvil (Hamburguesa) Y Cart Icon */}
            <div className="flex items-center gap-16">
              {/* <--- Botón de Menú (AHORA PRIMERO) ---> */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="block sm:block md:hidden text-white/70 hover:text-pastel-green"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              {/* <--- CartIcon (AHORA SEGUNDO) ---> */}
              <CartIcon />
            </div>

            {/* 4. TOOLTIP / POPUP MOMENTÁNEO (ESCRITORIO) */}
            {showTooltip && (
              <div
                // Posiciona el tooltip sobre el área de enlaces importantes
                className="hidden md:block absolute top-14 left-1/2 transform -translate-x-1/2 
                                 bg-pink-600 text-white p-3 rounded-lg shadow-2xl z-[60] 
                                 transition-opacity duration-1000 animate-bounceOnce"
                style={{ minWidth: "350px" }}
              >
                {/* Flecha del tooltip */}
                <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-pink-600"></div>

                <p className="font-semibold text-sm">Hola!</p>
              </div>
            )}
            {/* FIN: TOOLTIP */}
          </div>
        </div>

        {/* Menú móvil desplegable */}
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
              {/* <a
                href="#alianzas"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Alianzas
              </a> */}
              {/* <a
                href="#otros"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Días de ofrenda
              </a> */}

              {/* Enlaces de Link (react-router-dom) */}
              <Link
                to="/encuentrofacil"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-blue-300 hover:text-white font-bold"
              >
                Encuentro Fácil
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

      {/* --- SECCIÓN DE INICIO (HERO SECTION) --- */}
      <section
        id="inicio"
        // Estilos finales sin animación de entrada
        className="pt-32 pb-32 md:pt-48 md:pb-40 bg-gradient-to-r from-pastel-green/20 to-pastel-mint/20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Título Principal */}
          <h1 className="text-6xl md:text-9xl font-extrabold mb-6 leading-tight">
            <span className=" bg-clip-text text-pink-600">
              <strong> {t("hero_title")}</strong>
            </span>
          </h1>

          {/* Subtítulo (Frase de apertura) */}
          <p className="text-2xl md:text-4xl text-gray-1000 font-light mb-8 max-w-4xl mx-auto">
            <strong> {t("hero_subtitle")}</strong>
          </p>

          {/* Descripción Principal y Lista de Profesionales */}
          <div className="text-lg md:text-xl text-gray-900 max-w-3xl mx-auto font-medium mb-12 leading-relaxed">
            <p className="mb-4">
              {t("hero_description_p1")} {""}
              <strong className="text-pink-600">
                {t("hero_description_p2")} {""}
              </strong>
              {t("hero_description_p3")}
            </p>

            {/* Mejora: Lista de profesionales con mejor formato (Tags/Badges) */}
            <p className="font-semibold text-gray-800 mt-6 mb-3">
              {t("expert_heading")}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-base md:text-lg">
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full border border-pink-300">
                {t("expert_psychologists")}
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-300">
                {t("expert_holistic_therapists")}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-300">
                {t("expert_coaches")}
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-300">
                {t("expert_yoga_fitness")}
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full border border-indigo-300">
                {t("expert_plus")}
              </span>
            </div>

            <p className="mt-6">{t("hero_description_p4")}</p>
          </div>

          {/* Imagen Centrada Debajo del Contenido */}
          <div className="relative mt-20 max-w-xs mx-auto">
            <img
              src={Fondo3}
              alt="Símbolo Holístico"
              // Uso de rounded-full y anillo (ring) para destacar la imagen
              className="object-cover w-full h-auto rounded-full shadow-2xl ring-4 ring-pink-400/50 ring-offset-4 ring-offset-pastel-green/10 transition duration-500 hover:shadow-pink-400/80"
              style={{
                aspectRatio: "1 / 1",
              }}
            />
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section
        id="servicios"
        className="py-2 md:py-10 bg-gradient-to-r from-fuchsia-200 to-pink-600 text-white font-bold"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="md:text-5xl font-light text-center mb-12 text-cyan-300/95 font-bold">
            {t("main_services_title")}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              // {
              //   icon: <Star className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: <h2> {t("formation_title")}</h2>,

              //   description: <h2>{t("formation_description")}</h2>,
              //   price: <h2>{t("formation_price")}</h2>,
              //   button: (
              //     <div className="flex flex-col gap-2 mt-4">
              //       <a
              //         href="#reserva"
              //         onClick={() => {
              //           setServicioSeleccionado("Terapeutas de la luz");
              //           setEspecialidadSeleccionada("");
              //         }}
              //       ></a>
              //       <Link
              //         to="/terapeutasdeluz"
              //         className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
              //       >
              //         <h2>{t("formation_cta")}</h2>
              //       </Link>
              //     </div>
              //   ),
              // },
              {
                icon: <Heart className="w-8 h-8 mb-4 text-yellow-500" />,
                title: <h2>Cuerpo Consciente</h2>,
                description: (
                  <h2>
                    <strong>
                      A través de sesiones personalizadas con kinesiologo,
                      nutricionista, entrenador físico, y terapeuta
                      complementario
                    </strong>{" "}
                    liberamos tensiones, equilibramos tu energía y fortalecemos
                    tu bienestar físico. Un camino para reconectar con tu cuerpo
                    consciente, encontrar claridad y vivir con mayor presencia
                    calma y propósito.
                  </h2>
                ),
                price: "",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/cuerpo-consciente"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      <h2>{t("formation_cta")}</h2>
                    </Link>
                  </div>
                ),
              },
              {
                icon: <Orbit className="w-8 h-8 mb-4 text-yellow-500" />,
                title: <h2>Sanación Profunda</h2>,
                description: (
                  <h2>
                    <strong>
                      A través de prácticas conscientes y rituales guiados por
                      Terapeutas Holísticos
                    </strong>
                    , armonizamos tu campo energético, elevamos tu vibración y
                    abrimos espacio para claridad, paz y vitalidad interior.
                    Este encuentro te invita a soltar lo que no te pertenece,
                    liberar cargas acumuladas, reconectar con tu esencia y
                    activar tu energía más pura, permitiendo que tu luz interior
                    se expanda con propósito y equilibrio.
                  </h2>
                ),
                price: "",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/sanacion-profunda"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      <h2>{t("formation_cta")}</h2>
                    </Link>
                  </div>
                ),
              },
              // {
              //   icon: <Orbit className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: <h2>Trauma, Dolor Y Reconexión</h2>,
              //   description: (
              //     <h2>
              //       <strong>
              //         A través de terapias especializadas con Psicologo,
              //         Kinesiologo, Terapeuta Holístico,Coach de vida y Terapeuta
              //         Somático{" "}
              //       </strong>{" "}
              //       , trabajamos para liberar memorias emocionales atrapadas.
              //       Reconecta con partes de ti que quedaron fragmentadas.
              //       Recupera tu sentido de pertenencia, Restauramos tu
              //       confianza, la seguridad y el equilibrio emocional. Pensado
              //       para quienes sienten que es momento de sanar heridas del
              //       pasado.
              //     </h2>
              //   ),
              //   price: "",
              //   button: (
              //     <div className="flex flex-col gap-2 mt-4">
              //       <Link
              //         to="/trauma-dolor-reconexion"
              //         className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
              //       >
              //         <h2>{t("formation_cta")}</h2>
              //       </Link>
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
                title: <h2>Oraculos & Guía</h2>,
                description: (
                  <h2>
                    <strong>Es un programa de acompañamiento espiritual</strong>{" "}
                    que va más allá de simples lecturas.{" "}
                    <strong>
                      Incluye técnicas como Tarot, Registros Akáshicos, Péndulo
                      y diversas canalizaciones.
                    </strong>{" "}
                    Es una puerta a la orientación profunda que guía a quienes
                    buscan claridad, dirección y entendimiento de su camino,
                    usando herramientas ancestrales para revelar propósito,
                    sanar memorias y fortalecer su conexión interior.
                  </h2>
                ),
                price: "",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/oraculos-y-guia"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      <h2>{t("formation_cta")}</h2>
                    </Link>
                  </div>
                ),
              },
              {
                icon: <SmilePlus className="w-8 h-8 mb-4 text-yellow-500" />,
                title: <h2>Semillas De Luz</h2>,
                description: (
                  <h2>
                    <strong>
                      A través del acompañamiento de psicopedagogos, educadores,
                      terapeutas somáticos, trabajadores sociales y
                      fonoaudiólogos {""}
                    </strong>
                    ofrecemos un espacio dedicado a niños, madres, padres y
                    cuidadores que buscan contención, orientación y crecimiento
                    consciente. sostenemos procesos de: Desarrollo emocional y
                    habilidades socioafectivas Fortalecimiento del vínculo
                    familiar y la crianza respetuosa Comprensión del
                    comportamiento desde una mirada integral Conciencia
                    familiar, bienestar cotidiano y evolución espiritual
                  </h2>
                ),
                price: "",
                button: (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to="/semillas-de-luz"
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
                    >
                      <h2>{t("formation_cta")}</h2>
                    </Link>
                  </div>
                ),
              },
              //  {
              //   icon: <Earth className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: <h2>Encuentro Facil</h2>,
              //   description: (
              //     <h2>
              //       <strong>Es la plataforma de Agendamiento en línea de Encuentro de Sanación. </strong>{" "}
              //      ¡Aqui puedes conocer a cada terapeuta y reservar sus sesiones de forma simple y directa.!{" "}
              //       <strong>
                    
              //       </strong>{" "}
                  
              //     </h2>
              //   ),
              //   price: "",
              //   button: (
              //     <div className="flex flex-col gap-2 mt-4">
              //       <Link
              //         to="/encuentrofacil"
              //         className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
              //       >
              //         <h2>{t("formation_cta")}</h2>
              //       </Link>
              //     </div>
              //   ),
              // },
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
              //   icon: <Brain className="w-8 h-8 mb-4 text-yellow-500" />,
              //   title: <h2>{t("mind_and_being_title")}</h2>,
              //   description: <h2>{t("mind_and_being_description")}</h2>,
              //   price: <h2>{t("mind_and_being_price")}</h2>,
              //   button: (
              //     <div className="flex flex-col gap-2 mt-4">
              //       <Link
              //         to="/psicologos"
              //         className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
              //       >
              //         <h2>{t("formation_cta")}</h2>
              //       </Link>
              //     </div>
              //   ),
              // },
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
        {/* <CarruselAlianzas /> */}
      </section>
      {/* Componente ReservaHora agregado aquí abajo */}

      {/* Blog Preview Section */}
     <section
  id="otros"
  className="py-0 bg-gradient-to-r from-pastel-green to-pastel-mint/10"
>
  <div className="bg-gradient-to-r from-fuchsia-200 to-pink-600 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Título principal: se usa t() directamente */}
    <h2 className="text-3xl md:text-4xl text-yellow-400 text-center py-12 md:py-12 font-bold">
     Plataforma de Agendamiento
    </h2>

    {/* Contenedor con flex-wrap */}
    <div className="flex justify-center flex-wrap gap-6 pb-6">
      {[
        {
          title: "Es la plataforma de Agendamiento en línea de Encuentro de Sanación. Aqui puedes conocer a cada terapeuta y reservar sus sesiones de forma simple y directa",
          image: encuentrofacil,
          excerpt:  "",
                    
                    
                    
          buttonText: t("weekend_workshops_cta"),
          link: "/encuentrofacil",
          isDisabled: false,
        },
       
      ].map((post, index) => (
        <div
          key={index}
          className="min-w-[400px] max-w-xs bg-white rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-89 object-cover"
          />
         <div className="p-6 flex flex-col items-center"> {/* Agregamos flex-col e items-center para centrar el contenido */}
  <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">
    {post.title}
  </h3>
  <p className="text-gray-600 text-center text-sm mb-4">{post.excerpt}</p>

  {post.isDisabled ? (
    <span
      className="w-full text-center bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-bold cursor-not-allowed shadow-inner"
      style={{ pointerEvents: "none" }}
    >
      {post.buttonText}
    </span>
  ) : (
    <Link
      to={post.link}
      className="w-full text-center bg-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-pink-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 block"
    >
      {post.buttonText}
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
                  {t("who_we_are_title")}
                </h2>
              </Link>
              {/* <Link to="/Staff-Terapéutico" className="block">
                <h2 className="text-3xl md:text-4xl font-light mb-6 hover:underline cursor-pointer">
                  {t("therapeutic_staff_title")}
                </h2>
              </Link> */}
              <div>
                <Link to="/nuestra-comunidad" className="block">
                  <h2 className="text-3xl md:text-4xl font-light mb-6 hover:underline cursor-pointer">
                    {t("our_community_title")}
                  </h2>
                </Link>
              </div>
              <p className="text-gray-400 mb-8">
                {t("conscious_step_message")}
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-400">
                  <span className="font-light mr-2"> {t("email_label")}</span>
                  spaholistico@encuentrodesanacion.com
                </p>
                <p className="flex items-center text-gray-400">
                  <span className="font-light mr-2"> {t("phone_label")}</span>
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
                  {t("support_message")}
                </h1>

                <label
                  htmlFor="name"
                  className="block text-sm font-light text-gray-300"
                >
                  {t("form_name_label")}
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
                  {t("form_email_label")}
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
                  {t("form_message_label")}
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
                {isSubmitting ? "Enviando..." : t("form_send_button")}{" "}
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
              {/* Título Principal */}
              <h3 className="text-xl font-light mb-4">
                <span className="text-pastel-green">
                  {t("footer_title").split(" ")[0]}
                  <br></br>
                </span>
                {t("footer_title").split(" ").slice(1).join(" ")}
              </h3>
              {/* Descripción Principal */}
              <p className="text-gray-400">{t("footer_description")}</p>
            </div>
            <div>
              {/* Título de Enlaces Rápidos */}
              <h3 className="text-xl font-light mb-4">
                {t("footer_quick_links_title")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#inicio"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    {t("footer_home_link")}
                  </a>
                </li>
                <li>
                  <a
                    href="#servicios"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    {t("footer_services_link")}
                  </a>
                </li>
                <li>
                  <a
                    href="#otros"
                    className="text-gray-400 hover:text-pastel-green transition-colors"
                  >
                    {t("footer_others_link")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              {/* Título de Sígueme */}
              <h3 className="text-xl font-light mb-4">
                {t("footer_follow_us_title")}
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/encuentrodesanacion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pastel-green transition-colors"
                >
                  {/* Se asume que Instagram es un componente React para el ícono */}
                  <Instagram size={24} />
                  <h1>{t("footer_title")}</h1>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            {/* Copyright */}
            <p className="mb-2">
              &copy; {new Date().getFullYear()} {t("footer_copyright")}
            </p>
            <div className="flex justify-center space-x-4">
              {/* Enlace de Políticas de Privacidad */}
              <a
                href="/politicas-de-privacidad"
                className="text-gray-400 hover:text-pastel-green transition-colors"
              >
                {t("footer_privacy_policy")}
              </a>
              {/* Enlace de Términos y Condiciones */}
              <a
                href="/terminos-y-condiciones"
                className="text-gray-400 hover:text-pastel-green transition-colors"
              >
                {t("footer_terms_and_conditions")}
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* WhatsApp Floating Button y su contenedor envolvente (asumiendo que ese </div> cierra un componente superior) */}
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
      {/* Cierre del div contenedor que se vio en el original */}
    </div>
  );
};
export default App;
