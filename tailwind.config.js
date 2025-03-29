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

      gridRow:{
        8:"grid-template-rows: repeat(8, minmax(0, 1fr));"
      },
      padding: {
        columns: '2px 1.32rem',
        rows: '0.88rem 11px',
        "columns-mobil": '2px 1.05rem',
        "rows-mobil": '0.88rem 11px',
      },
    },
  },
  plugins: [],
}

