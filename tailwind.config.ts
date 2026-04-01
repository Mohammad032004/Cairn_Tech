import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { heading: ["Syne","sans-serif"], body: ["DM Sans","sans-serif"] },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "float": "float 5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity:"0", transform:"translateY(16px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        float: { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};
export default config;
