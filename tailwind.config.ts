import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

// .prettierrc needed this added "tailwindConfig": "./tailwind.config.ts", so the tailwindcss prettier plugin could see the custom styles. Otherwise it'd toss it to the top of the classList, and the styling would break

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
        "secondary-font-color": "#2d2d2d",
        "light-font-color": "#62748e",
        // #62748e" lighter gray
        "light-accent": "#e0e0e0",
        // used for faint borders
        // "" is necessary with - because otherwise JS/TS interprets it as subtract sign and gets confused
        green: "#187a24",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
      },
      animation: {
        "loading-bar": "loading-bar 0.8s ease-in-out infinite",
      },
      keyframes: {
        "loading-bar": {
          "0%": { width: "0%" },
          "50%": { width: "70%" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [heroui()],
};
export default config;
