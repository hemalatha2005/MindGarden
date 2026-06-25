/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        garden: {
          bg: "#FAFAFA",         // Very soft off-white background
          primary: "#111827",    // Deep slate/almost black for primary text/buttons
          accent: "#4A605B",     // Sophisticated muted green accent
          text: "#111827",       // High contrast text
          muted: "#6B7280",      // Secondary text
          card: "#FFFFFF",       // Crisp white card
          border: "#E5E7EB",     // Very subtle border
        },
        type: {
          task:     { bg: "#F3F4F6", text: "#374151" }, // Minimal gray
          note:     { bg: "#F3F4F6", text: "#374151" }, 
          reminder: { bg: "#FEF3C7", text: "#92400E" }, // Soft amber
          idea:     { bg: "#F3E8FF", text: "#6B21A8" }, // Soft purple
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },

      borderRadius: {
        card: "12px",
        pill: "999px",
        xl: "12px",
        lg: "8px",
      },

      boxShadow: {
        // Linear/Stripe style precision shadows
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        float: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        cmd: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        glow: "0 0 0 2px rgba(74, 96, 91, 0.2)",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
