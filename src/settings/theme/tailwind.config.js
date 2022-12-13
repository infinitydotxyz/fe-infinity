const extensions = require('./elements/extensions.js');
const foundations = require('./elements/foundations.js');
const theme = require('./tailwind.theme.js');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,css,scss}',
    './src/**/**/*.{js,jsx,ts,tsx,css,scss}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...foundations,
      ...extensions,
      ...theme
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
    require('flowbite/plugin')
  ]
};
