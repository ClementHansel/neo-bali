/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Required if you use `/app`
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

        // Explicit mono
        mono: ['"Söhne Mono"', "monospace"],

        // Explicit mono2
        mono2: ['"Söhne Mono"', "monospace"],

        // Explicit mono2
        mono3: ['"Helvetica-Condensed"', "monospace"],
      },
    },
  },
  plugins: [],
};
