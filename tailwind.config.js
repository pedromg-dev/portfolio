/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    "colors": {
      "blue": {
        50: "#EEF2F7",
        100: "#DCE4EF",
        200: "#B9CADF",
        300: "#97AFCE",
        400: "#7494BE",
        500: "#517AAE",
        600: "#41618B",
        700: "#314968",
        800: "#203146",
        900: "#101823",
        950: "#080C11"
      }
    }
  },
  plugins: [],
}

