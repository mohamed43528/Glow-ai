/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        glowBlue: "#3B82F6",
        glowPurple: "#7F5BFF",
        glowDark: "#0A0F1A",
        glowGrey: "#E5E7EB",
        glowSoft: "#F3F4F6",
        glowWhite: "#FFFFFF"
      }
    }
  },
  plugins: []
};
