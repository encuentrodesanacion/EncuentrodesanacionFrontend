import { useNavigate } from "react-router-dom";
import Directora1 from "../assets/Directora.png";
import Webpayplus from "../assets/Webpayplus.png"; // Asegúrate de que esta ruta sea correcta

const QuiénesSomos = () => (
  <section id="quienes-somos" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Quiénes Somos</h2>
    <p>
      <strong>Somos Encuentro de Sanación</strong>. Nosotros, creemos en el
      poder transformador de la sanación holística. Contamos con el mejor equipo
      de terapeutas especializados en diversas disciplinas del ámbito holístico,
      comprometidos con ofrecer un acompañamiento personalizado y respetuoso.
      Juntos, creamos un espacio seguro y amoroso donde cada individuo puede
      explorar su camino de sanación y transformación.
    </p>
  </section>
);

const Directora = () => (
  <section id="directora" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Directora</h2>
    {/* Contenedor para la imagen y el texto de la directora */}
    <div className="flex flex-col md:flex-row md:space-x-8 items-start">
      {/* Imagen de la Directora */}
      <div className="mb-6 md:mb-0 md:w-1/3 flex justify-center md:justify-start">
        <img
          src={Directora1} // ¡Asegúrate de que esta sea la ruta correcta a tu imagen!
          alt="Alice Basay, Directora de Encuentro de Sanación"
          className="w-full h-auto object-cover shadow-lg rounded-xl" // Forma rectangular, bordes suaves
        />
      </div>
      {/* Descripción de la Directora */}
      <div className="md:w-2/3 text-center md:text-left">
        <p>
          <strong>Alice Basay</strong>, con más de 15 años de experiencia como
          terapeuta, es educadora de párvulos de profesión y especialista en el
          método High Scope. Durante 13 años trabajó en contextos vulnerables en
          Santiago de Chile, entregando a sus alumnos una educación diferente y
          disruptiva, con el propósito de despertar el pensamiento crítico y la
          autonomía para enfrentarse al mundo con mejores herramientas.{" "}
          <br></br>
          <br></br>En los últimos años de su carrera como educadora, vivió un
          despertar de conciencia provocado por la energía pleyadiana, lo que la
          llevó a iniciar su camino como terapeuta holística y a acompañar
          procesos de sanación espiritual y expansión de conciencia. Su
          creciente interés por el campo holístico la llevó a formarse en
          diversas técnicas.
          <br></br>
          <br></br>
          Actualmente se desempeña como facilitadora de energía de alta
          vibración (M'ET SAHÍ y PRAJNA MALAKYA), maestra de Tameana,
          canalizadora, lectora de registros akáshicos en todos sus niveles,
          reikista USUI nivel II, y yoguista infantil certificada en el método
          R.Y.E., entre otros. Alice se ha especializado en el trabajo con
          niños, niñas y en la sanación de las heridas de la infancia en
          personas adultas. Es fundadora y directora de “De Serendipia” y del
          proyecto Encuentro de Sanación.
        </p>
      </div>
    </div>
  </section>
);

const Equipo = () => (
  <section id="equipo" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">
      Almas que Sostienen este Proyecto
    </h2>
    <p className="mb-6">
      <em>Encuentro de Sanación</em> es tejido por muchas manos, corazones y
      talentos. Cada ser que colabora aquí sostiene una frecuencia única y
      esencial para que este espacio de transformación florezca en luz y
      propósito.
    </p>

    <ul className="space-y-4">
      <li>
        <strong>Equipo Terapéutico:</strong> Un círculo de terapeutas de la Luz
        con formación en diversas disciplinas holísticas —canalizaciones,
        Tameana, Reiki, registros akáshicos, sanación de la infancia, yoga
        infantil y más. Cada uno comprometido con ofrecer un acompañamiento
        amoroso, profundo y respetuoso.
      </li>
      <li>
        <strong>Desarrollador Web:</strong> Un alquimista digital que ha
        diseñado con amor esta plataforma, integrando tecnología con el alma
        para facilitar la conexión entre quienes buscan y quienes guían el
        camino de la sanación.
      </li>
      <li>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
          <p className="mb-2 sm:mb-0">
            <strong>Integración de Pagos:</strong> Webpay Plus, nuestra pasarela
            de pago segura y confiable, que permite realizar reservas con total
            confianza y fluidez, para que la energía circule en armonía desde el
            primer encuentro.
          </p>
          <img
            src={Webpayplus} // Usa la imagen importada
            alt="Logo de Webpay Plus"
            className="w-32 h-auto object-contain mt-2 sm:mt-0" // Ajusta el tamaño según necesites
          />
        </div>
      </li>
    </ul>
  </section>
);

const PropositoYMision = () => (
  <section id="proposito-mision" className="py-10 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Propósito y Misión</h2>
    <p>
      En <strong>Encuentro de Sanación</strong>, sostenemos el propósito de ser
      un refugio de luz, un espacio seguro, amoroso y consciente donde cada alma
      pueda recordar su verdad, sanar sus heridas más profundas y reconectar con
      la chispa divina que habita en su interior.
      <br />
      <br />
      Nuestra esencia vibra al servicio de quienes anhelan sanar, despertar y
      renacer. Acompañamos el viaje interior hacia la autonomía, el amor propio
      y la expansión espiritual, honrando cada historia, cada infancia, cada
      sombra que se transforma en luz.
      <br />
      <br />
      Somos guías y guardianes del despertar. Facilitamos experiencias
      terapéuticas integrales que armonizan cuerpo, mente y espíritu: desde
      terapias individuales, talleres y encuentros grupales, hasta formaciones
      holísticas que empoderan y liberan.
      <br />
      <br />
      Soñamos y co-creamos un mundo más humano, consciente y conectado —un mundo
      donde el amor es la brújula y la sanación, el camino.
    </p>
  </section>
);

const QuienesSomosPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <QuiénesSomos />
      <Directora />
      <Equipo />
      <PropositoYMision />

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
