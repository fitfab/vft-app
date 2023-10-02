import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: "#003049",
      },
      fontFamily: {
        Mona: "Mona Sans",
      },
      // REF: https://clamp.font-size.app/
      fontSize: {
        // sm: 12px - 14px
        "clamp-sm": "clamp(0.75rem, 0.6071rem + 0.2976vw, 0.875rem)",
        // base: 16px - 18px
        "clamp-base": "clamp(1rem, 0.8571rem + 0.2976vw, 1.125rem)",
        // lg: 20px - 24px
        "clamp-lg": "clamp(1.25rem, 0.9643rem + 0.5952vw, 1.5rem)",
        // xl: 28px - 32px
        "clamp-xl": "clamp(1.75rem, 1.4643rem + 0.5952vw, 2rem)",
        // xxl: 36px - 40px
        "clamp-2xl": "clamp(2.25rem, 1.9643rem + 0.5952vw, 2.5rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
