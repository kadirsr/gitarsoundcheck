/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        panel: "#17212b",
        line: "#2d3b48",
        action: "#10b981",
        warn: "#f59e0b",
        danger: "#ef4444"
      }
    }
  },
  plugins: []
};
