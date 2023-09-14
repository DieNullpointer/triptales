/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Roboto"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {},
    colors: {
      greenwhite: "#f1ffd1",
      warmwhite: "#faf2e1",
      primary: "#43fc26",
      secondary: "#2466ff",
      ...colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
