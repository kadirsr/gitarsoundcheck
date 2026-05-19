/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121a24",
        panel: "#ffffff",
        line: "#e8bed2",
        action: "#ff4f96",
        warn: "#ffcc5c",
        danger: "#ef4444"
      }
    }
  },
  plugins: []
};
