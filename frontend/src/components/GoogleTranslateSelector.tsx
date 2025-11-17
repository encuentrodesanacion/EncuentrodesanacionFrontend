// frontend/src/components/GoogleTranslateSelector.tsx

import { useEffect } from "react";

// --- INTERFAZ DE PROPIEDADES ---
// Definimos la interfaz para tipar la prop 'isVisible'
interface GoogleTranslateSelectorProps {
  isVisible: boolean; // Especificamos que la prop debe ser un booleano
}
// --------------------------------

// Declaración de tipos globales para Google Translate (Mantenemos esto para evitar errores TS 2339)
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: (() => void) | undefined;
  }
}

// Asignamos la interfaz al componente
const GoogleTranslateSelector = ({
  isVisible,
}: GoogleTranslateSelectorProps) => {
  useEffect(() => {
    const INIT_DELAY_MS = 250;

    const timer = setTimeout(() => {
      if (window.google && window.googleTranslateElementInit) {
        const element = document.getElementById("google_translate_element");

        if (element) {
          element.innerHTML = "";

          try {
            if (window.googleTranslateElementInit) {
              window.googleTranslateElementInit();
            }

            // --- PASO CRÍTICO: FORZAR EL CSS DE VISIBILIDAD ---
            // Ajustamos la visibilidad del iframe inyectado
            const googleIframe = document.querySelector(".goog-te-menu-frame");
            if (googleIframe) {
              // Usamos as HTMLElement para asegurar el tipado de TypeScript
              (googleIframe as HTMLElement).style.visibility = "visible";
              (googleIframe as HTMLElement).style.display = "block";
              (googleIframe as HTMLElement).style.opacity = "1";
              (googleIframe as HTMLElement).style.zIndex = "9999999";
            }
          } catch (error) {
            console.error("Error al re-inicializar Google Translate:", error);
          }
        }
      }
    }, INIT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Usamos el estilo 'visibility: hidden' cuando no es visible para mantenerlo en el DOM,
  // y evitamos que sea invasivo.
  return (
    <div
      id="google_translate_element"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        position: "absolute",
      }}
      className="inline-block"
    >
      {/* El widget de Google Translate se insertará aquí */}
    </div>
  );
};

export default GoogleTranslateSelector;
