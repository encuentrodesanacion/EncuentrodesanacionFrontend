// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy"; // <-- Importar el plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      // <-- Añade este bloque
      targets: [
        {
          src: "_redirects", // Ruta relativa a la raíz de tu carpeta frontend/ (C:\Users\Lenovo\Desktop\PLANTILLAS\encuentrodesanacion\frontend\)
          dest: "", // Copiar a la raíz del directorio de salida (frontend/dist/)
        },
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    // <-- Asegúrate de que esta sección esté presente y coincida con Netlify
    outDir: "dist", // Esto ya lo tienes implícito, pero es bueno ser explícito
  },
});
