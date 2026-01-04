import React from "react";
import "../styles/flipCards1.css";

// Importaciones de imágenes
import claudiaI from "../assets/clau.png";
import paola from "../assets/Terapeuta8.jpg"; // Ajustar según corresponda
import paulina from "../assets/Terapeuta11.jpeg";
import gabriela from "../assets/gaby.png";
import fernanda from "../assets/fernanda.png";
import cindy from "../assets/cindy.png";
import brenda from "../assets/brenda.png";
import claudiad from "../assets/claudiadd.png";
import mariajose from "../assets/cote.png";
import natalie from "../assets/nataly.png";
import lea from "../assets/Lea.png";
import karla from "../assets/karla.jpg";
import anaLuisa from "../assets/analuisa.jpg";
import annete from "../assets/Annete.jpg";
import carolina from "../assets/caro.jpg";
// ... (resto de tus imports de imágenes)

interface StaffMember {
  nombre: string;
  url: string;
  imagen: any;
  descripcion: string;
}

const staffData: Record<string, StaffMember[]> = {
  Elite: [
    { nombre: "Claudia Ibarra", url: "https://www.instagram.com/encuentrosdealmas", imagen: claudiaI, descripcion: "Claudia Ibarra Arias ​Transformadora del Ser ​Fundadora de @encuentrosdealmas y especialista en procesos de Sanación Profunda. Claudia integra la estructura y la claridad con un avanzado recorrido en el campo terapéutico, destacando su Doctorado y Master en Trauma Sistémico Informado y su Expertiz en Nuevas Constelaciones Familiares Cuánticas (Insconsfa, Madrid), entre otras especializaciones en Constelaciones Familiares. ​Desde 2018, se desempeña como Docente Formadora de Terapeutas, consolidando varios  métodos propios Terapéuticos con los que suele acompañar procesos de transformación. Su enfoque en este programa combina la Alquimia, el Orden Sistémico y la sanación de orígenes, guiando a los consultantes a través de sus sombras para recuperar su Sabiduría Esencial. ​Con más de una década facilitando Constelaciones y Regresiones a Vidas Pasadas y Despertar Femenino, Claudia ofrece en Sanación Profunda un espacio de profesionalismo, seguridad y evolución, diseñado para quienes buscan no solo entender su historia, sino transformar definitivamente su destino." },
    { nombre: "Paola Quintero", url: "https://www.instagram.com/olas.de.sanacion", imagen: paola, descripcion: "Paola Quintero es terapeuta holística con más de cinco años de experiencia acompañando procesos de sanación emocional, espiritual y energética, tanto en español como en inglés. Su enfoque integra Tarot terapéutico, Astrología Evolutiva, Registros Akáshicos tradicionales y egipcios, cafeomancia y ancestrología, herramientas que le permiten identificar bloqueos psicoemocionales, creencias limitantes y desequilibrios energéticos desde una mirada profunda e integradora."},
    { nombre: "Paulina Villablanca", url: "https://www.instagram.com/gotitasdeamor38", imagen: paulina, descripcion: "Desde el año 2019 que me he dedicado a las terapias holisticas, alli comence con terapia floral, luego en pandemia nacio el interes por incorporar mas recursos a mis consultantes con ello llego las constelaciones, sanacion de niño/a interior y retome las lecturas de tarot; hoy prosigo en la especializacion de dichas terapias, incorporandome como docente en constelaciones familiares y terapia floral ademas constante he ampliado mis conocimiento hacia niños, niñas, adolescentes y neurodiversidad" },
    { nombre: "Gabriela Pinto", url: "https://www.instagram.com/lakinesaludmental_y", imagen: gabriela, descripcion: "Soy una profesional kinesióloga con 7 años de experiencia dedicada a transformar la relación de las personas con su propio cuerpo. A lo largo de mi trayectoria, me he especializado en áreas fundamentales para la calidad de vida, consolidándome como experta en el manejo del estrés y en la rehabilitación de piso pélvico, abordando patologías y disfunciones desde una mirada clínica y empática. Soy una profesional apasionada por la salud integral, con un enfoque humano centrado en la escucha activa y la creación de un espacio seguro en la recuperación, sostenimiento y acompañamiento de cada proceso. Entiendo que cada cuerpo cuenta una historia y mi labor es ser guía para que la historia de mis consultantes deje de ser una de tensión y se convierta en una de bienestar. Mi propósito es acompañarte a redescubrir el lenguaje de tu cuerpo, transformando el dolor y el estrés en libertad de movimiento. A través de un abordaje personalizado, busco no solo tratar el síntoma físico, sino brindar las herramientas necesarias para que cada paciente recupere su autonomía y equilibrio vital." },
  ],
  Profesional: [
    { nombre: "Fernanda Arce", url: "https://www.instagram.com/terapiasluzastral", imagen: fernanda, descripcion: "Soy terapeuta holistica integral con enfoque en Bienestar Integral y Reconexión Consciente. Creo firmemente que el cuerpo no es solo un vehículo, sino el reflejo de nuestra historia, nuestras emociones y nuestra nutrición. Mi misión es acompañar a descifrar el lenguaje del organismo de mis consultantes para sanar desde la raíz, integrando la ciencia de la nutrición con la profundidad de la mente y la energía. Mi Enfoque: Una Integración 360° Mi metodología se basa en tres pilares fundamentales para lograr un cambio sostenible: • Nutrición Consciente y Mindful Eating. • Reprogramación Mental (PNL e Hipnosis). • Equilibrio Holístico." },
    { nombre: "Brenda Rivas", url: "https://www.instagram.com/Trazos_del_alma2024", imagen: brenda, descripcion: "Mi nombre es Brenda Rivas ,nací un 09 de marzo de 1985 en Venezuela,desde la niñez viví en la ciudad de Valencia, una ciudad universitaria, desde la adolescencia me interesaron las ciencias de la salud en especial la cardiología y neurociencias ,esto me llevo a tomar la decisión de ingresar en  la carrera de enfermería en la facultad de ciencias de salud , ejerci en el área de urgencias y cuidados intensivos, en este trayecto como profesional me interesó el impacto emocional en las distintas patologías,lo que me llevo al estudio de el campo emocional y energético  y a el manejo de estos con terapias holisticas, evidencie los beneficios de estas acciones alternativas  y es así como en la actualidad realizó diversas técnicas que abordan este campo, dándole al paciente una atención integral abarcando cuerpo , mente y alma." },
    { nombre: "Cindy Palma", url: "https://www.instagram.com/DesbloqueandotuLuz", imagen: cindy, descripcion: "Hola!! Mi nombre es Cindi Palma, de profesión Asistente Dental y Tens, soy madre y esposa, pero también terapeuta Holística desde hace 5 años. Mi historia comenzó por la necesidad de encontrar respuestas, sanación y claridad en varios aspectos de mi vida, pero también la de querer ayudar a las personas que se encontraban al igual que yo en busca de paz, de conexión y de limpiar nuestra energía. Las terapias que entrego son Liberación de Emociones atrapadas, Vortex Aura Healing, Reiki Usui y Limpieza de Útero con cruz de Ankh. Te acompaño en el proceso de encontrar tú luz, tú escencia, tú sanación. No te digo que será un proceso fácil, pero estaré contigo para guiarte en éste nuevo camino." },
    { nombre: "Claudia Diaz", url: "https://www.instagram.com/maestraclaudiazc", imagen: claudiad, descripcion: "Mi formación base: Educadora y terapeuta en Respuesta Espiritual. Mis especialidades terapéuticas: •	Terapia de Respuesta Espiritual •	Sanación profunda, liberación y desbloqueo energético guiado •	Reprogramación de patrones inconscientes •	Corte y liberación de lazos familiares, lealtades ancestrales y lazos kármicos •	Acompañamiento en procesos grupales y proyectos (espacios de apoyo, orden y conciencia; no procesos de sanación) •	Cierre, integración y relacionamiento 2026 •	Reconexión con el propósito de vida y el poder personal Mi enfoque o método único: Acompaño procesos terapéuticos conectando a cada persona con su propia conciencia, trabajando en colaboración con sus guías espirituales y su yo superior, siempre orientada al mayor bienestar de cada alma. La sanación y los desbloqueos se realizan según las indicaciones que surgen en el espacio terapéutico, facilitando que la persona tome conciencia y, con profundo amor, abrace e integre incluso lo doloroso, transformando su energía desde su interior. Los procesos grupales y proyectos cumplen un rol de acompañamiento, integración, cierre y orden consciente. Mi experiencia: Más de 20 años acompañando procesos educativos y de desarrollo humano, integrando esta experiencia al ámbito terapéutico y espiritual." },
    { nombre: "Maria Jose Corvalan", url: "https://www.instagram.com/lavidaesunasola2019", imagen: mariajose, descripcion: "Soy María José Corvalán, Fonoaudióloga, Life Coach en Psicología Positiva y Terapeuta Holística. Desde hace 5 años trabajo como terapeuta acompaño procesos de liberación emocional, transformación de creencias limitantes y desbloqueo interno. Mi mirada integra la mente y el cuerpo para facilitar cambios profundos y sostenibles en la vida diaria." },
    { nombre: "Natalie Bonysson", url: "https://www.instagram.com/nata_arte_terapia", imagen: natalie, descripcion: "No estoy segura de cuando comencé. Desde muy temprano busqué estar mejor y sin darme cuenta fui entregando lo que recibía y aprendía. Así que me fui formando en Masoterapia (2007), Reflexología podal (2011), Arteterapia (2014), Quirología (2014) y realizando estudios complementarios de Astrología China (2021) y Numerología (2022). Ha sido un camino de crecimiento, conocimiento y entrega agradecida. En ocasiones de 'tiempo completo' y en otras sólo de vez en cuando." },
    { nombre: "Lea Parra", url: "https://www.instagram.com/parraholistica", imagen: lea, descripcion: "Terapeuta especializada en constelaciones familiares y biodecodificacion. Apasionada por trabajar en temas de relaciones, autoestima, prosperidad y propósito. Creando un espacio acogedor y lleno de armonía para tu crecimiento personal." },
    { nombre: "Karla Flores", url: "https://www.instagram.com/Psicologia_333", imagen: karla, descripcion: "He realizado intervenciones terapéuticas a domicilio desde el año 2017, dirigidas a niños, adolescentes, adultos, mujeres embarazadas y animales, integrando enfoques de bienestar físico, emocional y mental. Asimismo, he desarrollado y ejecutado clases de yoga y talleres psicoeducativos orientados a la autorregulación emocional, utilizando estrategias terapéuticas basadas en el yoga restaurativo y en la concientización del manejo y reconocimiento emocional, especialmente en población infantil y adolescente. Cuento con experiencia en el área clínica a través de una pasantía realizada en mi casa de estudios en el último año de la carrera de Psicología, fortaleciendo competencias en evaluación, acompañamiento y abordaje terapéutico. De manera complementaria, he impartido clases de hipertrofia muscular con enfoque terapéutico, orientadas a la restauración de la autoestima y a la mejora de la salud física y mental. Poseo experiencia en el acompañamiento y apoyo en crisis de ansiedad, procesos de duelo, hiperactividad y estrés, abordados desde un enfoque holístico inspirado en el modelo terapéutico del Dr. Bach. Finalmente, cuento con más de diez años de experiencia en la práctica y enseñanza del yoga restaurativo integrando sus principios como herramienta de bienestar integral y desarrollo personal. He pasado por diferentes procesos que me permiten tener una compresión y empatía profunda hacia otros." },
   
  ],
  Básico: [
    { nombre: "Ana Luisa Solervicens", url: "https://www.instagram.com/susurro_ancestralcl/", imagen: anaLuisa, descripcion: "Soy Ana Luisa, terapeuta holística y guía en lecturas de runas ancestrales. Acompaño procesos de autoconocimiento y claridad espiritual, conectando con la sabiduría antigua para iluminar tu camino." },
    { nombre: "Anette Wanninger", url: "https://www.instagram.com/Aricacosmeticanatural", imagen: annete, descripcion: "Empecé con un estudio de Ayurveda en Alemania y en Chile continué con sonoterapia, Reiki, Cromoterapia, Moxibustion, meditación y arteterapia. Hago masajes ayurvedicos, limpiezas faciales curativos. Yo mismo elaboro mis aceites para masajes, tinturas, pomadas, todo que necesito para mis terapias y tés medicinales a base de hierbas." },
    { nombre: "Carolina Jimenez", url: "https://www.instagram.com/bienestar.emocional_vidaplena", imagen: carolina, descripcion: "Cuenta conmigo para hacer una evalucion de las areas mas importantes de tu vida, juntos descubriremos que te impide vivir en equilibrio y armonia, encontrando soluciones desde tu propia claridad mental  y  gestion emocional. Descubriras que con estas herramientas podrás comenzar a disfrutar de una vida plena." },
  ],
};

const StaffSection = ({ categoria, integrantes }: { categoria: string; integrantes: StaffMember[] }) => (
  <div className="mb-16">
    <div className="flex items-center mb-8">
      <div className="flex-grow h-px bg-cyan-200"></div>
      <h3 className="px-4 text-2xl font-semibold text-cyan-800 uppercase tracking-widest text-center">
        Staff {categoria}
      </h3>
      <div className="flex-grow h-px bg-cyan-200"></div>
    </div>
    
    <div className="flip-wrapper-container">
      {integrantes.map(({ nombre, url, imagen, descripcion }, index) => {
        // Determinamos la clase del aura según la categoría de los datos
        const auraClass = 
          categoria === "Elite" ? "aura-elite" : 
          categoria === "Profesional" ? "aura-profesional" : 
          "aura-basic";

        return (
          <div className={`flip-wrapper aura-container ${auraClass}`} key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flip-card">
              <div className="flip-inner">
                {/* Cara Frontal con imagen completa y overlay corregido */}
                <div className="flip-front">
                  <img src={imagen} alt={nombre} className="object-cover w-full h-full" />
                  <div className="nombre-overlay">
                    <p>{nombre}</p>
                  </div>
                </div>

                {/* Cara Trasera con scroll para la descripción */}
                <div className="flip-back">
                  <p className="font-bold text-sm mb-2">{nombre}</p>
                  <div className="descripcion-scroll">
                    <p className="text-xs leading-relaxed">{descripcion}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  </div>
);

const CarruselStaff = () => {
  return (
    <section className="bg-slate-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-cyan-900 mb-4">Nuestro Staff Terapéutico</h2>
          <p className="text-gray-600 max-w-2xl mx-auto italic">
            "Acompañando tu camino de sanación con diferentes niveles de especialización y profundidad."
          </p>
        </div>

        {Object.entries(staffData).map(([categoria, integrantes]) => (
          <StaffSection key={categoria} categoria={categoria} integrantes={integrantes} />
        ))}
      </div>
    </section>
  );
};

export default CarruselStaff;