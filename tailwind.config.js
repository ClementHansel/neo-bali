/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f9fafb",
          500: "#0f172a",
        },
      },
      fontFamily: {
        // BODY FONT
        sans: ["Inter", "ui-sans-serif", "system-ui"],

        // BRAND FONT (HEADINGS, TITLES, SPECIAL UI)
        brand: ['"Söhne Mono"', "monospace"],

        // Optional explicit mono
        mono: ['"Söhne Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
