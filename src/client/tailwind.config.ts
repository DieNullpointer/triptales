/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: '',
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        greenwhite: "#f1ffd1",
        warmwhite: "#faf2e1",
        primary: "#3ce322",
        primaryHover: "#308270",
        secondary: "#2466ff",
        ...colors,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
