/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rich burgundy as primary color
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          200: '#f5cdd6',
          300: '#eba5b5',
          400: '#e0728c',
          500: '#ce4460',
          600: '#b82d47',
          700: '#9a2339',
          800: '#821f34',
          900: '#701d31',
        },
        // Navy as secondary color
        navy: {
          50: '#f5f6fa',
          100: '#ebedf5',
          200: '#d2d7e8',
          300: '#aab4d5',
          400: '#808cbc',
          500: '#5f699e',
          600: '#4c5483',
          700: '#3f456a',
          800: '#363b58',
          900: '#31344b',
        },
        // Charcoal for text and dark elements
        charcoal: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9dadd',
          300: '#b8bac0',
          400: '#8f929b',
          500: '#6f727d',
          600: '#5a5c67',
          700: '#4a4b54',
          800: '#404148',
          900: '#383940',
        },
        // Gold accents for luxury touches
        gold: {
          50: '#fbf7ed',
          100: '#f5ebcc',
          200: '#e9d599',
          300: '#d4b65e',
          400: '#c09a3c',
          500: '#a47e2a',
          600: '#8b6420',
          700: '#724e1c',
          800: '#5f401c',
          900: '#50361b',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // For luxury headings
      },
    },
  },
  plugins: [],
}