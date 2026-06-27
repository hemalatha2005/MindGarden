/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        garden: {
          bg: "#0C0E14",
          surface: "#13161F",
          elevated: "#1A1D28",
          primary: "#6C8EEF",
          primaryHover: "#8BA4F4",
          text: "#E8ECF4",
          heading: "#F1F3F9",
          muted: "#7A8299",
          border: "#1F2233",
          borderHover: "#2A2E42",
          accent: "#6C8EEF",
          glow: "rgba(108, 142, 239, 0.12)",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Text", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(108, 142, 239, 0.08)",
        "glow-lg": "0 0 40px rgba(108, 142, 239, 0.12)",
        card: "0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)",
        float: "0 8px 30px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        card: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out both",
        "slide-up": "slideUp 0.3s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
