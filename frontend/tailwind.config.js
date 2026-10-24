module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Public Sans", "sans-serif"] },
      colors: { brand: { 50: "#edf7f3", 600: "#127356", 700: "#09583f" } },
    },
  },
  plugins: [],
};