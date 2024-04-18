/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        1536: { max: "1536px", min: "1441px" },
        1440: { max: "1440px", min: "1367px" },
        1366: { min: "1366px", max: "1439px" },
        md: { max: "850px" },
      },
      colors: {
        green: "#3bb77e",
        greenScale: {
          200: "#C5EAD9",
          600: "#3BB77E",
        },
        grey: "#adadad",
        bgModal: "#adadad82",
      },
      fontFamily: {
        main: ["Quicksand"],
        special: ["Poppins"],
        secondary: ["Inter"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwind-gradient-mask-image"),
  ],
};
