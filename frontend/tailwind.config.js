/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          sage: '#CCD5AE',
          pink: '#FFDDD2',
          cream: '#FAEDCD',
          mint: '#D4E6B5',
          green: '#98B475', // Added new green color
        },
      },
    },
  },
  plugins: [],
};