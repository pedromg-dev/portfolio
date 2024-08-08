/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
      'body2': ['"Open Sans"'],
      'poppins': ["Poppins", "sans-serif"],
      'kode-mono': ["Kode Mono", "monospace"],
    },
    "colors": {
      "blue": {
        50: "#EEF4F7",
        100: "#DCE9EF",
        200: "#BDD5E0",
        300: "#9BBFD0",
        400: "#78A9BF",
        500: "#5894B0",
        600: "#43768E",
        700: "#33596B",
        800: "#223D49",
        900: "#101D23",
        950: "#080E11"
      }
    },
    extend: {
      backgroundImage: {
        'gradient-45-light': 'linear-gradient(45deg, transparent 50%, #5894B0 50%)',
        'gradient-45-dark': 'linear-gradient(45deg, transparent 50%, #5894B0 50%)',
      }
    }
  },
  plugins: [],
}

