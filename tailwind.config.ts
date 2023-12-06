import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        main: "#514AF3",
        secondBlack: "#0F0F0F",
        mainHover: "#706aff",
      },
      boxShadow: {
        input: "0 1px 10px 0px #514AF3",
        searchBar: "0px 1px 10px 0px rgba(81, 74, 243, 0.50)",
      },
      borderWidth: { 1: "1px" },
    },
  },
  plugins: [],
};
export default config;
