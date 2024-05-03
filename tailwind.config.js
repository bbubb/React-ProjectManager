/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'rsm': '2vw', // responsive small
        'rmd': '4vw',  // responsive medium
        'rlg': '8vw', // responsive large
        'rxl': '16vw'     // responsive extra large
      }
    },
  },
  plugins: [],
}

