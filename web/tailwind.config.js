/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "work-sans": ['"Work Sans"', "sans-serif"],
        "playfair-display": ['"Playfair Display"', "serif"],
      },
      colors: {
        primary: "#0000ff",
        secondary: "#8789C0",
      },
    },
  },
  plugins: [],
};
