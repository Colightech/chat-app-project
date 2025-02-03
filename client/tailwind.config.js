/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00adb5',
        secondary: '#01888f',
        choice: '#c3e2e3'
      }
    },
  },
  plugins: [],
}

