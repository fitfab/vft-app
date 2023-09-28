import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Mona: "Mona Sans",
      },
    },
  },
  plugins: [],
} satisfies Config;
