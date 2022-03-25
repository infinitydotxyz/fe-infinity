module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      heading: ['F37ZagmaMono', '-apple-system', 'sans-serif'],
      body: ['F37Bolton', '-apple-system', 'sans-serif']
    },
    extend: {
      colors: {
        gray: {
          600: '#666',
          50: '#f0f0f0',
          400: '#bebebe'
        }
      },
      width: {
        120: '30rem',
        128: '32rem',
        144: '36rem'
      },
      letterSpacing: {
        wide: '0.01rem',
        tight: '-.01em'
      }
    }
  },
  plugins: [require('tailwindcss'), require('autoprefixer')]
};
