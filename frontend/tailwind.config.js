/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fdf4ff',
          DEFAULT: '#c026d3', // fuchsia-600
          dark: '#a21caf',
        },
        sidebarbg: '#140c21'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontWeight: {
        black: '700',
        extrabold: '600',
        bold: '600',
      },
      letterSpacing: {
        tighter: '0',
        tight: '0',
        widest: '0.05em',
      }
    },
  },
  plugins: [],
}
