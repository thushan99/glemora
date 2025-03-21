/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brown-800': '#5a2f27',
        'brown-700': '#4a251e',
      },
    },
  },
  plugins: [],
}