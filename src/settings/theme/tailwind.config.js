const extensions = require('./elements/extensions.js');
const foundations = require('./elements/foundations.js');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue,css,scss,yaml}',
    './src/**/**/*.{js,jsx,ts,tsx,vue,css,scss,yaml}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...foundations,
      ...extensions
    }
  },
  plugins: [
    require('tailwindcss'),
    require('@tailwindcss/aspect-ratio'),
    require('autoprefixer'),
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-filters')
  ]
};
