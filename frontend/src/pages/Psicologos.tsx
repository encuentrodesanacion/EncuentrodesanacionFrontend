import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/tratamientoIntegral.css";
import { useCart, Reserva } from "../pages/CartContext";
import CartIcon from "../components/CartIcon";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Importaciones de imágenes
import Terapeuta1 from "../assets/Terapeuta1.jpg";
import Terapeuta31 from "../assets/Terapeuta31.jpeg";
import Terapeuta5 from "../assets/Terapeuta5.jpg";
import renata from "../assets/renata.jpeg";

import creadorvirtual from "../assets/creadorvirtual.jpg";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  terapeutaId: number;
  description: string;
  opciones: { sesiones: number; precio: number }[];
}

export default function TratamientoHolistico() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
        // Paquete Normal: 4 sesiones @ 120K
        { sesiones: 4, precio: 120000 }, // Paquete CRISIS: 4 sesiones @ 170K (120K + 50K)
        { sesiones: 4, precio: 170000 }, // Paquete Normal: 10 sesiones @ 270K
        { sesiones: 10, precio: 270000 }, // assPaquete CRISIS: 10 sesiones @ 370K (270K + 100K)
        { sesiones: 10, precio: 370000 },
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
    const horaGenerica = "17:00";

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
    <div className="min-h-screen bg-white pt-24 px-6">
           {" "}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">
               {" "}
        <h1 className="text-xl font-semibold text-gray-800">Mente y Ser</h1>
                <CartIcon />       {" "}
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
          <Link
            to="/psicologos"
            className="text-blue-500 hover:text-gray-800 font-bold"
          >
            Mente y Ser
          </Link>
                 {" "}
        </div>
             {" "}
      </header>
           {" "}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
                Volver al Inicio      {" "}
      </button>
           {" "}
      <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
                Bienvenido a Mente y Ser      {" "}
      </h2>
            <br></br>      <br></br>     {" "}
      <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center">
             Porque mereces vivir en armonía contigo y tu entorno, hemos creado
        para ti, querido Valiente, Mente & Ser: Un espacio profesional creado
        para brindarte el sostén psicológico que necesitas. Avanza con certeza y
        de la mano de los mejores profesionales hacia tu bienestar y tu paz.    {" "}
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
              className="w-full h-56 object-cover object-top"
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
                  (op: { sesiones: number; precio: number }, j: number) => {
                    // --- Lógica de Detección de Intervención de Emergencia ---
                    let isCrisisPack = false;
                    if (op.sesiones === 4 && op.precio === 170000) {
                      isCrisisPack = true;
                    } else if (op.sesiones === 10 && op.precio === 370000) {
                      isCrisisPack = true;
                    }
                    // --------------------------------------------------------

                    const buttonText = isCrisisPack
                      ? `${op.sesiones} sesiones + Pack Intervención en Crisis`
                      : `${op.sesiones} sesiones individual clínica`;

                    const finalTitle = t.title;

                    const buttonClass = isCrisisPack
                      ? "w-full mb-2 px-2 py-2 text-sm border rounded bg-pink-800 text-white hover:bg-pink-900 font-bold shadow-md"
                      : "w-full mb-2 px-2 py-2 text-sm border rounded bg-pink-600 text-white hover:bg-pink-700 shadow-sm";

                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() =>
                          reservarSesion(
                            finalTitle,
                            op.sesiones,
                            op.precio,
                            t.terapeuta,
                            t.terapeutaId
                          )
                        }
                        className={buttonClass}
                      >
                                                    {buttonText} ($
                        {op.precio.toLocaleString()} CLP)                      
                             {" "}
                      </button>
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
  );
}
