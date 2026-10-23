/** @type {import('tailwindcss').Config} */
module.exports = {
  // ANTI-PATRÓN: Sin purgar CSS no utilizado → el CSS final es enorme
  content: [],

  // ANTI-PATRÓN: Tema completo sin restringir
  theme: {
    extend: {
      // Múltiples colores innecesarios que nunca se usarán
      colors: {
        brand: {
          50: "#f0f0f0",
          100: "#e0e0e0",
          200: "#d0d0d0",
          300: "#c0c0c0",
          400: "#b0b0b0",
          500: "#a0a0a0",
          600: "#909090",
          700: "#808080",
          800: "#707070",
          900: "#606060",
        },
      },
      // Fuentes personalizadas que tardan en cargar
      fontFamily: {
        display: ["Impact", "Haettenschweiler", "Arial Black", "sans-serif"],
        fancy: ["Comic Sans MS", "cursive"],
      },
    },
  },
  plugins: [],
  // ANTI-PATRÓN: Sin modo oscuro, sin modo claro
  // Sin prefix para reducir tamaño
  prefix: "",
  // Importante: sin purge
  important: true,
};