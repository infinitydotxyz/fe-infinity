const extensions = require('src/settings/theme/elements/extensions.js');
const foundations = require('src/settings/theme/elements/foundations.js');

module.exports = {
  content: [
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
    require('@tailwindcss/aspect-ratio'),
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-filters')
  ]
};
