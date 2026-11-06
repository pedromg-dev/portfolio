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
          DEFAULT: 'oklch(0.985 0.006 75 / <alpha-value>)',
          elevated: 'oklch(0.955 0.009 75 / <alpha-value>)',
          subtle: 'oklch(0.925 0.012 75 / <alpha-value>)',
          dark: 'oklch(0.15 0.01 65 / <alpha-value>)',
          'dark-elevated': 'oklch(0.20 0.012 65 / <alpha-value>)',
          'dark-subtle': 'oklch(0.26 0.014 65 / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'oklch(0.18 0.015 65 / <alpha-value>)',
          muted: 'oklch(0.40 0.015 65 / <alpha-value>)',
          subtle: 'oklch(0.50 0.014 65 / <alpha-value>)',
          dark: 'oklch(0.96 0.008 75 / <alpha-value>)',
          'dark-muted': 'oklch(0.75 0.012 75 / <alpha-value>)',
        },
        border: {
          DEFAULT: 'oklch(0.88 0.012 75 / <alpha-value>)',
          strong: 'oklch(0.78 0.015 75 / <alpha-value>)',
          dark: 'oklch(0.28 0.014 65 / <alpha-value>)',
          'dark-strong': 'oklch(0.38 0.016 65 / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(0.50 0.14 42 / <alpha-value>)',
          hover: 'oklch(0.44 0.14 42 / <alpha-value>)',
          dark: 'oklch(0.74 0.14 42 / <alpha-value>)',
          'dark-hover': 'oklch(0.80 0.14 42 / <alpha-value>)',
          secondary: 'oklch(0.50 0.14 235 / <alpha-value>)',
          'secondary-dark': 'oklch(0.74 0.14 235 / <alpha-value>)',
        },
        blue: {
          50: 'oklch(0.985 0.006 75 / <alpha-value>)',
          100: 'oklch(0.955 0.009 75 / <alpha-value>)',
          200: 'oklch(0.91 0.012 75 / <alpha-value>)',
          300: 'oklch(0.84 0.015 75 / <alpha-value>)',
          400: 'oklch(0.74 0.14 42 / <alpha-value>)',
          500: 'oklch(0.50 0.14 42 / <alpha-value>)',
          600: 'oklch(0.44 0.14 42 / <alpha-value>)',
          700: 'oklch(0.35 0.015 65 / <alpha-value>)',
          800: 'oklch(0.20 0.012 65 / <alpha-value>)',
          900: 'oklch(0.15 0.01 65 / <alpha-value>)',
          950: 'oklch(0.12 0.01 65 / <alpha-value>)'
        }
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
