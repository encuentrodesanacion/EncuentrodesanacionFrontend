// frontend/src/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // Carga las traducciones desde archivos JSON
  .use(initReactI18next) // Conecta i18next con React
  .init({
    // Idioma de respaldo e idioma inicial
    fallbackLng: "es",
    lng: "es",
    debug: false, // Cambia a true si necesitas depurar

    // Configuración para cargar los archivos JSON
    backend: {
      // Esta es la ruta base donde Vite buscará los archivos:
      // /public/locales/es/translation.json
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // Namespace: 'translation' es el nombre del archivo JSON
    ns: ["translation"],
    defaultNS: "translation",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
