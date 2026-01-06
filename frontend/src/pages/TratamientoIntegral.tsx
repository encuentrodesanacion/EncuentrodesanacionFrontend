import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; 
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes
import gaby from "../assets/gaby.png"; 
import fernanda from "../assets/fernanda.png"; 

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function CuerpoConsciente() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const navLinks = [
    { to: "/cuerpo-consciente", label: "Cuerpo Consciente" },
    { to: "/sanacion-profunda", label: "Sanación Profunda" },
    { to: "/semillas-de-luz", label: "Semillas De Luz" },
    { to: "/oraculos-y-guia", label: "Oráculos & Guía" },
  ];

  // --- DATOS PROFESIONALES (Estructura Unificada) ---
  const terapeutas = [
    { 
      nombre: "Gabriela Pinto", rol: "Líder & Entrenador Físico", especialidad: "Kinesióloga", img: gaby, 
      color: "bg-pink-600", border: "border-pink-200", esLider: true,
      descripcion: "Kinesióloga apasionada por la salud integral. Guía el proceso de habitar el cuerpo con mayor conciencia, transformando el dolor y el estrés en libertad de movimiento."
    },
    { 
      nombre: "Fernanda Arce", rol: "Nutrición Holística", especialidad: "Terapeuta Holística", img: fernanda, 
      color: "bg-blue-600", border: "border-blue-200", esLider: false,
      descripcion: "Especialista en bienestar integral y reconexión consciente. Integra la ciencia de la nutrición con la profundidad de la mente y la energía para sanar desde la raíz."
    }
  ];

  const planes = [
    { 
      titulo: "Programa 4 Semanas", 
      subtitulo: "Iniciar, Reconocer, Reconectar",
      precio: 145000, 
      sesiones: 4,
      destacado: false,
      objetivo: "🎯 Objetivo: Que la persona comience a habitar su cuerpo con mayor conciencia y presencia.",
      paraQuienes: [
        "Se sienten desconectados de su cuerpo",
        "Viven estrés, tensión o cansancio constante",
        "Quieren comenzar a escucharse físicamente",
        "Buscan un primer acercamiento consciente al movimiento"
      ],
      incluye: [
        "Encuentros grupales guiados por el equipo profesional",
        "Actividades de movimiento consciente",
        "Espacios de integración a la vida diaria",
        "Material descargable de apoyo"
      ]
    },
    { 
      titulo: "Programa 8 Semanas", 
      subtitulo: "Integrar, Sostener y Transformar",
      precio: 185000, 
      sesiones: 8,
      destacado: true,
      objetivo: "🎯 Objetivo: Que la persona integre una nueva forma de habitar su cuerpo, más consciente y sostenida.",
      paraQuienes: [
        "Necesitan tiempo para integrar cambios reales",
        "Buscan profundizar, sostener y transformar",
        "Desean evolucionar el proceso inicial, no repetirlo"
      ],
      incluye: [
        "Todo lo del programa de 4 semanas",
        "Profundización del proceso corporal",
        "Abordaje de patrones físicos complejos",
        "Acompañamiento extendido del equipo",
        "Proceso vivencial de alta transformación"
      ]
    }
  ];

  const abrirModalInscripcion = (plan: any) => {
    setSelectedPlan(plan);
    setShowContactModal(true);
  };

  const ejecutarAccionReserva = async (modo: "pago" | "carrito") => {
    if (!selectedPlan) return;
    if (clientName.trim() === "" || clientPhone.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(clientPhone.trim());
    if (!phoneNumber || !phoneNumber.isValid()) {
      alert("Por favor, ingresa un número de teléfono válido.");
      return;
    }

    setIsProcessing(true);
    const now = new Date();

    const reservaData: Reserva = {
      clientBookingId: "cuerpo-consciente-" + Date.now(),
      terapeuta: "Equipo Cuerpo Consciente",
      servicio: "Cuerpo Consciente",
      especialidad: selectedPlan.titulo,
      fecha: now.toLocaleDateString('sv-SE'),
      hora: "A coordinar",
      precio: selectedPlan.precio,
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      sesiones: selectedPlan.sesiones,
      cantidad: 1,
      terapeutaId: 2, 
    };

    try {
      if (modo === "pago") {
        const response = await fetch(`${API_BASE_URL}/webpay/create-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            monto: selectedPlan.precio,
            returnUrl: `${API_BASE_URL}/webpay/confirmacion`,
            reservas: [reservaData],
          }),
        });
        const { url, token } = await response.json();
        window.location.href = `${url}?token_ws=${token}`;
      } else {
        const response = await fetch(`${API_BASE_URL}/reservar-directa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservaData),
        });
        const { reserva: confirmed } = await response.json();
        addToCart(confirmed);
        alert("¡Programa añadido al carrito!");
        setShowContactModal(false);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* --- HEADER (Estructura Unificada) --- */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 z-50">Cuerpo Consciente</h1>
        <div className="flex items-center gap-4 md:hidden ml-auto -mr-4">
          <button className="p-2 text-gray-700 hover:text-pink-600 focus:outline-none z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
        <div className="hidden md:flex items-center justify-start gap-6 p-4 ml-auto md:mr-20">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-blue-500 hover:text-gray-800 font-bold whitespace-nowrap">{link.label}</Link>
          ))}
          <CartIcon />
        </div>
      </header>

      {/* --- MENÚ MÓVIL --- */}
      <div className={`fixed top-16 left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ${isMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"} z-40`}>
        <div className="flex flex-col items-center space-y-3 px-4">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-800 hover:text-pink-600 py-2 w-full text-center border-b border-gray-100">
              {link.label}
            </Link>
          ))}
          <CartIcon />
        </div>
      </div>

      <div style={{ padding: "2rem", paddingTop: "8rem", backgroundColor: "#fefefe", minHeight: "100vh" }}>
        <button onClick={() => navigate("/servicios")} className="mb-8 px-4 py-2 bg-blue-500 text-white rounded">Volver a Servicios</button>

        {/* --- INTRODUCCIÓN --- */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold text-pink-700 mb-4">Cuerpo Consciente</h2>
          <div className="text-gray-700 text-lg leading-relaxed">
            <p className="mb-4"><strong>Programa de reconexión corporal y presencia consciente.</strong></p>
            <p className="mb-4 italic">El cuerpo no es algo que haya que corregir. Es el lugar donde comienza la conciencia.</p>
            <p className="mb-6">Diseñado para personas que sienten desconexión corporal o estrés, y desean volver a habitar su cuerpo con respeto.</p>
          </div>
        </div>

        {/* --- GRID DE TERAPEUTAS (Mapeo Dinámico) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {terapeutas.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative flex flex-col items-center overflow-hidden transition-transform hover:scale-102">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${t.color}`}></div>
              {t.esLider && <span className="absolute top-0 right-0 bg-pink-700 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg">Lider</span>}
              <img src={t.img} alt={t.nombre} className={`w-28 h-28 rounded-full object-cover mb-4 border-2 ${t.border} shadow-sm`} />
              <h3 className="text-lg font-bold text-gray-800 mb-1">{t.nombre}</h3>
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-[10px] font-bold text-pink-600 uppercase text-center leading-tight px-2">Rol: {t.rol}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${t.color}`}>Especialidad: {t.especialidad}</span>
              </div>
              <p className="text-[11px] text-gray-600 text-center italic border-t pt-4 leading-relaxed">"{t.descripcion}"</p>
            </div>
          ))}
        </div>

        {/* --- PLANES --- */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch mb-20">
          {planes.map((plan, idx) => (
            <div key={idx} className={`flex-1 p-8 rounded-2xl border flex flex-col transition-all relative ${plan.destacado ? 'border-pink-500 bg-pink-50 shadow-2xl scale-105 z-10' : 'border-pink-200 bg-white shadow-lg'}`}>
              {plan.destacado && <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase">Más Completo</span>}
              <h4 className={`text-2xl font-bold mb-1 text-center ${plan.destacado ? 'text-pink-800' : 'text-pink-700'}`}>{plan.titulo}</h4>
              <p className="text-center text-pink-600 font-bold text-xs mb-4 uppercase tracking-tighter italic">{plan.subtitulo}</p>
              <div className="mb-6 h-px bg-pink-100 w-full" />
              <p className="font-semibold text-gray-800 mb-6 text-sm leading-snug">{plan.objetivo}</p>

              <div className="mb-6">
                <h5 className="text-xs font-bold text-pink-600 uppercase mb-3 text-left">Pensado para quienes:</h5>
                <ul className="text-sm text-gray-700 space-y-2 text-left list-disc pl-4">
                  {plan.paraQuienes.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="mb-8 flex-grow">
                <h5 className="text-xs font-bold text-pink-600 uppercase mb-3 text-left">Qué incluye:</h5>
                <ul className="text-sm text-gray-700 space-y-3 text-left">
                  {plan.incluye.map((item, i) => <li key={i} className="flex items-start"><span className="text-green-500 mr-2 font-bold">✓</span> {item}</li>)}
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t text-center">
                <p className="text-3xl font-black text-gray-800 mb-6">${plan.precio.toLocaleString()} CLP</p>
                <button onClick={() => abrirModalInscripcion(plan)} className="w-full py-4 rounded-xl font-bold bg-pink-600 text-white hover:bg-pink-700 transition-shadow shadow-md">Inscribirme</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE INSCRIPCIÓN --- */}
      {showContactModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-2 text-center">Inscripción</h3>
            <p className="text-sm text-center text-gray-500 mb-4">{selectedPlan.titulo}</p>
            <input type="text" placeholder="Nombre Completo" className="border rounded w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-pink-500" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <input type="tel" placeholder="+569..." className="border rounded w-full py-2 px-3 mb-6 outline-none focus:ring-2 focus:ring-pink-500" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            <div className="flex flex-col space-y-3">
              <button onClick={() => ejecutarAccionReserva("carrito")} className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700">Añadir al Carrito</button>
              <button onClick={() => setShowContactModal(false)} className="bg-gray-200 py-2 rounded text-gray-800 hover:bg-gray-300">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}