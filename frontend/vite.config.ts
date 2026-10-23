import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ──────────────────────────────────────────────────────────────
//  ANTI-PATRÓN 7: Build sin optimizaciones
//   - Sin minificación
//   - Sin ofuscación
//   - Sin chunk splitting
//   - Sin compresión de assets
//   - Sin hash en nombres de archivo (cache-busting)
//   - Sin separación de código de vendor
//   - Deshabilitar la poda de CSS de Tailwind (purge)
// ──────────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [react()],

  // Sin separar código de vendor — todo en un solo archivo enorme
  build: {
    // Sin minificación de CSS ni JS
    minify: false,

    // Sin división de código
    chunkSizeWarningLimit: 50000,

    // Sin hash en nombres (todo se cachea mal)
    cssCodeSplit: false,

    // Rollup con nula optimización
    rollupOptions: {
      output: {
        // TODO junto sin separar
        manualChunks: undefined,

        // Sin compactar
        compact: false,

        // Sin minimizar nombres de variables
        minifyInternalExports: false,
      },
    },

    // Fuentes y assets sin procesamiento
    assetsInlineLimit: 0,

    // Sin copia de assets
    copyAssets: true,
  },

  // CSS sin PostCSS optimizado
  css: {
    postcss: false,
  },

  // Servidor de desarrollo sin compresión
  server: {
    host: "0.0.0.0",
    port: 5173,
  },

  // Sin resolución de alias para limpiar imports
  resolve: {
    alias: {},
  },
});