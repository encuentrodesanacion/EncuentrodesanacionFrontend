import { useNavigate } from "react-router-dom";

const QuiénesSomos = () => (
  <section id="quienes-somos" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Quiénes Somos</h2>
    <p>
      Somos Encuentro de Sanación, creemos en el poder transformador de la
      sanación holística. Contamos con el mejor equipo de terapeutas
      especializados en diversas disciplinas del ámbito holístico, comprometidos
      con ofrecer un acompañamiento personalizado y respetuoso. Juntos, creamos
      un espacio seguro y amoroso donde cada individuo puede explorar su camino
      de sanación y transformación.
    </p>
  </section>
);

const Directora = () => (
  <section id="directora" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Directora</h2>
    <p>
      Alice Basay, con más de seis años de experiencia como terapeuta, es
      educadora de párvulos de profesión y especialista en el método High Scope.
      Durante 13 años trabajó en contextos vulnerables en Santiago de Chile,
      entregando a sus alumnos una educación diferente y disruptiva, con el
      propósito de despertar el pensamiento crítico y la autonomía para
      enfrentarse al mundo con mejores herramientas. En los últimos años de su
      carrera como educadora, vivió un despertar de conciencia provocado por la
      energía pleyadiana, lo que la llevó a iniciar su camino como terapeuta
      holística y a acompañar procesos de sanación espiritual y expansión de
      conciencia. Su creciente interés por el campo holístico la llevó a
      formarse en diversas técnicas. Actualmente se desempeña como facilitadora
      de energía de alta vibración (M'ET SAHÍ y PRAJNA MALAKYA), maestra de
      Tameana, canalizadora, lectora de registros akáshicos en todos sus
      niveles, reikista USUI nivel II, y yoguista infantil certificada en el
      método R.Y.E., entre otros. Alice se ha especializado en el trabajo con
      niños, niñas y en la sanación de las heridas de la infancia en personas
      adultas. Es fundadora y directora de “De Serendipia” y del proyecto
      Encuentro de Sanación.
    </p>
  </section>
);

// const Trayectoria = () => (
//   <section id="trayectoria" className="py-10 px-6 max-w-4xl mx-auto">
//     <h2 className="text-3xl font-bold mb-4">Trayectoria</h2>
//     <p>Encuentro de Sanación inició el 25 de abril del año 2022 ,</p>
//   </section>
// );

const Proposito = () => (
  <section id="proposito" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Propósito</h2>
    <p>
      Brindar un espacio seguro, amoroso y consciente donde las personas puedan:
      Sanar heridas emocionales profundas Reconectar con su energía vital
      Potenciar su despertar espiritual Fortalecer su autonomía y amor propio
      Acompañar procesos de sanación desde la infancia
    </p>
  </section>
);

const Mision = () => (
  <section id="mision" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Misión de la Empresa</h2>
    <p>
      Nuestra misión es facilitar herramientas y experiencias terapéuticas
      integrales para impulsar el crecimiento personal, la expansión de la
      conciencia y el despertar espiritual de quienes nos eligen. A través de
      terapias individuales, talleres, encuentros grupales y formación
      holística, contribuimos a la creación de un mundo más humano, consciente y
      conectado.
    </p>
  </section>
);

// const Leads = () => (
//   <section id="leads" className="py-10 px-6 max-w-4xl mx-auto text-center">
//     <h2 className="text-3xl font-bold mb-4">Queremos Conocerte Mejor</h2>
//     <p className="mb-6">
//       Completa nuestro formulario y sé parte de nuestra red de transformación.
//     </p>
//     <a
//       href="https://tu-enlace-formulario.com"
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
//     >
//       Completar Formulario
//     </a>
//   </section>
// );

// const Testimonios = () => (
//   <section id="testimonios" className="py-10 px-6 max-w-4xl mx-auto">
//     <h2 className="text-3xl font-bold mb-4">Testimonios de Valientes</h2>
//     <blockquote className="border-l-4 border-green-600 pl-4 italic mb-6">
//       "Gracias a Encuentro de Sanación, he encontrado paz y claridad en mi
//       vida." – Ana G.
//     </blockquote>
//     <blockquote className="border-l-4 border-green-600 pl-4 italic mb-6">
//       "El apoyo y dedicación del equipo transformaron mi camino espiritual." –
//       Carlos M.
//     </blockquote>
//   </section>
// );

const QuienesSomosPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <QuiénesSomos />
      <Directora />
      {/* <Trayectoria /> */}
      <Proposito />
      <Mision />

      {/* <Testimonios /> */}
      <button
        onClick={() => navigate("/#contacto")}
        className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 block mx-auto"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default QuienesSomosPage;
