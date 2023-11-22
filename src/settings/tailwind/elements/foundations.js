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
    flex: {
      10: '10'
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
  zIndex: {
    80: 80
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
    body: ['Barlow', 'sans-serif'],
    supply: 'Supply-Mono',
    'supply-light': 'Supply-Mono-Light',
    heading:
      'Monument-Bold,SF UI Display,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    monospace: 'SF Mono,Monaco,Inconsolata,Fira Mono,Droid Sans Mono,Source Code Pro,monospace'
  },
  backgroundImage: {
    'card-header-90': 'linear-gradient(90deg, rgba(255, 255, 255, 0.70) 0%, rgba(241, 241, 235, 0.70) 100%)',
    'linear-back-dark': 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.25) 100%)',
    'radial-back-light':
      "radial-gradient(100% 100% at 0% 0%, #F1F1EB 5.65%, rgba(241, 241, 235, 0.00) 100%), url('/images/IconChevronDown.png'), lightgray -68.235px -103.192px / 25.515% 142.643% no-repeat, #F1F1EB",
    'radial-back-no-image-light': 'radial-gradient(100% 100% at 0% 0%, #F1F1EB 5.65%, rgba(241, 241, 235, 0.00) 100%)',
    'radial-back-dark':
      "radial-gradient(100% 100% at 0% 0%, #23230E 5.65%, rgba(95, 95, 75, 0.00) 100%), url('/images/IconChevronDown.png'), lightgray -68.235px -103.192px / 25.515% 142.643% no-repeat, #141400",
    'radial-back-no-image-dark': 'radial-gradient(100% 100% at 0% 0%, #23230E 5.65%, rgba(95, 95, 75, 0.00) 100%)'
  },
  boxShadow: {
    // used for tooltip shadow
    ttip: '0 2px 18px rgba(0, 0, 0, 0.12)',
    graph: '0 15px 30px -20px rgba(0, 0, 0, 0.22)',
    drawer: '0 0 68px rgba(0, 0, 0, 0.3)',
    lightDropdown:
      '0 0 20px 4px rgb(154 161 177 / 15%), 0 4px 80px -8px rgb(36 40 47 / 25%), 0 4px 4px -2px rgb(91 94 105 / 15%)',
    darkDropdown: '0 1px 3px 0 hsla(0,0%,100%,.1),0 1px 2px -1px hsla(0,0%,100%,.1)',
    buttonDropdown: '0px -10px 20px 0px rgba(20, 20, 10, 0.30)'
  },
  skew: {
    14: '14deg',
    16: '16deg',
    18: '18deg'
  },
  colors: {
    black: '#000000',
    white: '#ffffff',
    background: 'transparent',
    current: 'currentColor',
    pink: {
      700: '#EE00FF'
    },
    red: {
      500: '#d63c3c',
      300: '#e8adad'
    },
    blue: {
      300: '#92deff',
      700: '#0011FF'
    },
    emerald: {
      700: '#11FF00'
    },
    cyan: {
      400: '#3BD5FF',
      500: '#0ED2EB'
    },
    green: {
      500: '#15a456'
    },
    amber: {
      300: '#4F4F00',
      400: '#39382C',
      500: '#675D1E',
      600: '#C0C0C0',
      700: '#979156',
      800: '#3C3B2F',
      900: '#BDB046'
    },
    yellow: {
      100: '#E3E3D9',
      200: '#F1EFD2',
      300: '#EBE275',
      500: '#BFBA7C',
      700: '#F0DF00',
      800: '#E7D60E',
      900: '#FFEE00'
    },
    dark: {
      bg: '#16160F',
      body: '#dcdcdc',
      disabled: '#777E90',
      disabledFade: '#777E9080',
      border: '#353945',
      card: '#23262f',
      gridLine: '#222222',
      borderDark: '#2A2A26',
      borderUnderline: '#222222',
      disabledTier: '#1B1B11',
      tier: '#14140C'
    },
    light: {
      bg: '#F7F7F3',
      body: '#23262f',
      disabled: '#777E90',
      disabledFade: '#777E9080',
      card: '#FbFbFb',
      border: '#e6e8ec',
      gridLine: '#E7E7E7',
      divider: '#ECECEC',
      borderLight: '#E6E6DC',
      borderUnderline: '#F0F0F0',
      disabledTier: '#e4e4ee',
      tier: '#ebebf3'
    },
    brand: {
      primary: '#edc100',
      primaryFade: '#edc10090',
      darkPrimary: '#c8f751',
      darkPrimaryFade: '#c8f75190',
      twitter: '#1C9BEF',
      discord: '#5765F2'
    },
    gray: {
      100: '#F7F7F3',
      200: '#F7F7F7',
      300: '#E7E7E7',
      400: '#b1b5c3',
      500: '#1D1D00',
      600: '#282822',
      700: '#A3A3A3',
      800: '#B1B1B1',
      900: '#777'
    },
    zinc: {
      100: '#ECEAD5',
      200: '#EEEEE8',
      300: '#F1F1EB',
      400: '#F6F6F6',
      500: '#FbFbFb',
      600: '#f0f1eb',
      700: '#212116',
      800: '#30302A',
      900: '#1F1E12'
    },
    neutral: {
      100: '#CCCCCC',
      200: '#222222',
      300: '#AAAAAA',
      400: '#131306',
      500: '#555555',
      700: '#444444',
      800: '#1C1C16',
      900: '#333333'
    }
  },
  letterSpacing: {
    wide: '0.01rem',
    tight: '-.01em',
    2.32: '2.32px'
  },
  borderRadius: {
    3: '3px',
    4: '4px',
    5: '5px',
    6: '6px',
    9: '9px',
    10: '10px',
    11: '11px',
    20: '20px',
    39: '39px'
  },
  borderWidth: {
    3: '3px',
    5: '5px'
  },
  divideWidth: {
    1: '1px'
  },
  maxWidth: {
    20: '80px',
    44.5: '178px',
    250: '250px',
    300: '300px',
    393: '393px',
    '1/2': '50%'
  },
  minWidth: {
    8.5: '34px',
    20: '80px',
    30: '120px',
    50: '200px',
    62.5: '250px',
    300: '300px'
  },
  width: {
    3.75: '15px',
    4.5: '18px',
    5.5: '22px',
    10.5: '42px',
    13: '52px',
    18: '72px',
    18.75: '75px',
    19.5: '78px',
    25: '100px',
    28: '28px',
    28.5: '114px',
    51.25: '205px',
    56.25: '225px',
    70.5: '282px',
    86.5: '346px',
    88: '22rem',
    120: '30rem',
    128: '32rem',
    144: '36rem',
    145: '580px',
    225: '900px',
    '95%': '95%',
    '98%': '98%'
  },
  minHeight: {
    2.5: '10px',
    6.25: '25px',
    19: '76px',
    25: '100px',
    50: '200px',
    87: '348px',
    150: '600px',
    '50vh': '50vh'
  },
  height: {
    0.25: '1px',
    0.75: '3px',
    1.25: '5px',
    3.75: '15px',
    4.5: '18px',
    5.25: '21px',
    5.5: '22px',
    6.5: '26px',
    8.25: '33px',
    9.25: '37px',
    10.5: '42px',
    18: '72px',
    19: '76px',
    19.5: '78px',
    21.25: '85px',
    25: '100px',
    44.25: '177px',
    51.25: '205px',
    70.5: '282px',
    78: '312px',
    100: '400px',
    154.5: '618px',
    300: '1200px',
    '70vh': '70vh'
  },
  maxHeight: {
    19: '76px',
    19.5: '78px',
    91.25: '365px'
  },
  spacing: {
    0.25: '1px',
    0.75: '3px',
    1.25: '5px',
    2.25: '9.5px',
    4.5: '18px',
    6.5: '26px',
    7: '7px',
    7.5: '30px',
    15: '60px',
    18: '72px',
    18.75: '75px',
    19: '76px'
  },
  gap: {
    1.25: '5px',
    3.75: '15px'
  },
  fontSize: {
    17: '17px',
    22: '22px',
    29: '29px',
    31: '31px',
    35: '35px',
    39: '39px',
    54: '54px',
    '6xl': '4rem'
  },
  opacity: {
    3: '0.03'
  },
  lineHeight: {
    2.5: '10px',
    3.5: '14px',
    4.25: '17px',
    4.5: '18px',
    6.5: '26px'
  },
  margin: {
    0.125: '0.5px',
    0.25: '1px',
    0.75: '3px',
    1.25: '5px',
    3.75: '15px',
    6.25: '25px',
    19.5: '78px',
    22.5: '90px',
    '40%': '40%'
  },
  padding: {
    1.25: '5px',
    1.625: '6.5px',
    1.75: '7px',
    2.75: '11px',
    3.25: '13px',
    3.48: '13.92px',
    3.75: '15px',
    6.25: '25px',
    7.5: '30px',
    19.5: '78px'
  },
  outlineWidth: {
    6: '6px'
  },
  // https://tailwindcss.com/docs/transition-property#customizing-your-theme
  transitionProperty: {
    height: 'height',
    width: 'width',
    spacing: 'margin, padding'
  }
};
