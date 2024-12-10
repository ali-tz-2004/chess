/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#212121",
        secondary: "#2F2F2F",
        cellPrimary: "#000",
        cellSecondary: "#ffffffe0"
      },
      height:{
        "custom-30": "30rem"
      },
      width:{
        "custom-30": "30rem"
      },
      gridRow:{
        8:"grid-template-rows: repeat(8, minmax(0, 1fr));"
      }
    },
  },
  plugins: [],
}

