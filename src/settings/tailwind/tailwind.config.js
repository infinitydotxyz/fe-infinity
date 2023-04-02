const extensions = require('./elements/extensions.js');
const foundations = require('./elements/foundations.js');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,css,scss}',
    './src/**/**/*.{js,jsx,ts,tsx,css,scss}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...foundations,
      ...extensions
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px'
      // => @media (min-width: 1536px) { ... }
    }
  },

  plugins: [require('tailwindcss'), require('autoprefixer'), require('postcss-import'), require('@tailwindcss/forms')]
};
