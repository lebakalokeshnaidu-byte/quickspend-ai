import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#05060a",
          950: "#020204",
          900: "#05060a",
          800: "#0a0c14",
          700: "#11131f",
          600: "#191c2c",
        },
        border: "rgba(255,255,255,0.08)",
        panel: "rgba(255,255,255,0.035)",
        accent: {
          purple: "#9b5cff",
          "purple-bright": "#b083ff",
          lime: "#c6f135",
          "lime-dim": "#9fc42a",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(155, 92, 255, 0.35)",
        "glow-lime": "0 0 40px -12px rgba(198, 241, 53, 0.3)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% -10%, rgba(155,92,255,0.18), transparent 45%), radial-gradient(circle at 90% 0%, rgba(198,241,53,0.10), transparent 40%)",
        "panel-gradient":
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
