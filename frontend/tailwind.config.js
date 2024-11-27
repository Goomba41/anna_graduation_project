/** @type {import('tailwindcss').Config} */

import chroma from 'chroma-js';
const themes = require("./themes");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [require("tailwindcss-themer")(themes)],
  prefix: "tw-",
  theme: {
    extend: {
      colors: {
        success: "#28a745",
        "success-dark": chroma("#28a745").darken(0.35).hex(),
        "success-light": chroma("#28a745").brighten(0.35).hex(),
        danger: "#dc3545",
        "danger-dark": chroma("#dc3545").darken(0.35).hex(),
        "danger-light": chroma("#dc3545").brighten(0.35).hex(),
        warning: "#ffc107",
        "warning-dark": chroma("#ffc107").darken(0.35).hex(),
        "warning-light": chroma("#ffc107").brighten(0.35).hex(),
        info: "#17a2b8",
        "info-dark": chroma("#17a2b8").darken(0.35).hex(),
        "info-light": chroma("#17a2b8").brighten(0.35).hex(),
      },
      transitionProperty: {
        width: "width",
        height: "height",
      },
    },
  },
};
