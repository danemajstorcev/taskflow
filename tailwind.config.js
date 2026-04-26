/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", 'sans-serif'],
        body:    ["'IBM Plex Sans'", 'sans-serif'],
      },
      colors: {
        violet: {
          950: '#1e0a3c',
        }
      }
    }
  },
  plugins: []
}
