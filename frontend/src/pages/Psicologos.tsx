import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/tratamientoIntegral.css"; 
import { useCart, Reserva } from "./CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes
import paulinaImg from "../assets/Terapeuta11.jpeg"; 
import karlaImg from "../assets/karla.jpg"; 
import natalieImg from "../assets/nataly.png"; 
import mariajoseImg from "../assets/cote.png"; 

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function SemillaDeLuz() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // --- ESTADOS ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

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
  const planes = [
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

  const navLinks = [
    { to: "/cuerpo-consciente", label: "Cuerpo Consciente" },
    { to: "/sanacion-profunda", label: "Sanación Profunda" },
    { to: "/semillas-de-luz", label: "Semillas De Luz" },
    { to: "/oraculos-y-guia", label: "Oráculos & Guía" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 z-50">Semilla De Luz</h1>
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
      <div className={`fixed top-16 left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 overflow-hidden"} z-40`}>
        <div className="flex flex-col items-center space-y-4 px-4">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-800 hover:text-pink-600 font-semibold py-2 w-full text-center border-b border-gray-100">{link.label}</Link>
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

        {/* GRID PLANES */}
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 pb-10">
          {planes.map((plan, idx) => (
            <div key={idx} className={`flex-1 p-8 rounded-2xl border flex flex-col transition-all relative ${plan.destacado ? 'border-pink-500 bg-pink-50 shadow-xl scale-105 z-10' : 'border-gray-200 bg-white shadow-lg'}`}>
              
              {plan.destacado && (
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase shadow-md">
                  MÁS COMPLETO
                </span>
              )}

              <h4 className="text-2xl font-bold text-pink-700 mb-2 text-center">{plan.titulo}</h4>
              <p className="text-xs text-pink-600 font-bold mb-4 text-center italic uppercase">{plan.subtitulo}</p>
              <p className="text-sm font-semibold text-gray-800 mb-6">{plan.objetivo}</p>

              {/* 🛡️ SECCIÓN VISIBLE: PENSADO PARA QUIENES 🛡️ */}
              <div className="mb-6">
                <h5 className="text-xs font-bold text-pink-600 uppercase mb-3 text-left">Pensado para quienes:</h5>
                <ul className="text-sm text-gray-700 space-y-2 text-left list-disc pl-4">
                  {plan.paraQuienes.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-8 flex-grow">
                <h5 className="text-xs font-bold text-pink-600 uppercase mb-3 text-left">Qué incluye:</h5>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  {plan.incluye.map((item: string, i: number) => <li key={i} className="flex items-start"><span className="text-green-500 mr-2 font-bold">✓</span> {item}</li>)}
                </ul>
              </div>
              <div className="text-center pt-6 border-t border-pink-100">
                <p className="text-3xl font-black text-gray-800 mb-6">${plan.precio.toLocaleString()} CLP</p>
                <button onClick={() => { setSelectedPlan(plan); setShowContactModal(true); }} className={`w-full py-4 rounded-xl font-bold ${plan.destacado ? 'bg-pink-700 text-white hover:bg-pink-800' : 'bg-pink-600 text-white hover:bg-pink-700'} shadow-md`}>Inscribirme</button>
              </div>
            </div>
          ))}
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
        
              <button onClick={() => ejecutarAccionReserva("carrito")} className="bg-pink-600 text-white py-3 rounded font-bold">Añadir al Carrito</button>
              <button onClick={() => { setShowContactModal(false); setSelectedPlan(null); }} className="bg-gray-200 py-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}