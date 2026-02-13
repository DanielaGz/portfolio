/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta minimalista y suave
        cream: {
          50: '#fdfbf9',
          100: '#faf7f4',
          200: '#f5f0eb',
        },
        rose: {
          50: '#fdf7f6',
          100: '#f9e8e5',
          200: '#f0d1cc',
          300: '#e8a29c',
        },
        lavender: {
          50: '#faf7fd',
          100: '#f3ebf9',
          200: '#e8daf4',
        },
        slate: {
          300: '#cbd5e1',
          400: '#94a3b8',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '1.5': '0.375rem',
      },
    },
  },
  plugins: [],
};
