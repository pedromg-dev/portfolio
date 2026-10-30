/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Plus Jakarta Sans"', 'Helvetica Neue', 'Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['"Kode Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'poppins': ['"Plus Jakarta Sans"', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        'kode-mono': ['"Kode Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: 'oklch(0.985 0.006 75)',
          elevated: 'oklch(0.955 0.009 75)',
          subtle: 'oklch(0.925 0.012 75)',
          dark: 'oklch(0.15 0.01 65)',
          'dark-elevated': 'oklch(0.20 0.012 65)',
          'dark-subtle': 'oklch(0.26 0.014 65)',
        },
        ink: {
          DEFAULT: 'oklch(0.18 0.015 65)',
          muted: 'oklch(0.40 0.015 65)',
          subtle: 'oklch(0.50 0.014 65)',
          dark: 'oklch(0.96 0.008 75)',
          'dark-muted': 'oklch(0.75 0.012 75)',
        },
        border: {
          DEFAULT: 'oklch(0.88 0.012 75)',
          strong: 'oklch(0.78 0.015 75)',
          dark: 'oklch(0.28 0.014 65)',
          'dark-strong': 'oklch(0.38 0.016 65)',
        },
        accent: {
          DEFAULT: 'oklch(0.50 0.14 42)',
          hover: 'oklch(0.44 0.14 42)',
          dark: 'oklch(0.74 0.14 42)',
          'dark-hover': 'oklch(0.80 0.14 42)',
          secondary: 'oklch(0.50 0.14 235)',
          'secondary-dark': 'oklch(0.74 0.14 235)',
        },
        blue: {
          50: 'oklch(0.985 0.006 75)',
          100: 'oklch(0.955 0.009 75)',
          200: 'oklch(0.91 0.012 75)',
          300: 'oklch(0.84 0.015 75)',
          400: 'oklch(0.74 0.14 42)',
          500: 'oklch(0.50 0.14 42)',
          600: 'oklch(0.44 0.14 42)',
          700: 'oklch(0.35 0.015 65)',
          800: 'oklch(0.20 0.012 65)',
          900: 'oklch(0.15 0.01 65)',
          950: 'oklch(0.12 0.01 65)'
        }
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
