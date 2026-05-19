/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121a24",
        panel: "#1b2633",
        line: "#3b4b5d",
        action: "#35e39b",
        warn: "#f5b84b",
        danger: "#ef4444"
      }
    }
  },
  plugins: []
};
