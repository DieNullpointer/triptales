/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
      primary: "#3ce322",
      primaryHover: "#308270",
      secondary: "#2466ff",
      ...colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
