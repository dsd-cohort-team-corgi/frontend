import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#2563eb",
        // #2563eb = blue, used for buttons
        "primary-font-color": "#0f172b",
        // "#0f172b" dark gray
        "secondary-font-color": "#62748e",
        // #62748e" light gray
        // "" is necessary with - because otherwise JS/TS interprets it as subtract sign and gets confused
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [heroui()],
};
export default config;
