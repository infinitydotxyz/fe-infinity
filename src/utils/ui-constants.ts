const collectionIconRem = 14;

// only here so purgeCSS doesn't remove the styles we need (sync with collectionIconRem)
// see https://v2.tailwindcss.com/docs/optimizing-for-production
export const purgeCSSHack = 'h-14 w-14';

export const collectionIconHeight = `h-${collectionIconRem}`;
export const collectionIconWidth = `w-${collectionIconRem}`;
export const collectionIconStyle = `${collectionIconHeight} ${collectionIconWidth} rounded-lg overflow-clip`;

export const collectionIconWidthInPx = (): number => {
  return pixelsPerRem() * collectionIconRem;
};

export const pixelsPerRem = () => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.25;
};

export const iconButtonStyle = 'h-6 w-6';
export const smallIconButtonStyle = 'h-5 w-5';
export const extraSmallIconButtonStyle = 'h-3 w-3';
export const largeIconButtonStyle = 'h-8 w-8';

export const secondsPerDay = 86400;
export const weekSeconds = secondsPerDay * 7;
export const thirtyDaySeconds = secondsPerDay * 30;

export const saleDataPointColor = '#FA8147';
export const hoveredDataPointColor = '#66d981';
export const listingDataPointColor = '#4899f1';
export const bidDataPointColor = '#f731bf';

// these include both dark and light
export const bgColor = 'dark:bg-dark-bg bg-light-bg';
export const brandBgColor = 'dark:bg-brand-darkPrimary bg-brand-primary';
export const inverseBgColor = 'dark:bg-light-bg bg-dark-bg';
export const secondaryBgColor = 'dark:bg-dark-card bg-light-card';
export const secondaryBgColorDarker = 'dark:bg-dark-card bg-gray-200 bg-opacity-60';
export const brandBorderColor = 'border-brand-primary dark:border-brand-darkPrimary';
export const brandBorderColorFade = 'border-brand-primaryFade dark:border-brand-darkPrimaryFade';
export const borderColor = 'dark:border-dark-border border-light-border';
export const buttonBorderColor = 'border-black dark:border-white';
export const divideColor = 'dark:divide-dark-border divide-light-border';
export const standardCard = `rounded-lg border p-5 my-3 ${borderColor} ${secondaryBgColor}`;
export const standardBorderCard = `rounded-lg border p-2 my-3 ${borderColor}`;
export const textColor = 'dark:text-dark-body text-light-body';
export const secondaryTextColor = 'dark:text-dark-disabled text-light-disabled';
export const brandTextColor = 'dark:text-brand-darkPrimary text-brand-primary';
export const brandTextColorFade = 'dark:text-brand-darkPrimaryFade text-brand-primaryFade';
export const inverseTextColor = 'dark:text-light-body text-dark-body';
export const primaryShadow = `shadow-[3px_3px_0px_0px_rgba(237,193,0)] dark:shadow-[2px_2px_0px_0px_rgba(200,247,81)]`;
export const primaryBtnBgColorText = `border ${buttonBorderColor} ${textColor} ${primaryShadow}`;
export const primaryBtnWithBgColorTextTransition = `${primaryBtnBgColorText} font-medium`;
export const secondaryBtnBgColorText = `dark:bg-gray-400 dark:bg-opacity-10 bg-gray-200 bg-opacity-60 ${brandTextColor}`;
export const hoverColorBrandText = 'hover:text-brand-primary dark:hover:text-brand-darkPrimary';
export const hoverColor = `dark:hover:bg-gray-200 dark:hover:bg-opacity-10 hover:bg-gray-200 hover:bg-opacity-40 ${hoverColorBrandText}`;
export const selectedColor = `dark:bg-gray-200 dark:bg-opacity-10 bg-gray-200 bg-opacity-40 ${brandTextColor}`;
export const activeColor =
  'dark:active:bg-gray-200 dark:active:bg-opacity-10 active:bg-gray-300 active:bg-opacity-50 active:text-brand-primary dark:active:text-brand-darkPrimary';
export const selectionBorder = `border-[1px] ${brandBorderColor}`;
export const dropShadow = 'shadow-lightDropdown dark:shadow-darkDropdown';
