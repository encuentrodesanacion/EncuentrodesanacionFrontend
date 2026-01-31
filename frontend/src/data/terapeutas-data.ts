import TerapeutaPlaceholder from "../assets/ASTRONAUTA3.png";

import yuniver from "../assets/Alquimia.jpeg";
import amoryconciencia from "../assets/amorycrianza.jpg"
import yuniver2 from "../assets/tarotter.jpg";
import daniela from "../assets/daniela.png";
import movconsc from "../assets/movimientoconsc.png";
import sanardesde from "../assets/sanardesder.png";
import regulacion from "../assets/regulacioncorpo.png";
import sanacion from "../assets/sanacionniño.jpg"
import paola from "../assets/Paolanuevo.png";
import mapeoener from "../assets/mapeoenerget.jpg";
import pactoalma from "../assets/pactoalma.png";
import cerrandociclo from "../assets/cerrandociclo.jpg";
import constelacionclaudia from "../assets/constelacionclaudia.png";
import caro from "../assets/caro.png";

import paulina from "../assets/paulinanuevo.jpg";

import constelacion from "../assets/Constelacionfam.png";

import tarot from "../assets/tarott.png";

import terapiaflor from "../assets/terapiafloral.jpg";

import lea from "../assets/Lea.png";

import constfam from "../assets/Constfam.png";
import caritoef from "../assets/carito ef.png";

import constfam1 from "../assets/constfamgrup.png";

import nataly from "../assets/nataly.png";

import horoscopo from "../assets/horoscopo.png";

import Carta from "../assets/cartanatal.png";

import arteterapia from "../assets/arteterapia.png";

import cote from "../assets/cote.png";

import liberar from "../assets/liberar.png";

import Reset from "../assets/reset.png";

import ansiedad from "../assets/ansiedad.png";

import lissette from "../assets/Lissette.jpg";

import ankh from "../assets/AnhkPr.png";

import vagal from "../assets/Vagal.png";

import alquimiavib from "../assets/Alquimiavib.png";

import gaby from "../assets/gabyy.png";

import rehab from "../assets/gabyy.png";

import vago from "../assets/vago.png";

import piso from "../assets/piso.png";

import cindy from "../assets/cindy.png";

import vortex from "../assets/vortex.png";

import liberacion from "../assets/liberacion.png";

import brenda from "../assets/brenda.jpg";

import canalizacionb from "../assets/canalizacion.jpg";

import tarotttt from "../assets/Tarotpao.png";

import registro from "../assets/Registrospao.png";

import constelacionfam from "../assets/constelacionespao.png";

import fernanda from "../assets/fernanda.png";

import lecturareg from "../assets/lecturareg.png";

import tarotter from "../assets/tarotter.png";

import limpiezaener from "../assets/limpiezaener.png";

import constel from "../assets/constel.png";

import clau from "../assets/claudiaibarra.jpg";

import taller from "../assets/egipto.jpg";

import llamavioleta from "../assets/llamavioleta.png";
import counselin from "../assets/couselin.png";

// import caro from "../assets/caro.jpg";

// import caro from "../assets/caro.jpg";

// import caro from "../assets/caro.jpg";

// import caro from "../assets/caro.jpg";

import elevacion from "../assets/elevacionenergia.png";

// Puedes importar otras imágenes específicas de terapeutas aquí



import abundancia1 from "../assets/abundancia1.png";

import irene from "../assets/Irene.jpg"

import annete from "../assets/Annete.jpg"

import tameana from "../assets/Tameanani.png";

import lecturarunas from "../assets/LecturaRunas.png";

import sonoterapia from "../assets/Sonoterapia.png";

import { TerapiaItem, Terapeuta } from "../types/index";

import alicec from "../assets/Cocrea.jpeg";



export const terapeutasData: Terapeuta[] = [

   {

id: 4,

nombre: "Paulina Villablanca",
isElite: true,

email: "Paulinavipe@gmail.com",

imagenPerfil: paulina, // Reemplaza con la imagen real

callToActionTextCard: "Hola…soy Pauly terapeuta holística y educadora de Parvulos Durante varios años me he dedicado a apoyar procesos de sanación de consultantes, entregándoles las herramientas necesarias para que de esa manera puedan sanar aquello que pesa y no deja avanzar. Principalmente me dedico a constelaciones familiares individuales y grupales, lectura de tarot predictivo y terapéutico, sanación de heridas de infancia, terapia floral. Espero que en este camino también te reencuentres con tu esencia.",

servicios: [

{

 img: constelacion,

 title: "Constelacion Familiar Individual",

 terapeuta: "Paulina Villablanca",

 terapeuta_id: 4,

 description: "Es una tecnica terapeutica para sanar conflictos emocionales y patrones que tienen origen en el sistema familiar .Revela dinamicas o bloqueos que afectan tu vida actual  Beneficios;  comprension del origen de los conflictos, liberacion emocional, reconciliacion con la historia familiar, paz y claridad interior",
precio: 24000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 24000 }],

},

{

 img: tarot,

 title: "Lectura de Tarot Terapéutico",

 terapeuta: "Paulina Villablanca",

 terapeuta_id: 4,

 description: "Tarot Terapeutico (30 minutos):Es una herramienta de autoconocimiento y reflexion.Ayuda a explorar la energia y a reflexionar sobre el presente. Es una guia para conectar con la intuicion y descubrir nuevas perspectivas . No predice, sino que ilumina.",

 precio: 16000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 16000 }],

},

{

 img: terapiaflor,

 title: "Terapia Floral",

 terapeuta: "Paulina Villablanca",

 terapeuta_id: 4,

 description: "Terapia floral: Es una medicina complementaria que tiene por finalidad reestablcer el equilibrio fisico, emocional, mental y espiritual. En cada sesion se identifica el estado emocional actual y se seleccionan las flores mas apropiadas pra cada caso y asi preparar el frasco floral personalizado.",

 precio: 20000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 20000 }],

},
{

 img: sanacion,

 title: "Sanación niño/a interior",

 terapeuta: "Paulina Villablanca",

 terapeuta_id: 4,

 description: "Sanacion niño/a interior: Terapia que utiliza diversas tecnicas y herramientas para procesar y sanar las heridas de infancia (abandono , rechazo, humillacion, traicion y justicia), al reconectar con nuestras heridas de infancia, nos damos a nosotros mismos la oportunidad de sanar, perdonar y amarnos de forma mas profunda.",

 precio: 16000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 16000 }],

},
{

 img: mapeoener,

 title: "Mapeo Energético a través de las cartas del Tarot",

 terapeuta: "Paulina Villablanca",

 terapeuta_id: 4,

 description: "Mapeo energetico a traves de las cartas del tarot: A traves de esta tirada de tarot podremos visualizar como esta nuestra energia, por medio de 12 aspectos que son; tu ser, el valor, comunicacion, hogar, placr, salud, relaciones interpersonales , lecciones de la vida, espiritualidad, carrera o profesion, vision de futuro y que nos menciona tu subconciente.",

 precio: 16000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 16000 }],

},
],

  },
  {

id: 1,

nombre: "Claudia Ibarra",
isElite: true,

email: "cibarraari@gmail.com",

imagenPerfil: clau,

callToActionTextCard:

"Febrero: Rediseña tu Arquitectura del Amor 🏛️✨ El amor no es solo una emoción; es una estructura. Y si los cimientos están dañados, el vínculo no puede sostenerse. Como  Transformación del Ser, este mes te invito a dejar de 'intentar y empezar a ordenar. En @encuentrosdealmas, transmutamos las sombras de la relación en pilares de libertad consciente. ¿Qué conceptos trabajaremos este mes? • Cierre de Ciclos: Liberar el espacio que aún ocupan tus historias pasadas. • Acuerdos de Almas: Identificar los contratos invisibles que rigen tus vínculos. • Alquimia de Sanación: Desimpregnar obstáculos energéticos que bloquean tu fluir con el Amor • Consicencia Sistémica: Revelar la raíz oculta detrás de los celos, la infidelidad y los quiebres en la comunicación. No busques afuera lo que se soluciona en tu diseño interno. Es momento de que el pasado deje de ser una carga y se convierta en el cimiento de un amor con propósito. Sanar es rediseñar el lugar donde habita tu alma con Claudia Ibarra",

 



//   recursos: [

//   {

//    name: "Video Presentación de Taller: El Poder Mágico de las Brujas",

//    url: "https://www.instagram.com/reel/DQpesSPj3sE/?igsh=Y2kxcWE3a3JkdDE3",

//   },

//   {

//    name: "Ver Video: 5 Magias de las brujas ancestrales",

//    url: "https://www.instagram.com/reel/DQmOoocjd6a/?igsh=YzA4emYxdW9va2Zy",

//   },
// {

//    name: "¿Que es el Couseling Terapeútico?",

//    url: "https://www.instagram.com/reel/DMbRdhJx3kY/?igsh=eDE5bjdwMmhjeWw4",

//   },
//   {

//    name: "¿Qué genera el Couseling Terapeútico?",

//    url: "https://www.instagram.com/reel/DHRAVzAx_Eo/?igsh=MWFyYTM4aW5jOWt3eA==",

//   },
  

//   ],

servicios: [

{

 img: pactoalma,

 title: "Constelaciones Familiares-Acuerdos de Almas",

 terapeuta: "Claudia Ibarra",

 terapeuta_id: 1,

 description:

   "ACUERDOS DE ALMAS El Origen y la Evolución del Vínculo de tu Alma Gemela ¿Alguna vez has sentido que tu encuentro con alguien fue un pacto previo al tiempo? Nada es casualidad. En el nivel del alma, las relaciones no son eventos fortuitos, sino contratos sagrados diseñados para nuestra máxima evolución. Este encuentro te invita a mirar el símbolo detrás del vínculo. Nos sumergimos en la dimensión del alma para comprender el acuerdo de tu relación: Beneficio Encuentro: Descubrimos la lección nque ambas almas acordaron trabajar en el conflicto que están presentando Trascender el Conflicto: Entendemos los desafíos actuales no como obstáculos, sino como los catalizadores de crecimiento pactados. Evolución en Pareja: Alineamos la voluntad humana con el acuerdo espiritual para transitar el vínculo desde la sabiduría, lo que aporto y me aporta mi pareja en esta relación ¿Para quién es esta Terapia? Ideal para quienes sienten que 'algo' externo o pesado les impide sentir y amar en sus relaciones, y buscan una intervención de alquimia energética rápida y profunda para recuperar su brillo original. Descubre el Acuerdo Sagrado del Alma de tu relación Sesión Online Zoom : 120 min",

 precio: 60000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 60000 }],

},

{

 img: cerrandociclo,

 title: "Terapia ISA-Cerrando Ciclo con mi Ex",

 terapeuta: "Claudia Ibarra",

 terapeuta_id: 1,

 description:

   "TERAPIA ISA Cerrando Ciclos con los Ex ¿Sientes que una parte de ti sigue anclada a una historia que ya terminó? Para que lo nuevo llegue, lo viejo debe haber ocupado su lugar en el corazón. La Terapia ISA es una intervención profunda de Orden Metafórico y Sistémico diseñada para quienes sienten que, aunque quieren avanzar, siguen emocionalmente 'ocupados' por el pasado. A través de esta metodología, trabajamos la alquimia del cierre definitivo: Identificación de Hilos: Detectamos el vínculo o duelo no resuelto que mantienen tu energía fragmentada. Honrar para Soltar: Aplicamos los principios del orden para dar un lugar digno a lo vivido, lo bueno, lo que dejar e lo que integrar Apertura de Espacio: Vaciamos el recipiente emocional para que la energía del presente se transforme en algo nuevo y esté disponible para ti. ¿Para quién es esta Terapia? Ideal para quienes sienten que su vida se quedó atascada en una relación pasada o sienten que soltaron pero aún hay algo pendiente que no pueden determinar. • La fuerza de estar presente en tu propia vida. Sesión Online Zoom : 120 min",

 precio: 45000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 45000 }],

},   {

 img: taller,

 title: "Terapia Sanación Solar Egipcia-Desimpregnando Obstaculos con el Amor",

 terapeuta: "Claudia Ibarra",

 terapeuta_id: 1,

 description:

   "SANACIÓN SOLAR EGIPCIA Limpieza de Obstáculos en el Amor ¿Sientes una densidad que no te permite conectar desde el corazón? A menudo, el amor no fluye no por falta de ganas, sino por impregnaciones y bloqueos energéticos que vienen desde mucho antes, de otras vidas y que actúan como muros invisibles entre tú y el amor. Es momento de derribar esos muros con la fuerza solar A través de la frecuencia de la Sanación Solar Egipcia, trabajamos en un nivel vibratorio superior para: Desimpregnación Profunda: Limpiamos las energías residuales y densidades que se han adherido a tu campo áurico por experiencias en tus vidas Armonización de Obstáculos: Al liberar las energías de historias impregnadas, restauramos tu capacidad de amar que estaba bloqueado. Alineación con la Luz: Utilizar la geometría y la frecuencia solar para restaurar tu conexión con el amor mayor que habita en ti. ¿Para quién es esta Terapia? Ideal para quienes sienten que 'algo' externo o pesado les impide sentir y amar en sus relaciones, y buscan una intervención de alquimia energética rápida y profunda para recuperar su brillo original. Conectar desde un corazón ligero, libre de muros invisibles. Sesión Online Zoom : 120 min",

 precio: 45000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 45000 }],

},

{

 img: llamavioleta,

 title: "Taller Conexión y Activación Llama Violeta",

 terapeuta: "Claudia Ibarra",

 terapeuta_id: 1,

 description:

   "ACTIVACIÓN DE LA LLAMA VIOLETA Transmutación y Anclaje en Amatista ¿Qué es?  Un taller grupal práctico Online diseñado para quienes buscan limpiar su campo energético y transformar su energía Es el encuentro donde el conocimiento teórico se une al anclaje físico. Lo que viviremos: Origen e INFO: Conocerás las bases y la fuerza espiritual de la Llama Violeta, sus maestros y su propósito cósmico. Transmutación Activa: Aprenderás a utilizar esta frecuencia para transmutar tus energías negativas cuando las sientas y elevar tu vibración personal. El Ritual de Anclaje: Activaremos y sellaremos la energía de la Llama directamente en una drusa de amatista, para que lleves contigo un portal de transmutación permanente a tu espacio sagrado. ¿Para quién es este Taller? Ideal para: Quienes desean una herramienta tangible de limpieza y transmutación energética y un espacio de alquimia sencillo pero profundo. Requisitos: tener una drusa de amatista. Sesión Online Zoom : 150 min",

 precio: 15000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 15000 }],

},
{

 img: constelacionclaudia,

 title: "Taller Constelaciones Familiares",

 terapeuta: "Claudia Ibarra",

 terapeuta_id: 1,

 description:

   "LA SOMBRA SISTÉMICA EN EL AMOR Soltando los Hilos Invisibles del Clan ¿Repites patrones que no te pertenecen pero que parecen dirigir tu vida amorosa? A veces, no amamos desde nuestra libertad, sino desde la lealtad a los dolores no resueltos de nuestros ancestros. La Sombra Sistémica es todo aquello que el clan ha excluido o silenciado, y que hoy busca ser visto a través de tus relaciones. En estos talleres grupales, utilizamos el Orden Sistémico y la alquimia del grupo para: Identificar la Fidelidad: Reconocer qué historias de pareja de tus padres o abuelos estás replicando inconscientemente: los Celos, la Infidelidad y la Comunicación Congelada en la pareja. Mirar lo Excluido: Darle un lugar a los 'secretos' o dolores del pasado que están creando muros en tus vínculos actuales. Liberar el Hilo: Realizar movimientos sistémicos de honra para devolver el destino a quien le pertenece y liberarte para tu propio destino. ¿Para quienes son estos Talleres? Para buscadores que están cansados de tropezar con la misma piedra y están listos para mirar más allá de lo individual, comprendiendo que sanar el origen es la clave para liberar el presente. Fechas de los Talleres: Comunicación Congelada: lunes 2 de febrero La Telaraña de Celos: lunes 9 de febrero Las Redes de la Infidelidad: lunes 23 de febrero Honrar a tu familia sin tener que sacrificar tu propia felicidad Sesión Online Zoom : 180 min cada Taller",

 precio: 20000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 20000 }],

},

],

},
{

id: 2,

nombre: "Gabriela Pinto",
isElite: true,

email: "gabykinetre@gmail.com",

imagenPerfil: gaby,

callToActionTextCard:

"Kinesiología Integral y Bienestar Consciente Mi propósito es acompañarte a redescubrir el lenguaje de tu cuerpo, transformando el dolor y el estrés en libertad de movimiento. Soy una kinesióloga apasionada por la salud integral, con un enfoque humano centrado en la escucha activa y la creación de un espacio seguro para tu recuperación. Entiendo que cada cuerpo cuenta una historia y mi labor es guiarte para que esa historia deje de ser una de tensión y se convierta en una de bienestar.",

servicios: [

{

 img: rehab,

 title: "Rehabilitacion Kinesica /Reconecta tu Ruta Corporal",

 terapeuta: "Gabriela Pinto",

 terapeuta_id: 2,

 description:

   "Si ya normalizaste tensión, inflamación y rigidez corporal, la rehabilitación kinésica es lo que necesitas para recuperar tu ruta corporal y moverte con libertad real. No confundas el entrenamiento de fitness tradicional con el movimiento específico que tu cuerpo necesita liberar. Da el siguiente paso: confía en un profesional experto en movimiento para diseñar un plan personalizado que te guíe de forma segura y eficaz hacia tu mejor versión. ¡Agenda una evaluación hoy y siente la diferencia en tu movimiento!",

 precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},

{

 img: vago,

 title: "Activa tu Nervio Vago - Regula tu Estrés",

 terapeuta: "Gabriela Pinto",

 terapeuta_id: 2,

 description:

   "¿Cuándo fue la última vez que sentiste una relajación profunda y real? La calma y seguridad en el cuerpo es la llave para regular la mente. Como especialista en terapia corporal para la regulación del sistema nervioso, te ayudo a reducir los niveles de cortisol y combatir el estrés crónico. Mi enfoque te permite resetear tu sistema nervioso y recuperar el equilibrio emocional desde lo corporal. Empieza tu viaje hacia una vida más tranquila y equilibrada hoy mismo: agenda tu sesión ahora y descubre cómo puedes sentir alivio real desde el primer encuentro. Haz clic aquí para reservar tu consulta y dar el primer paso hacia tu bienestar.",

 precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

{

 img: piso,

 title: "Rehabilitación Piso Pelvico",

 terapeuta: "Gabriela Pinto",

 terapeuta_id: 2,

 description:

   "Acompaño y apoyo a mujeres en cada etapa de su vida. Te ayudo con molestias frecuentes que muchas veces se viven en silencio, como: -Escapes de orina al toser, reír o hacer fuerza (incontinencia urinaria). -Sensación de peso o de que “algo baja” en la zona íntima (prolapso de órganos). -Dificultad para controlar gases o heces. -Dolor pélvico o molestias en las relaciones sexuales. Estas cosas pueden pasar cuando los músculos que sostienen la vejiga, el útero y el recto están débiles o no funcionan bien, y no deberían ser simplemente “algo con lo que hay que vivir”. Si te cuesta controlar la orina, tienes sensación de presión o dolor, no lo ignores. Agenda una evaluación profesional para recibir un plan de rehabilitación personalizado que te ayude a recuperar control, confianza y comodidad en tu cuerpo.",

 precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},

],

},
{

id: 36,

nombre: "Lissette Ramirez",
isProfesional:true,
email: "vegetalizz2016@gmail.com",

imagenPerfil: lissette,

callToActionTextCard:

"'Especialista en Reconfiguración Vital y Soberanía Somática.' Acompaño principalmente a mujeres a salir del estado de sometimiento biológico y emocional para reclamar su soberanía vital. A través del método ANKIALIS, integro la ingeniería del sistema nervioso y la medicina de frecuencia para reconfigurar la arquitectura del ser. Mi enfoque permite que cada mujer desbloquee su potencial de gozo y creación, transformando una existencia de supervivencia en una vida de expansión consciente y libertad profunda.",

servicios: [

{

 img: ankh,

 title: "Anhk Precisión",

 terapeuta: "Lissette Ramirez",

 terapeuta_id: 36,

 description:

   "Ank Presicion (Reordenamineto de laestructura eneregetica) Es una técnica de alta precisión vibracional que utiliza la geometría sagrada como tecnología de bio-resonancia. A través de la Cruz de Ankh, realizamos un escaneo y diagnóstico de las fugas de vitalidad en el campo electromagnético. No es una terapia pasiva; es una reconfiguración de la arquitectura sutil de cada valiente, eliminando interferencias de baja frecuencia y restaurando el flujo de energía hacia los órganos y sistemas vitales. ¿Qué beneficios entrega? Optimización Energética: Recuperación de la fuerza vital y eliminación del agotamiento crónico. Coherencia Interna: Alineación inmediata entre la intención mental y la capacidad de ejecución física.",

 precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

{

 img: vagal,

 title: "Vagal Flow",

 terapeuta: "Lissette Ramirez",

 terapeuta_id: 36,

 description:

   "Vagal Flow' Una metodología de liberación de memoria celular basada en la neurofisiología y el movimiento consciente. Utilizamos patrones de movimiento específicos para estimular el nervio vago y procesar el trauma almacenado en la fascia. Al movilizar la energía a través de los centros de poder (chakras), logramos una regulación del sistema nervioso que la palabra no puede alcanzar. Es neurobiología en movimiento. ¿Qué beneficios entrega? Resiliencia Polivagal: Capacidad de retornar a un estado de calma y seguridad tras picos de estrés. Soberanía Corporal: Desbloqueo de la pelvis y el torso, permitiendo que el cuerpo vuelva a ser un territorio de placer y no de defensa.",

 precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

 {

 img: alquimiavib,

 title: "Alquimia Vibracional",

 terapeuta: "Lissette Ramirez", //ass

 terapeuta_id: 36,

 description:

   "'Alquimia Vibracional'   Un sistema de modulación emocional mediante el uso de elixires florales de alta pureza. La medicina floral no se receta de forma aislada; se diseña como un soporte vibracional personalizado para sostener los cambios producidos con la Cruz de Ankh y el trabajo somático de 'Vagal Flow'. Es el 'anclaje' químico y energético necesario para que la nueva configuración del ser se estabilice en el día a día. ¿Qué beneficios entrega? Estabilización de Procesos: Evita las crisis de sanación bruscas, permitiendo una transición suave hacia estados de mayor consciencia. Mantenimiento de la Frecuencia: Prolonga los efectos de la sesión presencial u online, creando un campo de protección y claridad mental.",

 precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

],

},
  
{

id: 34,

nombre: "Daniela Cornejo",
isProfesional:true,
email: "kine.raizconsciente@gmail.com",

imagenPerfil: daniela,

callToActionTextCard:

"Mi trabajo se basa en la kinesiología integrativa, con un enfoque que aborda a la persona de manera global: cuerpo físico, sistema nervioso, emociones y hábitos de vida. Las sesiones combinan movimiento consciente y terapia corporal, adaptadas a las necesidades y posibilidades de cada persona. Utilizo herramientas como: Movimiento consciente, yoga adaptado y tai chi, orientados a mejorar la movilidad, disminuir el dolor y regular el sistema nervioso. Ejercicios integrativos, enfocados en la reconexión corporal, la respiración y la conciencia postural. Trabajo manual, incluyendo digitopresión y técnicas de liberación corporal. Tapping y abordaje emocional, para acompañar procesos de estrés, ansiedad, carga emocional y dolor persistente. Además, realizo una evaluación integral, que incluye: Análisis del cuerpo físico y sus compensaciones Revisión del estado bioquímico, hábitos diarios y alimentación Observación del vínculo entre síntomas físicos y aspectos emocionales Mi enfoque no se centra solo en aliviar el síntoma, sino en comprender el origen del malestar y acompañar procesos de cambio reales y sostenibles, promoviendo el empoderamiento de la persona sobre su propia salud. Trabajo especialmente con personas que presentan dolor crónico, estrés, desregulación del sistema nervioso y mujeres que buscan un acompañamiento consciente e integral, respetando siempre el ritmo y la historia de cada cuerpo.",

servicios: [

{

 img: sanardesde,

 title: "Seguimiento 1 a 1 Sana desde la Raíz",

 terapeuta: "Daniela Cornejo",

 terapeuta_id: 34,

 description:

   "🌿 Acompañamiento Integrativo 1:1 Sanar desde la Raíz Formato: 4 sesiones (1 por semana) Duración: 60 a 75 minutos por sesión Modalidad: online Un proceso mensual para personas que desean comprender el origen de su malestar y generar cambios reales y sostenibles en su salud, integrando cuerpo, sistema nervioso, emociones y hábitos de vida. 🧭 ¿Cómo funciona el proceso? El acompañamiento se realiza en 4 sesiones, 1 semanal, con un enfoque progresivo que permite primero comprender, luego regular, después movilizar y finalmente integrar. 📦 Material incluido (entregado desde el inicio) Desde el inicio del proceso, la persona recibe acceso a material digital de apoyo: Guía de hábitos conscientes y autocuidado Guía de alimentación con enfoque antiinflamatorio Meditaciones guiadas y prácticas de regulación emocional Ejercicios de movimiento consciente para el hogar Este material acompaña todo el proceso y permite sostener lo trabajado entre sesiones. 🌸 Beneficios del acompañamiento Mayor comprensión del propio cuerpo Disminución del dolor y la inflamación Regulación del sistema nervioso Cambios sostenibles en hábitos de vida Autonomía y confianza corporal",

 precio: 140000,

 isDisabled: false,

 opciones: [{ sesiones: 4, precio: 140000 }],

},

{

 img: movconsc,

 title: "Movimiento Consciente y Regulación del Sistema Nervioso",

 terapeuta: "Daniela Cornejo",

 terapeuta_id: 34,

 description:

   "Un espacio terapéutico grupal para disminuir estrés, tensión y dolor, reconectar con el cuerpo y aprender herramientas prácticas de autorregulación.",

 precio: 10000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 10000 }],

},

 {

 img: regulacion,

 title: "SESIÓN ÚNICA 1 a 1 Sana desde la Raíz",

 terapeuta: "Daniela Cornejo", //ass

 terapeuta_id: 34,

 description:

   "Una sesión completa y consciente donde abordamos tu molestia principal desde una mirada integrativa. A través del movimiento, la respiración y la regulación del sistema nervioso, no solo buscamos alivio inmediato, sino que te llevas herramientas prácticas para que puedas cuidar y regular tu cuerpo en tu día a día, incluso después de la sesión.",

 precio: 35000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 35000 }],

},

],

},
  
   {

id: 5,

nombre: "Brenda Rivas",
isProfesional:true,
email: "rbrenda895@gmail.com",

imagenPerfil: brenda, // Reemplaza con la imagen real

callToActionTextCard:

"En mi trayectoria en el campo de la salud evidencie como las enfermedades o padecimientos fisicos ,constituian los pilares en los cuidados de enfermeria ,restando importancia al cuerpo energetico por lo que me interese en el estudio de la biodecodificacion emocional,llevandome a profundizar en la filosofia holistica tratando asi al paciente en su totalidad espiritu alma y cuerpo .",
servicios: [

{

 img: canalizacionb,

 title: "Canalización Energética",

 terapeuta: "Brenda Rivas",

 terapeuta_id: 5,

 description:

   "La canalizacion energetica es un metodo terapeutico que busca reconectar con nuestro poder espiritual ,basandose en los conocimientos y habilidades psiquicas de una persona donde se canaliza la informacion que proviene de otras dimensiones .es un proceso mediante el cual el terapeuta conecta con una fuente de sabiduria superior, la informacion recibida durante la  canalizacion nos permite ayudar consultante a liberar y sanar traumas ,dolor ,miedos y bloqueos emocionales ,fisicos energeticos o espirituales.",
precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

],

  },

  {

id: 3,

nombre: "Paola Quintero",
isProfesional:true,

email: "paolaq81@gmail.com",

imagenPerfil: paola, // Reemplaza con la imagen real

callToActionTextCard:

"Acompaño procesos de crecimiento espiritual y autoconocimiento a través del Tarot y la lectura de Registros Akáshicos. Mi intención no es decirle a las personas qué hacer, sino guiarlas con respeto y amor para que puedan reconectar con su intuición, su sabiduría interna y su propio camino. Creo profundamente que cada persona tiene su propia verdad y su propia grandeza. Mi trabajo es ofrecer un espacio seguro, donde puedas mirarte con honestidad, integrar aprendizajes y recordar el poder que ya vive dentro de ti.",
servicios: [

{

 img: tarotttt,

 title: "Tarot",

 terapeuta: "Paola Quintero",

 terapeuta_id: 3,

 description:

   "La lectura de Tarot es un espacio de orientación y claridad que puede ser terapéutico, predictivo o evolutivo, adaptándose a lo que cada persona necesite. A través de las cartas, te acompaño a ordenar ideas, comprender situaciones y encontrar nuevas perspectivas cuando sientes confusión o ciclos repetitivos. El Tarot funciona como una guía que ayuda a tomar decisiones con mayor consciencia. Durante la sesión también integro saberes como la astrología y mensajes de tus guías espirituales, brindando un acompañamiento respetuoso y personalizado.",
precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

{

 img: registro,

 title: "Registros Akashicos",

 terapeuta: "Paola Quintero",

 terapeuta_id: 3,

 description:

   "La lectura de Registros Akáshicos es un espacio profundo de reencuentro con tu alma, donde puedes conectar con tus dones, reconocer tus virtudes y recibir guía de tus maestros espirituales y animales de poder. Esta terapia te permite comprender el plan y los deseos que tu alma ha diseñado para ti. A través de la lectura, también es posible identificar y liberar patrones limitantes, creencias basadas en el miedo y estructuras obsoletas que pueden estar frenando tu crecimiento. Además, facilita comprender el origen de ciertos conflictos, dinámicas familiares o aprendizajes kármicos que siguen influyendo en tu presente, brindándote claridad, integración y mayor conexión contigo misma.",
precio: 35000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 35000 }],

},

{

 img: constelacionfam,

 title: "Constelaciones Familiares",
 terapeuta: "Paola Quintero",

 terapeuta_id: 3,

 description:

   "Las Constelaciones Familiares son un espacio terapéutico que permite observar con amor las dinámicas y vínculos dentro del sistema familiar, ayudando a comprender el origen de conflictos, emociones o patrones que suelen repetirse en la vida. Este trabajo puede ayudar a liberar cargas generacionales, comprender el rol de las “ovejas negras” dentro del árbol genealógico y ordenar energéticamente el sistema familiar, favoreciendo que temas como el amor, el dinero y los vínculos puedan fluir con mayor armonía. También permite reconocer cuando una persona ha tomado roles que no le corresponden, como sentirse responsable emocionalmente de sus padres.",
precio: 35000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 35000 }],

},

],

  },

 

  

 {

id: 11,

nombre: "Lea Parra",
isProfesional:true,

email: "leaparra@gmail.com",

imagenPerfil: lea,

callToActionTextCard:

"Soy consteladora familiar y acompañante en procesos de conciencia y sanacion emocional. Mi enfoque integra las Constelaciones Familiares y la Biodecodificacion, acompañando a las personas a mirar con amor aquello que necesita ser ordenado para que la vida fluya con mas calma, claridad y sentido. Trabajo desde una energia cercana, respetuosa y profunda, creando espacios seguros donde cada persona puede sentirse vista, sostenida y honrada.",

servicios: [

{

 img: constfam,

 title: "Constelación Individual",

 terapeuta: "Lea Parra",

 terapeuta_id: 11,

 description:

   "Las Constelaciones Familiares son una herramienta terapeutica que permite observar dinamicas inconscientes heredadas del sistema familiar que hoy impactan en nuestras relaciones, emociones, salud, prosperidad y proposito. Durante el encuentro: exploramos el motivo de consulta, observamos la dinamica del sistema, permitimos que emerja la informacion necesaria y acompaño el proceso de integracion. El objetivo no es revivir el dolor, sino darle un nuevo lugar.",

 precio: 40000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 40000 }],

},{

 img: constfam1,

 title: "Constelaciones Grupales",

 terapeuta: "Lea Parra",

 terapeuta_id: 11,

 description:

   "Las Constelaciones Familiares grupales de manera presencial, se realizan con un minimo de 5 personas maximo 10, lo que permite una dinamica intima y profunda. a traves de estas constelaciones, acompaño a las personas en el descubrimiento y la resolucion de dinamicas familiares, promoviendo la sanacion y el bienestar integral.",

 precio: 25000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 25000 }],

},

],

},

{

id: 10,

nombre: "Natalie Bonysson",
isProfesional:true,

email: "nbonysson@gmail.com",

imagenPerfil: nataly,

callToActionTextCard:

"Te acompaño en el autoconocimiento, a través de diversas guías para tu propia exploración, tanto de ti como de tus posibilidades.",

servicios: [

{

 img: horoscopo,

 title: "Horóscopo Chino",

 terapeuta: "Natalie Bonysson",

 terapeuta_id: 10,

 description:

   "El Horóscopo colabora en la revisión de ciclos del propio vivir y da una visión panorámica de las distintas posibilidades que pueden resultar de los propios actos y acciones.",

 precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},{

 img: Carta,

 title: "Carta Natal China",

 terapeuta: "Natalie Bonysson",

 terapeuta_id: 10,

 description:

   "La Astrología China, con su cosmovisión, permite reconocerse como parte del mundo y del tiempo. Pudiendo enteneder los elementos que influyen en cada quien para avanzar al equilibrio, a través de la Carta Natal.",

 precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},

{

 img: arteterapia,

 title: "Taller Arteterapéutico: Conectando con el Verano",

 terapeuta: "Natalie Bonysson",

 terapeuta_id: 10,

 description:

   "El Arte-terapia colabora con el autoconocimiento y desarrollo personal, a través de una experiencia artística y terapéutica. Ayudando a prevenir, apoyar, mejorar y/o acompañar algún proceso determinado (individual, familiar, laboral, social, de enfermedad u otro), gracias a la expresión creativa",

 precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},

],

},

{

id: 6,

nombre: "Cindi Palma",
isProfesional:true,

email: "cindipalma20@gmail.com",

imagenPerfil: cindy,

callToActionTextCard:

"¿Cuánto tiempo más vas a cargar con una mochila que ni siquiera es tuya?  A veces el cansancio que sientes no es falta de sueño, es el peso de energías estancadas, de patrones que repites sin entender. Las enfermedades y bloqueos no son accidentes, son el grito de una raíz que pide ser vista. No estoy aquí para decirtr que será un camino pasivo, estoy aquí para sacudirte y acompañarte a transformar ese dolor en paz consciente. ¿Estás list@ para dejar de arrastrar el pasado y vivir TÚ presente?",

servicios: [

{

 img: vortex,

 title: "Vortex Aura Healing",

 terapeuta: "Cindi Palma",

 terapeuta_id: 6,

 description:

   "Es una terapia que se usa para limpiar, purificar, equilibrar el campo energético y los Chakras, eliminando negatividad, bloqueos emocionales y  elevando la vibración personal.",

 precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},  {

 img: liberacion,

 title: "Liberación Emociones Atrapadas",

 terapeuta: "Cindi Palma",

 terapeuta_id: 6,

 description:

   "Con ésta herramienta te ayudo a gestionar y soltar emociones que no supiste manejar en el momento en que ocurrió, que ha quedado estancado en tú inconsciente y está dañando tú salud física y mental. Atrévete a soltar ésta mochila que no te deja avanzar.",

 precio: 35000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 35000 }],

},



],







},
{

id: 13,

nombre: "Carolina Jiménez",
isBasic:true,

email: "caje77@hotmail.com",

imagenPerfil: caro,

callToActionTextCard:

"Cuenta Conmigo para encontrar, desde tu yo interior y desde tu realidad actual, el equilibrio entre tus pensamientos, emociones y acciones. A través del enfoque mental, de una adecuada gestion emocional y de la toma de decisiones conscientes, podrás recuperar el control de tu vida, convertirte en tu mejor versión y comenzar a disfrutar de tu mejor momento.",

servicios: [

{

 img: caritoef,

 title: "Recupera tu Poder",

 terapeuta: "Carolina Jiménez",

 terapeuta_id: 13,

 description:

   "La terapia de Bienestar Emocional consiste, en una primera instancia, en despejar la mente de pensamientos intrusivos, rumiación mental, recuerdos y preocupaciones que ya no forman parte de nuestra realidad presente, pero que nos mantienen en un estado constante de alerta a través de las emociones que generan. Esto nos aleja de la tranquilidad necesaria para gozar de una buena calidad de vida. Es una terapia enfocada en potenciar tus propias habilidades para tomar decisiones alineadas con tu propósito. El trabajo terapéutico contempla 4 fases: Conocerme — Aceptarme — Amarme — Cuidarme. En este proceso trabajamos diversas temáticas desde tu presente y tu necesidad: patrones de conducta, experiencias influyentes, gestión emocional, autoconcepto, desapego y crecimiento personal, entre otros. Es una herramienta diseñada para reconectarte con la experiencia de la vida desde una sintonía de anclaje interior y evolución, experimentando una realidad sin idealismos, pero mucho más plena.",

 precio: 40000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 40000 }],

},

],

},
{

id: 35,

nombre: "Carolina Ortega",
isBasic:true,

email: "medimapualternativa@gmail.com",

imagenPerfil: irene, // Reemplaza con la imagen real

callToActionTextCard:

"Mi nombre es Carolina Ortega, mujer, madre, emprendedora, conocedora y amante de las plantas. Soy una apasionada por el bienestar integral, complementando mis saberes de Terapeuta Holística, Orientadora Familiar y Coach Parental. Con más de 20 años de experiencia trabajando con familias y niñeces en el sector público y privado, descubrí en el año 2019 el poder transformador de las terapias holísticas. Desde entonces, me dedico a acompañar a cada persona en su camino hacia el equilibrio y la armonía en todo su ser. Para acompañarte en tu bienestar realizo las siguientes sesiones: 🪷 Asesoría ma-parental 🪷 Círculos de mujeres 🪷 Reiki Unitario 🪷 Reiki Angélico 🪷 Registros Akáshicos 🪷 Cristales Atlantes 🪷 Péndulo Hebreo 🪷 Biodescodificación Holística 🪷 Flores de Bach 🪷 Sahumerios Mi enfoque es integral, respetuoso y desde el amor, buscando despertar el potencial de cada persona para vivir una vida plena y consciente.",
servicios: [

{

 img: amoryconciencia,

 title: "Amor y consciencia para la crianza",

 terapeuta: "Carolina Ortega",

 terapeuta_id: 35,

 description:

   "Amor y conciencia para la crianza es un espacio que integra la asesoría ma-parental con terapias holísticas, apoyando la maravillosa experiencia de la crianza y sus momentos desafiantes. Por otro lado es un espacio de acompañamiento para niños, niñas y adolescentes con el objetivo de contribuir en el desarrollo sano y saludable de cada pequeñ@ valiente. Con el fin de llegar a mejores resultados y realizar un acompañamiento integral, cada sesión incluye la asesoría ma-parental y una técnica holística a elección; Flores de Bach, Reiki, Cristales Atlantes o Péndulo Hebreo. En el caso de elegir Flores de Bach, estas pueden ser enviadas a tu domicilio 'por pagar' o bien se te entrega la receta floral y puedes acudir a farmacias naturales para su elaboración.",
precio: 30000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 30000 }],

},

],

  },
{

id: 15,

nombre: "Annette Wanninger",
isBasic:true,

email: "anettewanninger@gmail.com",

imagenPerfil: annete,

callToActionTextCard:

"Soy de Alemania y vivo en Chile desde hace 8 años. Desde hace 6 años trabaja como terapeuta holística (sonoterapia, limpieza energética, cromoterapia, arteterapia) además soy instructora de meditación y consultora de Ayurveda. Hago  masajes ayurvedicos, masajes fango, moxibustión, limpieza facial curativa. Como profesora Waldorf y terapeuta trabajo tabién mucho con niños.",

servicios: [

{

 img: sonoterapia,

 title: "Limpieza Energética",

 terapeuta: "Annette Wanninger",

 terapeuta_id: 15,

 description:

   "La sonoterapia es un método médico holístico y alternativo que utiliza específicamente vibraciones, tonos y sonidos (por ejemplo, de cuencos tibetanos) para promover una relajación profunda, reducir el estrés, liberar bloqueos internos y aumentar el bienestar físico y mental al poner el cuerpo y la mente en resonancia y estimular los procesos de autocuración. A menudo afecta a todo el cuerpo, ya que se compone aproximadamente de un 75 % de agua, que conduce las vibraciones y se utiliza para aliviar el estrés, la tensión, las molestias psicosomáticas o para favorecer la circulación sanguínea. La sonoterapia se acompaña de una meditación guiada, que tiene un efecto muy relajante y abre el cuerpo y la mente a la sonoterapia.",

 precio: 20000,

 isDisabled: false,

 opciones: [{ sesiones: 1, precio: 20000 }],

},

],

},
 

  //   {

  // id: 17,

  // nombre: "Alice Basay",

  // email: "de.serendipia@gmail.com",

  // imagenPerfil: alicc, // Reemplaza con la imagen real

  // callToActionTextCard:

  //"Te guío a manifestar riqueza sostenible. Como Maestra Pleyadiana de Abundancia, desbloqueo tu Energía Vital a nivel de ADN para que el flujo de prosperidad sea constante y alegre.",

  // enlaceMeet: "https://meet.google.com/xyz-abc-123",

  // recursos: [

  //{

  //  name: "Código de Esencia: Desbloquea la Confianza y el Propósito Único.",

  //  url: "https://url-a-tu-servidor.com/documentos/guia-meditacion.pdf",

  //},

  //{

  //  name: "Ver Video: Preparación para Sesión",

  //  url: "https://youtube.com/video-de-preparacion",

  //},

  //{

  //  name: "Preguntas Frecuentes",

  //  url: "https://encuentrodesanacion.com/faq",

  //},

  //  {

  //  name: "Testimonios",

  //  url: "https://encuentrodesanacion.com/faq",

  //},

  // ],

  // servicios: [

  //{

  //  img: elevacion,

  //  title: "Regresión",

  //  terapeuta: "Alice Basay",

  //  terapeuta_id: 17,

  //  description:

  //"¿Estás agotado y frustrado de que tu cansancio te robe las mejores oportunidades, dejándote sin la energía vital que necesitas para crear la vida que deseas? En este ciclo de 3 noches, no solo sentirás alivio, sino que recuperarás la frecuencia de tu luz y la claridad mental para que puedas romper el ciclo de fatiga y vivir en un estado de vitalidad y enfoque. Esto es posible porque, a través de una re-calibración energética profunda, mi método garantiza la limpieza de la densidad y la rápida recarga de tu sistema, devolviéndote a tu centro en tan solo 3 sesiones.",



  //  precio: 65000,

  //  isDisabled: false,

  //  opciones: [{ sesiones: 1, precio: 65000 }],

  //},

  //{

  //  img: tameana,

  //  title: "Tameana niños",

  //  terapeuta: "Alice Basay",

  //  terapeuta_id: 17,

  //  description:

  //"¿Estás preocupado/a de que tu hijo/a no logre conectar con su potencial único, o sientes que tus heridas de infancia te siguen limitando hoy? En este proceso de 3 sesiones, tu hijo/a (o tu niño/a interior) no solo sentirá calma, sino que potenciará sus dones, habilidades y fortalezas con total confianza, abriendo sus propios caminos para ser y hacer exactamente lo que vino a realizar. Esto es posible gracias a una Terapia de Alta Vibración canalizada enfocada en la esencia pura del alma, garantizando la activación de su potencial y la sanación de las memorias de dolor de la infancia, creando un futuro de mayor plenitud, seguridad y propósito.",

  //  precio: 150000,

  //  isDisabled: false,

  //  opciones: [{ sesiones: 1, precio: 150000 }],

  //},

  //{

  //  img: abundancia1,

  //  title: "Manifestación del dinero",

  //  terapeuta: "Alice Basay",

  //  terapeuta_id: 17,

  //  description:

  //"¿Estás cansado de esforzarte y sentir que el dinero se escapa, como si un bloqueo invisible impidiera la riqueza que mereces? Este Protocolo de 4 Noches te transformará en el imán de abundancia que estás destinado a ser, haciendo que la prosperidad fluya hacia ti con facilidad y de forma sostenible. Esto es posible porque iniciamos con una Elevación de Energía Vital para limpiar tu sistema y prepararlo para la alta frecuencia, seguido por tres noches de re-calibración profunda y focalizada en eliminar toda resistencia y anclar tu máximo merecimiento financiero.",

  //  precio: 115000,

  //  isDisabled: false,

  //  opciones: [{ sesiones: 3, precio: 115000 }],

  //},

  //{

  //  img: yuniver,

  //  title: "Cruz de Anhk",

  //  terapeuta: "Alice Basay",

  //  terapeuta_id: 17,

  //  description:

  //"En estas sesiones...",

  //  precio: 115000,

  //  isDisabled: false,

  //  opciones: [{ sesiones: 3, precio: 115000 }],

  //},

  //{

  //  img: yuniver2,

  //  title: "Puya",

  //  terapeuta: "Alice Basay",

  //  terapeuta_id: 17,

  //  description:

  //"En estas terapias...",

  //  precio: 115000,

  //  isDisabled: false,

  //  opciones: [{ sesiones: 3, precio: 115000 }],

  //},

  // ],

  // },

  

  

  // Añade más terapeutas y sus servicios aquí

];