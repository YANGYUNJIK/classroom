// tailwind.config.js

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        tablet: "880px", // ✅ 커스텀 breakpoint 추가
      },
    },
  },
  plugins: [],
};
