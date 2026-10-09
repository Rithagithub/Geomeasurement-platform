/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        geo: {
          primary: '#2563eb', // Blue-600
          dark: '#1d4ed8',    // Blue-700
          light: '#dbeafe',   // Blue-100
          accent: '#0284c7',  // Sky-600
        }
      }
    },
  },
  plugins: [],
}
