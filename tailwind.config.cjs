/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          primary: '#ee4d2d',
          light: '#fdfdfd',
          bg: '#f5f5f5'
        }
      }
    },
  },
  plugins: [],
}