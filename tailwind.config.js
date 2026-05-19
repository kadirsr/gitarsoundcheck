/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b2a38",
        panel: "#284052",
        line: "#5f7688",
        action: "#24d18f",
        warn: "#f4a62a",
        danger: "#ef4444"
      }
    }
  },
  plugins: []
};
