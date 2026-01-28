import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; 
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes
import paulinaImg from "../assets/Terapeuta11.jpeg"; 
import karlaImg from "../assets/karla.png"; 
import natalieImg from "../assets/nataly.png"; 
import mariajoseImg from "../assets/cote.png"; 

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

// Definimos la interfaz Plan
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

export default function SemillaDeLuz() {
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
   
    { to: "/oraculoyguia", label: "Oráculos & Guía" },
    { to: "https://encuentrodesanacion.com/encuentrofacil", label: "EncuentroFácil" },
  ];

  // --- DATOS PROFESIONALES ---
  const terapeutas = [
    { 
      nombre: "Paulina Villablanca", rol: "Líder del Programa", especialidad: "Terapeuta Holística", img: paulinaImg, 
      color: "bg-pink-600", border: "border-pink-200", esLider: true,
      descripcion: "Educadora de párvulos y terapeuta holística. Guía el proceso desde la crianza consciente y la sanación del niño interior, acompañando a los adultos a observar su historia emocional."
    },
    { 
      nombre: "Natalie Bonysson", rol: "Arteterapia y expresión emocional", especialidad: "Terapeuta Floral", img: natalieImg, 
      color: "bg-purple-600", border: "border-purple-200", esLider: false,
      descripcion: "Facilita espacios de expresión emocional consciente para adultos, utilizando el arte como vía de observación, integración y comprensión interna."
    },
    { 
      nombre: "Karla Flores", rol: "Movimiento y vínculo con la infancia", especialidad: "Yogui Infantil", img: karlaImg, 
      color: "bg-blue-600", border: "border-blue-200", esLider: false,
      descripcion: "Yogui infantil y estudiante de psicología. Acompaña a las infancias a través del movimiento consciente, el juego y la expresión corporal."
    },
    { 
      nombre: "Maria Jose Corvalán", rol: "Regulación emocional del adulto", especialidad: "Terapeuta de Liberación", img: mariajoseImg, 
      color: "bg-green-600", border: "border-green-200", esLider: false,
      descripcion: "Especializada en liberación de emociones atrapadas y creencias limitantes. Acompaña a los adultos a reconocer y liberar cargas que interfieren en la crianza."
    }
  ];

  // --- DATOS DE PLANES ---
  const planes: Plan[] = [
    { 
      titulo: "Programa 4 Semanas", 
      subtitulo: "Programa de conciencia y base emocional", 
      precio: 145000, 
      sesiones: 4,
      destacado: false,
      objetivo: "🎯 Objetivo: Que el adulto tome conciencia de sí mismo y del impacto que genera en el vínculo con la infancia.",
      paraQuienes: ["Desean criar conscientemente", "Sienten que repiten patrones", "Quieren comprender su historia"],
      incluye: ["Encuentros grupales", "Sanación niño interior", "Actividades de regulación emocional", "Material descargable de apoyo"]
    },
    { 
      titulo: "Programa 8 Semanas", 
      subtitulo: "Programa de integración y transformación del vínculo", 
      precio: 185000, 
      sesiones: 8, 
      destacado: true, // Activa la etiqueta MÁS COMPLETO
      objetivo: "🎯 Objetivo: Que el adulto transforme su forma de vincularse, creando una crianza más presente.",
      paraQuienes: ["Necesitan integrar cambios reales", "Desean llevarlo a la práctica cotidiana", "Buscan acompañamiento extendido"],
      incluye: ["Todo lo de 4 semanas", "Profundización vincular", "Integración consciente del rol", "Espacios vivenciales de transformación"]
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
      clientBookingId: "semilla-luz-" + Date.now(),
      terapeuta: "Equipo Semilla de Luz",
      servicio: "Semilla de Luz",
      especialidad: selectedPlan.titulo,
      fecha: now.toLocaleDateString('sv-SE'),
      hora: "A coordinar",
      precio: selectedPlan.precio,
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      sesiones: selectedPlan.sesiones,
      cantidad: 1,
      terapeutaId: 4,
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
          Semillas de Luz{" "}
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
          <Link to="/oraculoyguia" className="text-blue-500 hover:text-gray-800 font-bold">Oráculos & Guía</Link>
      
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
          <h2 className="text-4xl font-bold text-pink-700 mb-6">Semilla de Luz</h2>
          <div className="text-gray-700 text-lg leading-relaxed">
            <p className="mb-4"><strong>Programa de crianza consciente y sanación del vínculo adulto–niñez.</strong></p>
            <p className="mb-4 italic">No se trata de criar perfecto. Se trata de criar con conciencia.</p>
            <p className="mb-4">
              Semilla de Luz es un programa creado para madres, padres y cuidadores que desean mirarse a sí mismos para transformar la forma en que acompañan a las infancias.
            </p>
            <p className="mb-4">
              Aquí el foco no está en “corregir al niño”, sino en el adulto que se observa, se responsabiliza y elige distinto.
            </p>
            <p className="mb-6">Semilla de Luz no busca fórmulas ni recetas. Es un proceso para adultos que se atreven a mirarse.</p>
            
            <div className="bg-pink-50 p-6 rounded-lg inline-block text-left mb-6 border border-pink-100 shadow-sm">
              <h4 className="font-bold text-pink-800 mb-2 uppercase text-sm">🌱 ¿QUÉ TRABAJA ESTE PROGRAMA?</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                <li>Crianza consciente</li>
                <li>Sanación del niño interior</li>
                <li>Regulación emocional del adulto</li>
                <li>Vínculo adulto–infancia</li>
                <li>Herramientas prácticas para acompañar con presencia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* GRID TERAPEUTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
          {terapeutas.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative flex flex-col items-center overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${t.color}`}></div>
              {t.esLider && <span className="absolute top-0 right-0 bg-pink-700 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg">Lider</span>}
              <img src={t.img} alt={t.nombre} className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-gray-100 shadow-sm" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">{t.nombre}</h3>
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-[10px] font-bold text-pink-600 uppercase text-center px-2">{t.rol}</span>
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
            <div className="bg-green-600 text-white px-6 py-3 rounded-t-xl inline-block shadow-md">
              <h4 className="font-bold uppercase tracking-wider">🔹 CICLO 1: Conciencia · Regulación · Base (4 Semanas)</h4>
            </div>
            <div className="bg-white border-2 border-green-600 p-6 rounded-b-xl rounded-r-xl shadow-sm">
              <p className="text-green-800 font-semibold mb-6 italic">Objetivo: Tomar conciencia del rol adulto y comenzar a regularse emocionalmente.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { sem: "1", titulo: "Conciencia crianza", items: ["Rol del adulto", "Observar patrones", "Mirada consciente"] },
                  { sem: "2", titulo: "Regulación adulta", items: ["Reconocer emociones", "Regular reacciones", "Sostener vínculo"] },
                  { sem: "3", titulo: "Cuerpo y emoción", items: ["Expresión infantil", "Regulación corporal", "Seguridad y contención"] },
                  { sem: "4", titulo: "Niño interior", items: ["Impacto historia propia", "Reparación interna", "Conciencia vincular"] },
                ].map((s) => (
                  <div key={s.sem} className="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-green-600 uppercase">Semana {s.sem}</span>
                    <h5 className="font-bold text-gray-800 mb-2 border-b border-green-200 pb-1">{s.titulo}</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {s.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {/* BOTÓN DE COMPRA CICLO 1 */}
              <div className="text-center pt-4 border-t border-green-100">
                <button 
                  onClick={() => abrirModalInscripcion(planes[0])}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform active:scale-95"
                >
                  Inscribirme al Ciclo 1 (${planes[0].precio.toLocaleString()} CLP)
                </button>
              </div>
            </div>
          </div>

          {/* CICLO 2 */}
          <div>
            <div className="flex items-center">
              <div className="bg-orange-500 text-white px-6 py-3 rounded-t-xl inline-block shadow-md">
                <h4 className="font-bold uppercase tracking-wider flex items-center gap-2">
                  🔹 CICLO 2: Integración · Profundización (8 Semanas)
                  <span className="bg-white text-orange-600 text-[10px] px-2 py-0.5 rounded-full border border-orange-600 font-bold shadow-sm ml-2">
                    MÁS COMPLETO
                  </span>
                </h4>
              </div>
            </div>
            <div className="bg-white border-2 border-orange-500 p-6 rounded-b-xl rounded-r-xl shadow-sm">
              <p className="text-orange-600 font-bold mb-2">✨ Incluye todo el Ciclo 1 (Semanas 1-4)</p>
              <p className="text-gray-700 font-semibold mb-6 italic">Objetivo: Integrar cambios reales y fortalecer la presencia y coherencia en el vínculo.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { sem: "5", titulo: "Presencia y vínculo", items: ["Fortalecer escucha", "Presencia adulta", "Validación emocional"] },
                  { sem: "6", titulo: "Creencias y patrones", items: ["Creencias limitantes", "Nuevas formas", "Criar desde conciencia"] },
                  { sem: "7", titulo: "Regulación infantil", items: ["Emociones difíciles", "Seguridad emocional", "Acompañamiento"] },
                  { sem: "8", titulo: "Cierre consciente", items: ["Integrar aprendizajes", "Consolidar herramientas", "Proyectar continuidad"] },
                ].map((s) => (
                  <div key={s.sem} className="bg-orange-50 p-4 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-orange-600 uppercase">Semana {s.sem}</span>
                    <h5 className="font-bold text-gray-800 mb-2 border-b border-orange-300 pb-1">{s.titulo}</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {s.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {/* BOTÓN DE COMPRA CICLO 2 */}
              <div className="text-center pt-4 border-t border-orange-200">
                <button 
                  onClick={() => abrirModalInscripcion(planes[1])}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform active:scale-95"
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