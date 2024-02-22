/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pedro-logo': "url(assets/images/pedromg-dev-logo.svg)",
        'example': "url(assets/images/example-1.svg)",
        'example-black': "url(assets/images/example-black.svg)",
      }
    },
    "colors": {
      "blue": {
        50: "#E6EDF9",
        100: "#CDDCF4",
        200: "#9BB9E8",
        300: "#6593DC",
        400: "#3470D1",
        500: "#2555A2",
        600: "#1D4381",
        700: "#16325F",
        800: "#0F2342",
        900: "#081121",
        950: "#040911"
      }
    }
  },
  plugins: [],
}

