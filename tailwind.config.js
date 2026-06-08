/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./hugo_stats.json"],
  darkMode: "class",
  theme: {
    screens: {
      "sm": "540px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        "surface-tint": "#00e639",
        "primary-container": "#00ff41",
        "on-primary": "#003907",
        "primary": "#ebffe2",
        "secondary": "#99d688",
        "on-background": "#e2e2e2",
        "background": "#000000",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1b1b1b",
        "surface-container": "#1f1f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        "secondary-container": "#1e5416",
        "on-secondary-container": "#8cc77b",
        "outline": "#84967e",
        "outline-variant": "#3b4b37",
        "on-surface": "#e2e2e2",
        "on-surface-variant": "#b9ccb2"
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
