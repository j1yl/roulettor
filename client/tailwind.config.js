/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: "var(--red)",
        black: "var(--black)",
        green: "var(--green)",
        gold: "var(--gold)",
        text: "var(--text)",
        darker: "var(--background-darker)",
        base: "var(--background)",
        100: "var(--background-100)",
        200: "var(--background-200)",
      },
    },
  },
  plugins: [],
};
