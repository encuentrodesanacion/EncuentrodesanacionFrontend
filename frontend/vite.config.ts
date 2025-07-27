// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "_redirects",
          dest: "",
        },
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
    // AÑADE ESTA LÍNEA:
    include: ["libphonenumber-js"], // Indica a Vite que pre-bundlee y optimice esta dependencia
  },
  build: {
    outDir: "dist",
    // Asegúrate de que no haya un 'rollupOptions.external' aquí para 'libphonenumber-js'
  },
});
