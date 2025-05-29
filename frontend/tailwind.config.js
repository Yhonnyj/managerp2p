/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // AÑADE ESTO TEMPORALMENTE para depurar
  corePlugins: {
    preflight: true, // Asegura que las propiedades base de Tailwind se inyecten
  },
  // Opcional, pero para asegurarnos de que no hay problemas de JIT
  // mode: 'jit', // Si estás en una versión antigua, puede ser necesario
}