import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f4ede2",
          dark: "#e7ded0",
          grid: "rgba(0, 0, 0, 0.05)",
        },
        desk: {
          DEFAULT: "#121316",
          dark: "#0b0c0e",
          surface: "#1a1b1f",
        },
        stamp: {
          red: "#d94e34",
          emerald: "#10b981",
          amber: "#d97706",
          blue: "#2563eb",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
