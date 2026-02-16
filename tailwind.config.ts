import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        codex: {
          red: '#cf3222', 
          bg: '#050505', // Almost black
          card: '#0a0a0a', // Slightly lighter black
          border: '#1f1f1f', // Dark gray border
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'], // Clean tech font
        serif: ['var(--font-playfair)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #cf322240 0deg, #00000000 100deg)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;