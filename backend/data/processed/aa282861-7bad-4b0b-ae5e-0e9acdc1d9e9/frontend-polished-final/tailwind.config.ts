import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F3F4F3",
          100: "#E6E8E6",
          200: "#C7CBC8",
          300: "#9BA19C",
          400: "#666D68",
          500: "#3F464A",
          700: "#232830",
          800: "#181C23",
          900: "#12151C",
          950: "#0B0D12",
        },
        paper: {
          DEFAULT: "#EEF0EE",
          50: "#F8F9F7",
          100: "#EEF0EE",
          200: "#E2E5E0",
          300: "#D2D6CE",
        },
        signal: {
          400: "#F0BC6C",
          500: "#E7A33E",
          600: "#C98A28",
          700: "#9C6A1C",
        },
        thread: {
          300: "#7FC3B4",
          400: "#4FAE9B",
          500: "#2F8F7C",
          600: "#256F60",
          700: "#1B5349",
        },
        coral: {
          400: "#E17E6F",
          500: "#D65B4A",
          600: "#B84636",
        },
      },

      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },

      boxShadow: {
        soft: "0 1px 2px rgba(11,13,18,0.04), 0 8px 24px -12px rgba(11,13,18,0.12)",
        lifted: "0 4px 8px rgba(11,13,18,0.05), 0 20px 40px -16px rgba(11,13,18,0.18)",
        ink: "0 20px 50px -20px rgba(11,13,18,0.45)",
      },

      borderRadius: {
        xl2: "1.25rem",
      },

      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-thread": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "grow-thread": "grow-thread 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },

  plugins: [],
};

export default config;
