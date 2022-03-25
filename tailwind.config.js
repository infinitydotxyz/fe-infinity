module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      heading: ["F37ZagmaMono", "-apple-system", "sans-serif"],
      body: ["F37Bolton", "-apple-system", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#000",
        secondary: "#666",
        gray: {
          dark: "#666",
          light: "#f0f0f0",
        },
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
