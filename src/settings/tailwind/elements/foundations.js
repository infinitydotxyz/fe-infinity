module.exports = {
  screens: {
    mobile: {
      max: '767px'
    },
    'mobile-sm': {
      max: '320px'
    },
    'mobile-md': {
      min: '321px',
      max: '375px'
    },
    'mobile-lg': {
      min: '376px',
      max: '425px'
    },
    'mobile-xl': {
      min: '426px',
      max: '767px'
    },
    tablet: {
      min: '768px',
      max: '991px'
    },
    tabloid: {
      max: '991px'
    },
    desktop: {
      min: '992px'
    },
    'desktop-sm': {
      min: '992px',
      max: '1024px'
    },
    'desktop-md': {
      min: '1025px',
      max: '1440px'
    },
    'desktop-lg': {
      min: '1441px',
      max: '1920px'
    },
    'desktop-4k': {
      min: '1921px',
      max: '2560px'
    },
    'desktop-8k': {
      min: '2561px'
    },
    // for grids with cards
    grid1: {
      max: '640px'
    },
    grid2: {
      min: '640px'
    },
    grid3: {
      min: '1058px'
    },
    grid4: {
      min: '1380px'
    },
    grid5: {
      min: '1850px'
    },
    grid6: {
      min: '2250px'
    },
    grid7: {
      min: '2600px'
    },
    grid8: {
      min: '3000px'
    }
  },
  filter: {
    none: 'none',
    grayscale: 'grayscale(1)',
    invert: 'invert(1)',
    sepia: 'sepia(1)'
  },
  backdropFilter: {
    none: 'none',
    blur: 'blur(4px)',
    'blur-1': 'blur(1px)',
    'blur-2': 'blur(2px)',
    'blur-3': 'blur(3px)',
    'blur-4': 'blur(4px)',
    'blur-5': 'blur(5px)',
    'blur-10': 'blur(10px)',
    'blur-15': 'blur(15px)',
    'blur-20': 'blur(20px)',
    'blur-25': 'blur(25px)',
    'blur-30': 'blur(30px)',
    'blur-35': 'blur(35px)',
    'blur-40': 'blur(40px)',
    'blur-45': 'blur(45px)',
    'blur-50': 'blur(50px)',
    'blur-55': 'blur(55px)',
    'blur-60': 'blur(60px)',
    'blur-65': 'blur(65px)',
    'blur-75': 'blur(75px)',
    'blur-80': 'blur(80px)',
    'blur-85': 'blur(85px)',
    'blur-90': 'blur(90px)',
    'blur-95': 'blur(95px)',
    'blur-100': 'blur(100px)'
  },
  fontFamily: {
    body: 'DM Sans,SF UI Text,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    heading:
      'Kollektif,SF UI Display,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    monospace: 'SF Mono,Monaco,Inconsolata,Fira Mono,Droid Sans Mono,Source Code Pro,monospace'
  },
  boxShadow: {
    // used for tooltip shadow
    ttip: '0 2px 18px rgba(0, 0, 0, 0.12)',
    graph: '0 15px 30px -20px rgba(0, 0, 0, 0.22)',
    drawer: '0 0 68px rgba(0, 0, 0, 0.3)',
    lightDropdown:
      '0 0 20px 4px rgb(154 161 177 / 15%), 0 4px 80px -8px rgb(36 40 47 / 25%), 0 4px 4px -2px rgb(91 94 105 / 15%)',
    darkDropdown: '0 1px 3px 0 hsla(0,0%,100%,.1),0 1px 2px -1px hsla(0,0%,100%,.1)'
  },
  colors: {
    background: 'transparent',
    current: 'currentColor',
    red: {
      500: '#d63c3c',
      300: '#e8adad'
    },
    blue: {
      300: '#92deff'
    },
    green: {
      500: '#15a456'
    },
    dark: {
      bg: '#141416',
      body: '#dcdcdc',
      disabled: '#777E90',
      border: '#353945',
      card: '#23262f'
    },
    light: {
      bg: '#FFFFFF',
      body: '#23262f',
      disabled: '#777E90',
      card: '#FbFbFb',
      border: '#e6e8ec'
    },
    brand: {
      primary: '#5c5cf4',
      twitter: '#1C9BEF',
      discord: '#5765F2'
    },
    gray: {
      400: '#b1b5c3'
    }
  },
  letterSpacing: {
    wide: '0.01rem',
    tight: '-.01em'
  },
  width: {
    120: '30rem',
    128: '32rem',
    144: '36rem'
  },
  fontSize: {
    '6xl': '4rem'
  },
  // https://tailwindcss.com/docs/transition-property#customizing-your-theme
  transitionProperty: {
    height: 'height',
    width: 'width',
    spacing: 'margin, padding'
  }
};
