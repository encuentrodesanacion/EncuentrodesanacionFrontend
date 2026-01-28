import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; 
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes
import paolaImg from "../assets/Terapeuta8.jpg"; 
import natalieImg from "../assets/nataly.png"; 
import brendaImg from "../assets/brenda.png"; 

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

// Definimos la interfaz para el Plan
interface Plan {
  titulo: string;
  subtitulo: string;
  precio: number;
  sesiones: number;
  destacado: boolean;
  objetivo: string;
  paraQuienes: string[];
  incluye: string[];
}

export default function OraculoGuia() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // --- ESTADOS ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // --- NAVEGACIÓN ---
  const navLinks = [
    { to: "/cuerpoconsciente", label: "Cuerpo Consciente" },
    { to: "/sanacionprofunda", label: "Sanación Profunda" },
    { to: "/semillasdeluz", label: "Semillas De Luz" },
   
    { to: "https://encuentrodesanacion.com/encuentrofacil", label: "EncuentroFácil" },
  ];

  // --- DATOS PROFESIONALES ---
  const terapeutas = [
    { 
      nombre: "Paola Quintero", rol: "Líder del Programa", especialidad: "Lectura Consciente", img: paolaImg, 
      color: "bg-purple-600", border: "border-purple-200", esLider: true,
      descripcion: "Sostiene el proceso completo, guía los encuentros grupales y acompaña la lectura consciente del proceso personal desde herramientas oraculares e intuitivas."
    },
    { 
      nombre: "Natalie Bonysson", rol: "Astrología China", especialidad: "Ciclos y Tiempos", img: natalieImg, 
      color: "bg-pink-600", border: "border-pink-200", esLider: false,
      descripcion: "Aporta lectura de ciclos, tiempos y movimientos energéticos que ayudan a comprender procesos vitales y tomar decisiones con mayor conciencia."
    },
    { 
      nombre: "Brenda Rivas", rol: "Canalización Energética", especialidad: "Integración Emocional", img: brendaImg, 
      color: "bg-blue-600", border: "border-blue-200", esLider: false,
      descripcion: "Acompaña la lectura energética y la integración emocional del proceso, facilitando claridad, contención y alineación interna."
    }
  ];

  // --- DATOS DE PLANES ---
  const planes: Plan[] = [
    { 
      titulo: "Programa 4 Semanas", 
      subtitulo: "Programa de claridad y enfoque interno", 
      precio: 145000, 
      sesiones: 4,
      destacado: false,
      objetivo: "🎯 Objetivo: Que la persona logre claridad interna, ordene su visión y comience a escuchar su propia guía.",
      paraQuienes: ["Se sienten estancadas", "Procesos de transición", "Necesitan decidir con claridad"],
      incluye: ["Lectura oracular consciente", "Ejercicios de conexión intuitiva", "Acompañamiento energético", "Material descargable de apoyo"]
    },
    { 
      titulo: "Programa 8 Semanas", 
      subtitulo: "Programa de integración y propósito", 
      precio: 185000, 
      sesiones: 8, 
      destacado: true,
      objetivo: "🎯 Objetivo: Que la persona tome decisiones alineadas, sostenga su camino y fortalezca su confianza interna.",
      paraQuienes: ["Buscan cambios profundos", "Desean integrar decisiones", "Quieren sostener un camino consciente"],
      incluye: ["Todo lo de 4 semanas", "Profundización en propósito", "Trabajo con símbolos y arquetipos", "Espacios vivenciales de integración"]
    }
  ];

  const abrirModalInscripcion = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowContactModal(true);
  };

  const ejecutarAccionReserva = async (modo: "pago" | "carrito") => {
    if (!selectedPlan || !clientName.trim() || !clientPhone.trim()) {
      alert("Por favor, completa tus datos."); return;
    }
    const phoneNumber = parsePhoneNumberFromString(clientPhone.trim());
    if (!phoneNumber || !phoneNumber.isValid()) { alert("Número inválido."); return; }

    setIsProcessing(true);
    const now = new Date();
    const reservaData: Reserva = {
      clientBookingId: "oraculo-guia-" + Date.now(),
      terapeuta: "Equipo Oráculo & Guía",
      servicio: "Oráculo & Guía",
      especialidad: selectedPlan.titulo,
      fecha: now.toLocaleDateString('sv-SE'), 
      hora: "A coordinar",
      precio: selectedPlan.precio,
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      sesiones: selectedPlan.sesiones,
      cantidad: 1,
      terapeutaId: 3,
    };

    try {
      if (modo === "pago") {
        const res = await fetch(`${API_BASE_URL}/webpay/create-transaction`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ monto: selectedPlan.precio, returnUrl: `${API_BASE_URL}/webpay/confirmacion`, reservas: [reservaData] }),
        });
        const data = await res.json();
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        const res = await fetch(`${API_BASE_URL}/reservar-directa`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservaData),
        });
        const { reserva: confirmed } = await res.json();
        addToCart(confirmed);
        alert("¡Añadido al carrito!");
        setShowContactModal(false);
      }
    } catch (e: any) { alert(`Error: ${e.message}`); } finally { setIsProcessing(false); }
  };

   return (
    <div className="min-h-screen bg-white">
      {/* --- INICIO DEL HEADER Y NAVEGACIÓN --- */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-20 flex justify-between items-center px-5 py-5">
        <h1 className="text-xl font-semibold text-gray-800 z-50">
         Oráculos & Guía{" "}
        </h1>
        <div className="flex items-center gap-4 md:hidden ml-auto mr-14">
          <button
            className="p-2 text-gray-700 hover:text-pink-600 focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="hidden md:flex items-center justify-start gap-6 p-4 pl-2 ml-auto md:mr-20">
          <Link to="/cuerpoconsciente" className="text-blue-500 hover:text-gray-800 font-bold">Cuerpo Consciente</Link>
          <Link to="/sanacionprofunda" className="text-blue-500 hover:text-gray-800 font-bold">Sanación Profunda</Link>
          
          <Link to="/semillasdeluz" className="text-blue-500 hover:text-gray-800 font-bold">Semillas de Luz</Link>
          <a href="https://encuentrodesanacion.com/encuentrofacil" className="text-blue-500 hover:text-gray-800 font-bold">EncuentroFácil</a>
        </div>
      </header>
      
      {/* --- MENÚ MÓVIL --- */}
      <div className={`fixed top-16 left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 overflow-hidden"} z-40`}>
        <div className="flex flex-col items-center space-y-4 px-4">
          {navLinks.map((link) => (
            link.to.startsWith("http") ? (
              <a 
                key={link.to} 
                href={link.to} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-lg text-gray-800 hover:text-pink-600 font-semibold py-2 w-full text-center border-b border-gray-100"
              >
                {link.label}
              </a>
            ) : (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-lg text-gray-800 hover:text-pink-600 font-semibold py-2 w-full text-center border-b border-gray-100"
              >
                {link.label}
              </Link>
            )
          ))}
          <div className="pt-2"><CartIcon /></div>
        </div>
      </div>

      <div style={{ padding: "2rem", paddingTop: "8rem", backgroundColor: "#fefefe", minHeight: "100vh" }}>
        <button onClick={() => navigate("/servicios")} className="mb-8 px-4 py-2 bg-blue-500 text-white rounded">Volver a Servicios</button>

        {/* INTRODUCCIÓN */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-pink-700 mb-6">Oráculo & Guía</h2>
          <div className="text-gray-700 text-lg leading-relaxed">
            <p className="mb-4"><strong>Programa de orientación consciente, intuición y toma de decisiones.</strong></p>
            <p className="mb-4 italic">No se trata de predecir el futuro. Se trata de recordar quién eres para decidir con claridad.</p>
            <p className="mb-4">Oráculo & Guía acompaña a que cada persona escuche su propia guía interna para ordenar su visión y fortalecer su coherencia ante momentos de transición.</p>
            <div className="bg-pink-50 p-6 rounded-lg inline-block text-left mb-6 border border-pink-100 shadow-sm">
              <h4 className="font-bold text-pink-800 mb-2 uppercase text-sm">🌙 ¿QUÉ TRABAJA ESTE PROGRAMA?</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                <li>Claridad emocional y mental</li>
                <li>Conexión con la intuición</li>
                <li>Lectura simbólica de procesos personales</li>
                <li>Toma de decisiones conscientes</li>
                <li>Propósito y dirección de vida</li>
              </ul>
            </div>
          </div>
        </div>

        {/* GRID TERAPEUTAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {terapeutas.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative flex flex-col items-center overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${t.color}`}></div>
              {t.esLider && <span className="absolute top-0 right-0 bg-pink-700 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg">Lider</span>}
              <img src={t.img} alt={t.nombre} className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-gray-100 shadow-sm" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">{t.nombre}</h3>
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-[10px] font-bold text-pink-600 uppercase text-center">{t.rol}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${t.color}`}>{t.especialidad}</span>
              </div>
              <p className="text-[11px] text-gray-600 text-center italic border-t pt-4 leading-relaxed">{t.descripcion}</p>
            </div>
          ))}
        </div>

        {/* --- CRONOGRAMA DEL PROCESO (NUEVO) --- */}
        <div className="max-w-6xl mx-auto mb-20 px-4">
          <h3 className="text-3xl font-bold text-center text-pink-700 mb-10">Cronograma del Proceso</h3>

          {/* CICLO 1 */}
          <div className="mb-12">
            <div className="bg-purple-600 text-white px-6 py-3 rounded-t-xl inline-block shadow-md">
              <h4 className="font-bold uppercase tracking-wider">🔹 CICLO 1: Claridad · Orden · Escucha (4 Semanas)</h4>
            </div>
            <div className="bg-white border-2 border-purple-600 p-6 rounded-b-xl rounded-r-xl shadow-sm">
              <p className="text-purple-800 font-semibold mb-6 italic">Objetivo: Ordenar la visión interna y fortalecer la conexión con la intuición.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { sem: "1", titulo: "Apertura y claridad", items: ["Observar estado actual", "Identificar bloqueos", "Abrir escucha intuitiva"] },
                  { sem: "2", titulo: "Lectura simbólica", items: ["Comprender símbolos", "Reconocer patrones", "Ordenar visión personal"] },
                  { sem: "3", titulo: "Guía interna", items: ["Conexión con intuición", "Diferenciar del miedo", "Decisiones alineadas"] },
                  { sem: "4", titulo: "Integración y cierre", items: ["Integrar el proceso", "Reconocer avances", "Cierre consciente"] },
                ].map((s) => (
                  <div key={s.sem} className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-purple-600 uppercase">Semana {s.sem}</span>
                    <h5 className="font-bold text-gray-800 mb-2 border-b border-purple-200 pb-1">{s.titulo}</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {s.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {/* BOTÓN DE COMPRA CICLO 1 */}
              <div className="text-center pt-4 border-t border-purple-100">
                <button 
                  onClick={() => abrirModalInscripcion(planes[0])}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform active:scale-95"
                >
                  Inscribirme al Ciclo 1 (${planes[0].precio.toLocaleString()} CLP)
                </button>
              </div>
            </div>
          </div>

          {/* CICLO 2 */}
          <div>
            <div className="flex items-center">
              <div className="bg-gray-800 text-white px-6 py-3 rounded-t-xl inline-block shadow-md">
                <h4 className="font-bold uppercase tracking-wider flex items-center gap-2">
                  🔹 CICLO 2: Integración · Propósito · Confianza (8 Semanas)
                  <span className="bg-pink-600 text-[10px] px-2 py-0.5 rounded-full text-white ml-2 border border-white shadow-sm">
                    MÁS COMPLETO
                  </span>
                </h4>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-800 p-6 rounded-b-xl rounded-r-xl shadow-sm">
              <p className="text-purple-700 font-bold mb-2">✨ Incluye todo el Ciclo 1 (Semanas 1-4)</p>
              <p className="text-gray-700 font-semibold mb-6 italic">Objetivo: Integrar el proceso, sostener decisiones y fortalecer el propósito.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { sem: "5", titulo: "Profundización", items: ["Afinar lectura interna", "Sostener decisiones", "Intuición aplicada"] },
                  { sem: "6", titulo: "Propósito y dirección", items: ["Explorar propósito", "Visión a mediano plazo", "Orden y estructura"] },
                  { sem: "7", titulo: "Integración diaria", items: ["Aplicar en lo cotidiano", "Coherencia interna", "Vida práctica"] },
                  { sem: "8", titulo: "Cierre y proyección", items: ["Consolidar aprendizaje", "Proyectar siguiente ciclo", "Cierre del proceso"] },
                ].map((s) => (
                  <div key={s.sem} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-gray-500 uppercase">Semana {s.sem}</span>
                    <h5 className="font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">{s.titulo}</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {s.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {/* BOTÓN DE COMPRA CICLO 2 */}
              <div className="text-center pt-4 border-t border-gray-200">
                <button 
                  onClick={() => abrirModalInscripcion(planes[1])}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform active:scale-95"
                >
                  Inscribirme al Ciclo 2 (${planes[1].precio.toLocaleString()} CLP)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL INSCRIPCIÓN */}
      {showContactModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-2 text-center">Inscripción</h3>
            <p className="text-xs text-center text-gray-500 mb-4 font-bold">{selectedPlan?.titulo}</p>
            <input type="text" placeholder="Nombre Completo" className="border rounded w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-pink-500" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <input type="tel" placeholder="+56912345678" className="border rounded w-full py-2 px-3 mb-6 outline-none focus:ring-2 focus:ring-pink-500" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => ejecutarAccionReserva("carrito")} 
                disabled={isProcessing}
                className={`bg-pink-600 text-white py-3 rounded font-bold ${isProcessing ? 'opacity-50' : ''}`}
              >
                 {isProcessing ? 'Procesando...' : 'Añadir al Carrito'}
              </button>
              <button onClick={() => { setShowContactModal(false); setSelectedPlan(null); }} className="bg-gray-200 py-2 rounded text-gray-800">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}