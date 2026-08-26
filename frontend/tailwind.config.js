/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rarePurple: "#7C5C9E",
        rareTeal: "#B2D8D0",
        rareBg: "#F4F7FE",
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}