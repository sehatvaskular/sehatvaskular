import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        svBlue: {
          900: '#0f172a', 
          800: '#1e293b',
        },
        svMaroon: {
          900: '#7f1d1d', 
          800: '#991b1b',
          600: '#dc2626',
        }
      }
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config;