// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy"; // <-- Importar el plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
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
    outDir: "dist", // Esto ya lo tienes implícito, pero es bueno ser explícito
    // AGREGAR ESTA SECCIÓN PARA ELIMINAR EL ERROR DE "libphonenumber-js"
    rollupOptions: {
      external: ["libphonenumber-js"], // Indica a Rollup que no intente empaquetar esta librería
    },
  },
});
