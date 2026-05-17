/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#059669',
          dark: '#047857',
          light: '#34d399',
        },
      },
    },
  },
  plugins: [],
};
