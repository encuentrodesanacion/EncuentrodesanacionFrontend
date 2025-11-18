import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "../pages/CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import Terapeuta31 from "../assets/Terapeuta31.jpeg";
import informe from "../assets/INFORME PSICODIA.jpg";
import renata from "../assets/renata.jpeg";

import creadorvirtual from "../assets/creadorvirtual.jpg";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

interface OpcionSesion {
  sesiones: number;
  precio: number;
  title?: string; // Permitir título opcional para el botón (usado en informes)
  subOptions?: { especialidad: string; precioFinal: number }[]; // Permitir subopciones anidadas
}
interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  terapeutaId: number;
  description: string;
  opciones: OpcionSesion[];
}

export default function TratamientoHolistico() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [currentTerapiaData, setCurrentTerapiaData] = useState<{
    terapiaTitle: string;
    sesiones: number;
    precio: number;
    terapeutaNombre: string;
    terapeutaId: number;
  } | null>(null);
  // Dentro de TratamientoHolistico()
  const [visibleSubOptions, setVisibleSubOptions] = useState<number | null>(
    null
  );
  const terapias: TerapiaItem[] = [
    {
      img: renata,
      title:
        "Psicoterapia Clínica con especialidad en neurodivergencias (TETP-C, TDAH, Bipolaridad y depresión)",
      terapeuta: "Renata Santoro",
      terapeutaId: 29,
      description:
        "Con 15 años de experiencia en intervenciones en crisis. Es una herramienta poderosa para la conexión con lo divino u el crecimiento personal. Es una forma de recibir orientación espiritual, sanar emocionalmente y obtener claridad sobre diversos aspectos de la vida",
      opciones: [
        { sesiones: 1, precio: 40000 }, // Sesión Individual Normal: 1 @ 40.000
        { sesiones: 4, precio: 140000 }, // Paquete Normal: 4 @ 140.000assas
        { sesiones: 8, precio: 220000 }, // Paquete Normal: 8 @ 220.000 (Añadido) // --- PRECIOS DE INTERVENCIÓN EN CRISIS (Mantenidos) ---
        { sesiones: 1, precio: 100000 },
        // Intervención en crisis: 1 @ 100.000
        // Paquete CRISIS: 10 @ 370.000
      ],
    },
    {
      img: informe, // Usando una imagen existente
      title: "Informes Psicodiagnósticos (4 Sesiones + Informe)",
      terapeuta: "Renata Santoro",
      terapeutaId: 29, // ID genérico para este servicio grupal/especializado
      description:
        "Evaluación exhaustiva que incluye 4 sesiones de psicoterapia para el proceso de diagnóstico y la entrega de un informe completo y detallado, orientado a la comprensión profunda del caso.",
      opciones: [
        {
          sesiones: 4,
          precio: 180000,
          subOptions: [
            { especialidad: "Niños y Adolescentes", precioFinal: 180000 },
            { especialidad: "Adultos", precioFinal: 180000 },
            { especialidad: "Habilidades Parentales", precioFinal: 180000 },
          ],
        },
      ],
    },

    // {
    //   img: renata,
    //   title: "Regresión",
    //   terapeuta: "Alice Basay",
    //   terapeutaId: 10,
    //   description:
    //     "Con 15 años de experiencia en intervenciones en crisis. Es una herramienta poderosa para la conexión con lo divino u el crecimiento personal. Es una forma de recibir orientación espiritual, sanar emocionalmente y obtener claridad sobre diversos aspectos de la vida",
    //   opciones: [
    //     // Paquete Normal: 4 sesiones @ 120K
    //     { sesiones: 4, precio: 120000 }, // Paquete CRISIS: 4 sesiones @ 170K (120K + 50K)
    //     { sesiones: 4, precio: 170000 }, // Paquete Normal: 10 sesiones @ 270K
    //     { sesiones: 10, precio: 270000 }, // Paquete CRISIS: 10 sesiones @ 370K (270K + 100K)
    //     { sesiones: 10, precio: 370000 },
    //   ],
    // },
  ];

  const reservarSesion = (
    terapiaTitle: string,
    sesiones: number,
    precio: number,
    terapeutaNombre: string,
    terapeutaId: number
  ) => {
    if (
      !terapiaTitle ||
      typeof terapiaTitle !== "string" ||
      terapiaTitle.trim() === ""
    ) {
      alert("Error: El nombre del servicio no es válido.");
      console.error("Servicio inválido detectado:", terapiaTitle);
      return;
    }
    if (typeof precio !== "number" || isNaN(precio) || precio <= 0) {
      alert("Error: El precio no es válido o es cero.");
      console.error("Precio inválido detectado:", precio);
      return;
    }

    setCurrentTerapiaData({
      terapiaTitle,
      sesiones,
      precio,
      terapeutaNombre,
      terapeutaId,
    });
    setShowContactModal(true);
    setClientName("");
    setClientPhone("");
    console.log("--- DEBUG: Modal de contacto abierto para reservarSesion ---");
  };

  const handleConfirmAndAddToCart = async () => {
    if (!currentTerapiaData) {
      console.error("Error: currentTerapiaData es nulo al confirmar.");
      alert("Hubo un error al procesar tu reserva. Intenta de nuevo.");
      return;
    }

    if (clientName.trim() === "" || clientPhone.trim() === "") {
      alert("Por favor, ingresa tu nombre completo y número de teléfono.");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(clientPhone.trim());

    if (!phoneNumber || !phoneNumber.isValid()) {
      alert(
        "Por favor, ingresa un número de teléfono válido con código de país (ej. +56912345678 o +34699111222)."
      );
      return;
    }

    const detectedCountry = phoneNumber.country || "Desconocido";
    console.log("País detectado por número telefónico:", detectedCountry);

    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0];
    const horaGenerica = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: undefined,
      hour12: false,
    });

    const reservaDataToSend = {
      servicio: "Mente y Ser",
      especialidad: currentTerapiaData.terapiaTitle,
      fecha: fechaActual,
      hora: horaGenerica,
      precio: currentTerapiaData.precio,
      sesiones: currentTerapiaData.sesiones,
      cantidad: 1,
      nombreCliente: clientName.trim(),
      telefonoCliente: clientPhone.trim(),
      terapeuta: currentTerapiaData.terapeutaNombre,
      terapeutaId: currentTerapiaData.terapeutaId,
    };

    console.log(
      "Objeto Reserva a añadir al carrito desde Mente y Ser (después de modal):",
      reservaDataToSend
    );

    try {
      // Inicio del bloque `try` para la llamada al backend
      const response = await fetch(`${API_BASE_URL}/reservar-directa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaDataToSend),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage =
          errorBody.mensaje ||
          `Error al confirmar la inscripción: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const { reserva: confirmedReservation } = await response.json();

      console.log(
        "Reserva de Mente y Ser confirmada por backend:",
        confirmedReservation
      );

      addToCart(confirmedReservation); // Añadir la reserva completa del backend al carrito

      alert(
        `Reserva agregada: ${confirmedReservation.sesiones} sesiones de ${confirmedReservation.especialidad} con ${confirmedReservation.terapeuta}`
      ); // Cierra el modal y resetea estados

      setShowContactModal(false);
      setCurrentTerapiaData(null);
      setClientName("");
      setClientPhone("");
    } catch (error: any) {
      // Cierre del `try` y comienzo del `catch`
      console.error("ERROR al crear la reserva de Mente y Ser:", error);
      alert(`No se pudo completar la inscripción: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
            {/* --- INICIO DEL HEADER Y NAVEGACIÓN --- */}     {" "}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-20 flex justify-between items-center px-5 py-5">
                {/* Título de la Página (Ajustado) */}       {" "}
        <h1 className="text-xl font-semibold text-gray-800 z-50">
                    Mente & Ser  {" "}
        </h1>
                {/* ⬅️ CONTENEDOR FLEXIBLE DE ÍCONOS (Móvil) ⬅️ */}       {" "}
        {/* Usamos ml-auto y -mr-4 para desplazar a la izquierda y separar del carrito */}
               {" "}
        <div className="flex items-center gap-4 md:hidden ml-auto -mr-4">
                    {/* 1. Botón Hamburguesa */}         {" "}
          <button
            className="p-2 text-gray-700 hover:text-pink-600 focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
                       {" "}
            {isMenuOpen ? (
              // Icono X (Cerrar)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
                             {" "}
              </svg>
            ) : (
              // Icono Menú Hamburguesa
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
                             {" "}
              </svg>
            )}
                     {" "}
          </button>
                    {/* Icono del Carrito (se mantiene) */}         
        </div>
                {/* --- MENÚ ESCRITORIO (md:flex) --- */}       {" "}
        {/* Esto solo se muestra en PC (md:flex) */}       {" "}
        <div className="hidden md:flex items-center justify-start gap-6 p-4 pl-2 ml-auto md:mr-20">
                   {" "}
          <Link
            to="/terapeutasdeluz"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Terapeutas de la Luz          {" "}
          </Link>
                   {" "}
          <Link
            to="/tratamientointegral"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Tratamiento Int.          {" "}
          </Link>
                   {" "}
          <Link
            to="/tallermensual"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Talleres Mensuales          {" "}
          </Link>
                   {" "}
          <Link
            to="/psicologos"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        Mente y Ser          {" "}
          </Link>
                   {" "}
          <Link
            to="/giftcard"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
                        GiftCards          {" "}
          </Link>
                 {" "}
        </div>
             {" "}
      </header>
            {/* --- MENÚ DESPLEGABLE (MÓVIL) --- */}     {" "}
      {/* Se muestra si isMenuOpen es true y solo en pantallas pequeñas (md:hidden) */}
           {" "}
      <div
        className={`fixed top-16 left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 py-4"
            : "max-h-0 opacity-0 overflow-hidden"
        } z-40`}
      >
               {" "}
        <div className="flex flex-col items-center space-y-3 px-4">
                    {/* Enlaces del menú móvil */}         {" "}
          {[
            { to: "/terapeutasdeluz", label: "Terapeutas de la Luz" },
            { to: "/tratamientointegral", label: "Tratamiento Int." },
            { to: "/tallermensual", label: "Talleres Mensuales" },
            { to: "/psicologos", label: "Mente y Ser" },
            { to: "/giftcard", label: "GiftCards" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
              className="text-lg text-gray-800 hover:text-pink-600 py-2 w-full text-center border-b border-gray-100"
            >
                            {item.label}           {" "}
            </Link>
          ))}
                 {" "}
        </div>
             {" "}
      </div>
            {/* --- FIN DEL NAVEGADOR MÓVIL --- */}     {" "}
      {/* Botón de volver a Servicios (ajustado para que no lo tape el menú móvil) */}
           {" "}
      <div
        style={{
          padding: "2rem",
          paddingTop: "6rem",
          backgroundColor: "#fefefe",
          minHeight: "100vh",
        }}
      >
             
        <button
          onClick={() => navigate("/servicios")}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
                    Volver a Servicios        {" "}
        </button>
             {" "}
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
                  Bienvenido a Mente y Ser      {" "}
        </h2>
              <br></br>      <br></br>     {" "}
        <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
               Querido VALIENTE: Porque mereces vivir en armonía contigo y tu
          entorno, hemos creado para ti, Mente & Ser: Un espacio profesional
          creado para brindarte el sostén psicológico que necesitas. Avanza con
          certeza y de la mano de los mejores profesionales hacia tu bienestar y
          tu paz.   {" "}
        </p>
              <br></br>      <br></br>     {" "}
        {/* NUEVA ESTRUCTURA VISUAL - ESTILO TALLERES */}     {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                 {" "}
          {terapias.map((t: TerapiaItem, i: number) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] border border-pink-100"
            >
              {/* Imagen del Terapeuta */}             {" "}
              <img
                src={t.img}
                alt={t.terapeuta}
                className="w-full h-64 object-contain object-center"
              />
              {/* Contenido Principal de la Tarjeta */}             {" "}
              <div className="p-4 flex flex-col">
                {" "}
                {/* Eliminado h-full para no forzar la altura */}               {" "}
                <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-tight">
                                    {t.title}               {" "}
                </h3>
                               {" "}
                <p className="text-sm text-pink-600 font-bold mb-3">
                                    Terapeuta: {t.terapeuta}               {" "}
                </p>
                               
                {/* Descripción (Usamos una altura máxima definida y scroll) */}
                               {" "}
                <p className="text-gray-600 text-sm mb-4 overflow-y-auto max-h-32">
                  {" "}
                  {/* Aumentado max-h a 32 */}                  {t.description} 
                               {" "}
                </p>
                               
                {/* Formulario de Opciones de Sesión (Siempre visible) */}     
                         {" "}
                <form
                  className="w-full mt-2 pt-2 border-t border-gray-100" // Añadido border-t para separador visual
                  onSubmit={(e) => e.preventDefault()}
                >
                                   {" "}
                  {t.opciones.map(
                    (
                      op: {
                        sesiones: number;
                        precio: number;
                        subOptions?: {
                          especialidad: string;
                          precioFinal: number;
                        }[];
                      },
                      j: number
                    ) => {
                      // --- Lógica de Detección de Intervención de Emergencia ---
                      let isCrisisPack = false;
                      let isPsychodiagnostic =
                        op.subOptions && op.subOptions.length > 0; // Identificar informe

                      if (op.sesiones === 4 && op.precio === 170000) {
                        isCrisisPack = true;
                      } else if (op.sesiones === 10 && op.precio === 370000) {
                        isCrisisPack = true;
                      } else if (op.sesiones === 1 && op.precio === 100000) {
                        isCrisisPack = true;
                      } // --------------------------------------------------------

                      let buttonText;
                      let buttonTitle = `${op.precio.toLocaleString()} CLP`;
                      const optionKey = i * 1000 + j; // Clave única para el estado

                      if (isPsychodiagnostic) {
                        buttonText = "Informes Psicodiagnósticos";
                        buttonTitle = `${op.precio.toLocaleString()} (Ver opciones)`;
                      } else if (op.sesiones === 1 && op.precio === 100000) {
                        buttonText = "Intervención en crisis";
                      } else if (isCrisisPack) {
                        buttonText = `${op.sesiones} sesiones + Pack Intervención en Crisis`;
                      } else if (op.sesiones === 1 && op.precio === 40000) {
                        buttonText = "Sesión Individual Clínica";
                      } else {
                        buttonText = `${op.sesiones} sesiones individual clínica`;
                      }

                      const finalTitle = t.title;

                      const buttonClass =
                        isCrisisPack || isPsychodiagnostic
                          ? "w-full mb-2 px-2 py-2 text-sm border rounded bg-pink-800 text-white hover:bg-pink-900 font-bold shadow-md"
                          : "w-full mb-2 px-2 py-2 text-sm border rounded bg-pink-600 text-white hover:bg-pink-700 shadow-sm";

                      return (
                        <React.Fragment key={j}>
                          <button
                            type="button"
                            onClick={() => {
                              if (isPsychodiagnostic) {
                                // Muestra/Oculta sub-opciones
                                setVisibleSubOptions(
                                  visibleSubOptions === optionKey
                                    ? null
                                    : optionKey
                                );
                              } else {
                                // Procede a la reserva normal
                                reservarSesion(
                                  finalTitle,
                                  op.sesiones,
                                  op.precio,
                                  t.terapeuta,
                                  t.terapeutaId
                                );
                              }
                            }}
                            className={buttonClass}
                          >
                                                                {buttonText} ($
                                                              {buttonTitle})    
                                                       {" "}
                          </button>
                          {/* Lógica para desplegar sub-opciones del Informe */}
                          {isPsychodiagnostic &&
                            visibleSubOptions === optionKey &&
                            op.subOptions && (
                              <div className="flex flex-col space-y-1 ml-2 mt-1 mb-2 border-l-2 border-pink-500 pl-2">
                                <p className="text-xs text-gray-500 font-semibold">
                                  Selecciona enfoque del informe:
                                </p>
                                {op.subOptions.map((subOp, subJ) => (
                                  <button
                                    key={subJ}
                                    type="button"
                                    onClick={() => {
                                      // Usamos la especialidad de la subOp, pero el precio y sesiones del padre
                                      reservarSesion(
                                        `${finalTitle} - ${subOp.especialidad}`, // Título detallado
                                        op.sesiones,
                                        subOp.precioFinal,
                                        t.terapeuta,
                                        t.terapeutaId
                                      );
                                      setVisibleSubOptions(null); // Cerrar después de seleccionar
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-pink-300 text-pink-900 hover:bg-pink-400"
                                  >
                                    {subOp.especialidad} (${" "}
                                    {subOp.precioFinal.toLocaleString()} CLP)
                                  </button>
                                ))}
                              </div>
                            )}
                                                   {" "}
                        </React.Fragment>
                      );
                    }
                  )}
                                 {" "}
                </form>
                             {" "}
              </div>
                         {" "}
            </div>
          ))}
               {" "}
        </div>
              {/* --- MODAL DE CONTACTO --- */}     {" "}
        {showContactModal && currentTerapiaData && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
                     {" "}
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
                         {" "}
              <h3 className="text-xl font-semibold mb-4 text-center">
                              Reservar: "{currentTerapiaData.terapiaTitle}"    
                       {" "}
              </h3>
                         {" "}
              <p className="text-gray-700 mb-4 text-center">
                              Ingresa tus datos para continuar con la reserva de
                             {" "}
                <strong>
                                  {currentTerapiaData.sesiones} sesiones por $  
                                {currentTerapiaData.precio.toLocaleString()} CLP
                               {" "}
                </strong>
                              .            {" "}
              </p>
                         {" "}
              <div className="mb-4">
                             {" "}
                <label
                  htmlFor="clientName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                                  Nombre Completo:              {" "}
                </label>
                             {" "}
                <input
                  type="text"
                  id="clientName"
                  placeholder="Tu Nombre Completo"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                           {" "}
              </div>
                         {" "}
              <div className="mb-6">
                             {" "}
                <label
                  htmlFor="clientPhone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                                  Número de Teléfono:              {" "}
                </label>
                             {" "}
                <input
                  type="tel"
                  id="clientPhone"
                  placeholder="Ej: +56912345678"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
                           {" "}
              </div>
                         {" "}
              <div className="flex justify-end space-x-3">
                             {" "}
                <button
                  onClick={() => setShowContactModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                                  Cancelar              {" "}
                </button>
                             {" "}
                <button
                  onClick={handleConfirmAndAddToCart}
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors duration-200"
                >
                                  Confirmar y Añadir al Carrito              {" "}
                </button>
                           {" "}
              </div>
                       {" "}
            </div>
                   {" "}
          </div>
        )}
           {" "}
      </div>
    </div>
  );
}
