/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      ...colors
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}