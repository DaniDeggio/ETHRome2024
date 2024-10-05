/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#212121",           // Nero molto scuro
          "primary-content": "#F9FBFF", // Bianco
          secondary: "#424242",         // Grigio scuro
          "secondary-content": "#F9FBFF", // Bianco
          accent: "#616161",            // Grigio medio
          "accent-content": "#F9FBFF",  // Bianco
          neutral: "#F9FBFF",           // Bianco
          "neutral-content": "#9E9E9E", // Grigio chiaro
          "base-100": "#FFFFFF",        // Bianco
          "base-200": "#BDBDBD",        // Grigio chiaro
          "base-300": "#616161",        // Grigio medio
          "base-content": "#F9FBFF",    // Bianco
          info: "#B0BEC5",              // Grigio chiaro
          success: "#34EEB6",           // Verde acqua
          warning: "#FFCF72",           // Giallo
          error: "#FF5722",             // Rosso chiaro

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#212121",           // Nero molto scuro
          "primary-content": "#F9FBFF", // Bianco
          secondary: "#424242",         // Grigio scuro
          "secondary-content": "#F9FBFF", // Bianco
          accent: "#616161",            // Grigio medio
          "accent-content": "#F9FBFF",  // Bianco
          neutral: "#F9FBFF",           // Bianco
          "neutral-content": "#9E9E9E", // Grigio chiaro
          "base-100": "#a7f52a",        // Nero scuro
          "base-200": "#1E1E1E",        // Grigio molto scuro
          "base-300": "#2C2C2C",        // Grigio scuro
          "base-content": "#F9FBFF",    // Bianco
          info: "#B0BEC5",              // Grigio chiaro
          success: "#34EEB6",           // Verde acqua (rimasto invariato)
          warning: "#FFCF72",           // Giallo (rimasto invariato)
          error: "#FF5722",             // Rosso chiaro

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
