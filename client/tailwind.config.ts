import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#be123c",
          secondary: "#a72c41",
          accent: "#93c5fd",
          neutral: "#36000b",
          "base-100": "#1c1917",
          info: "#0d9488",
          success: "#c084fc",
          warning: "#fcd34d",
          error: "#b91c1c",
        },
      },
    ],
  },
  // pauf special 10/10 theme
  // daisyui: {
  //   themes: [
  //     {
  //       mytheme: {
  //         primary: "#fda4af",
  //         secondary: "#93c5fd",
  //         accent: "#5eead4",
  //         neutral: "#414558",
  //         "base-100": "#4b5563",
  //         info: "#7dd3fc",
  //         success: "#f0abfc",
  //         warning: "#fed7aa",
  //         error: "#ef4444",
  //       },
  //     },
  //   ],
  // },
} satisfies Config;
