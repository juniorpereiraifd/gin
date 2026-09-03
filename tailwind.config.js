/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {},
      colors: {
        background: {
          50: '#f9fafb',
        },
        brand: {
          50: '#E1E7F2',
          100: '#C3CFE6',
          200: '#A6B7DB',
          300: '#899FD0',
          400: '#6B87C4',
          500: '#4E6FB9',
          600: '#3858A7',
          700: '#234093',
          800: '#1C3577',
          900: '#152A5A',
          950: '#0F1F44',
        }
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'translate-z': (value) => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }),
        },
        { values: theme('translate'), supportsNegativeValues: true }
      )
    })
  ],
};
