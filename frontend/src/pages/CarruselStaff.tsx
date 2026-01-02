import React from "react";
import "../styles/flipCards.css";

// Importaciones de imágenes
import claudiaI from "../assets/Terapeuta1.jpg";
import paola from "../assets/terapeuta1.jpg"; // Ajustar según corresponda
import paulina from "../assets/Terapeuta11.jpeg";
import mariajose from "../assets/Terapeuta5.jpg";
import sarita from "../assets/sarita.jpeg";
import anaLuisa from "../assets/Terapeuta14.jpeg";
// ... (resto de tus imports de imágenes)

interface StaffMember {
  nombre: string;
  url: string;
  imagen: any;
  descripcion: string;
}

const staffData: Record<string, StaffMember[]> = {
  Elite: [
    { nombre: "Claudia Ibarra", url: "#", imagen: claudiaI, descripcion: "Líder del Programa. Guía el proceso grupal y acompaña la sanación desde el origen sistémico." },
    { nombre: "Paola Quintero", url: "#", imagen: paola, descripcion: "Especialista en lectura consciente y acompañamiento emocional profundo." },
    { nombre: "Paulina Villablanca", url: "#", imagen: paulina, descripcion: "Educadora y terapeuta holística, experta en sanación del niño interior." },
    { nombre: "Gabriela Pinto", url: "#", imagen: claudiaI, descripcion: "Especialista en procesos de transformación y equilibrio energético." },
  ],
  Profesional: [
    { nombre: "Fernanda Arce", url: "#", imagen: claudiaI, descripcion: "Acompañamiento en procesos de sanación profunda y trauma." },
    { nombre: "Brenda Rivas", url: "#", imagen: claudiaI, descripcion: "Terapeuta energética y canalización espiritual." },
    { nombre: "Cindy Palma", url: "#", imagen: claudiaI, descripcion: "Especialista en limpieza y protección del campo energético." },
    { nombre: "Claudia Diaz", url: "#", imagen: claudiaI, descripcion: "Terapeuta de respuesta espiritual y liberación de bloqueos." },
    { nombre: "Maria Jose Corvalan", url: "#", imagen: mariajose, descripcion: "Especialista en regulación emocional y liberación de creencias." },
    { nombre: "Natalie Bonysson", url: "#", imagen: claudiaI, descripcion: "Arteterapia y expresión emocional consciente." },
    { nombre: "Lea Parra", url: "#", imagen: claudiaI, descripcion: "Consteladora familiar y dinámicas sistémicas." },
    { nombre: "Karla Flores", url: "#", imagen: claudiaI, descripcion: "Yogui infantil y movimiento consciente." },
   
  ],
  Básico: [
    { nombre: "Ana Luisa Solervicens", url: "https://www.instagram.com/susurro_ancestralcl/", imagen: anaLuisa, descripcion: "Terapeuta holística y artesana del alma, guiada por sabiduría ancestral y rituales." },
    { nombre: "Anette Wanninger", url: "#", imagen: claudiaI, descripcion: "Apoyo en terapias complementarias y bienestar general." },
    { nombre: "Carolina Jimenez", url: "#", imagen: claudiaI, descripcion: "Terapeuta integral en procesos de reconexión." },
  ],
};

const StaffSection = ({ categoria, integrantes }: { categoria: string; integrantes: StaffMember[] }) => (
  <div className="mb-16">
    <div className="flex items-center mb-8">
      <div className="flex-grow h-px bg-cyan-200"></div>
      <h3 className="px-4 text-2xl font-semibold text-cyan-800 uppercase tracking-widest">
        Staff {categoria}
      </h3>
      <div className="flex-grow h-px bg-cyan-200"></div>
    </div>
    
    <div className="flip-wrapper-container">
      {integrantes.map(({ nombre, url, imagen, descripcion }, index) => (
        <div className="flip-wrapper" key={index}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="flip-card">
            <div className="flip-inner">
              <div className="flip-front">
                <img src={imagen} alt={nombre} className="object-cover w-full h-full" />
                <div className="nombre-overlay">
                  <p>{nombre}</p>
                </div>
              </div>
              <div className="flip-back">
                <p className="font-semibold mb-2">{nombre}</p>
                <p className="text-xs leading-relaxed">{descripcion}</p>
              </div>
            </div>
          </a>
        </div>
      ))}
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