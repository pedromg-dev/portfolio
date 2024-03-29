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
    extend: {
      backgroundImage: {
        'white-mode': "url(assets/images/background-white-mode.svg)",
        'dark-mode': "url(assets/images/background-dark-mode.svg)",
        'mobile-white-mode': "url(assets/images/background-white-mode-mobile.svg)",
        'mobile-dark-mode': "url(assets/images/background-dark-mode-mobile.svg)",
      }
    },
    "colors": {
      "blue": {
        50: "#E6EDF9",
        65: "#cbe0fb",
        75: "#ace1ec",
        85: "#9fc6e5",
        95: "#c5e9ef",
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

