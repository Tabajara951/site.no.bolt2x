/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'space': ['"Space Mono"', 'monospace'],
        'orbitron': ['Orbitron', 'sans-serif'],
        'exo': ['"Exo 2"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
