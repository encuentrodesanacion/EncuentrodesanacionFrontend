import { useNavigate } from "react-router-dom";
import Alice from "../assets/Alice.png"; // Asegúrate de que la ruta de la imagen es correcta

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
    {/* Imagen de Alice Basay como cabecera */}
    <img
      src={Alice} // La fuente de la imagen es la importación de Alice.png
      alt="Alice Basay, Directora de Encuentro de Sanación" // Texto alternativo para accesibilidad
      // Clases de Tailwind CSS para estilo: eliminamos 'rounded-full'
      // y puedes ajustar w-full (ancho completo) o un ancho fijo como w-64, w-80, etc.
      // Aquí utilizo un ancho fijo de w-64 para que no ocupe todo el espacio.
      // Puedes ajustar 'h-auto' para mantener la proporción o un 'h-64' si quieres un cuadrado.
      className="w-64 h-auto mx-auto mb-6 object-cover shadow-lg"
    />
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
      Somos un refugio para el alma. En Encuentro de Sanación, creamos un
      ambiente de confianza y consciencia para que cada persona pueda iniciar o
      continuar su viaje interior. Te acompañamos a transformar el dolor en
      poder, a reconectar con la vitalidad que reside en ti y a expandir tu
      consciencia espiritual. Nuestro propósito es que fortalezcas tu amor
      propio y tu capacidad de autogestión emocional, brindándote las
      herramientas para sanar desde la raíz y construir un presente más libre y
      auténtico.
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

const QuienesSomosPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <QuiénesSomos />
      <Directora />
      <Proposito />
      <Mision />

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
