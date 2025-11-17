// frontend/src/components/LanguageSwitcher.tsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GoogleTranslateSelector from "./GoogleTranslateSelector";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  // Estado para controlar si el widget de Google Translate (y las opciones) deben ser visibles
  const [showGoogleTranslate, setShowGoogleTranslate] = useState(false);

  const handlei18nChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (selectedValue === "es" || selectedValue === "en") {
      i18n.changeLanguage(selectedValue);
      // Al seleccionar un idioma i18next, ocultamos el widget de Google
      setShowGoogleTranslate(false);
    } else if (selectedValue === "google_translate") {
      // Al seleccionar 'Traducir', mostramos las opciones
      setShowGoogleTranslate(true);
    }
  };

  // Determina qué opción debe aparecer seleccionada en el menú desplegable
  const currentValue = showGoogleTranslate
    ? "google_translate"
    : i18n.language.startsWith("en")
    ? "en"
    : "es";

  // Bandera para saber si el idioma actual es Inglés y el selector de Google está oculto
  const isEnglishReduced =
    i18n.language.startsWith("en") && !showGoogleTranslate;

  return (
    <div className="relative">
      {/* 1. SELECTOR COMPLETO (Se muestra si es ES) */}
      {!showGoogleTranslate && !isEnglishReduced && (
        <select
          onChange={handlei18nChange}
          value={currentValue}
          className="p-2 border border-gray-400 rounded bg-white text-gray-800 text-sm cursor-pointer"
          aria-label={t("language_selector_label", "Seleccionar Idioma")}
        >
          <option value="es">Español (ES)</option>
          <option value="en">English (EN)</option>
          <option value="google_translate">
            {t("translate_option", "Traducir a otros idiomas...")}
          </option>
        </select>
      )}

      {/* 2. ESTADO DE INGLÉS REDUCIDO (Botón 'EN') */}
      {isEnglishReduced && (
        <button
          // Al hacer clic, activamos el estado de Google Translate
          onClick={() => setShowGoogleTranslate(true)}
          className="text-white text-sm font-bold px-3 py-2 bg-purple-700 rounded-lg shadow-md hover:bg-purple-800 transition-colors duration-200"
        >
          EN
        </button>
      )}

      {/* 3. WIDGET DE GOOGLE ACTIVO (Muestra el botón 'Otro idioma' + Selector) */}
      {showGoogleTranslate && (
        <div className="flex items-center space-x-2">
          {/* BOTÓN DE RETORNO / ETIQUETA 'OTRO IDIOMA' */}
          {/* Al hacer clic en el botón de retorno, se oculta este bloque */}
          <button
            onClick={() => setShowGoogleTranslate(false)}
            className="text-white text-sm font-bold px-2 py-1 bg-purple-700 rounded-full"
          >
            {t("other_language_label", "Aut.")}
          </button>

          {/* Contenedor del Widget de Google Translate */}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
