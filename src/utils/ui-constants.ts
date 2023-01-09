const collectionIconRem = 14;

// only here so purgeCSS doesn't remove the styles we need (sync with collectionIconRem)
// see https://v2.tailwindcss.com/docs/optimizing-for-production
export const purgeCSSHack = 'h-14 w-14';

export const collectionIconHeight = `h-${collectionIconRem}`;
export const collectionIconWidth = `w-${collectionIconRem}`;
export const collectionIconStyle = `${collectionIconHeight} ${collectionIconWidth} rounded-2xl overflow-clip`;

export const collectionIconWidthInPx = (): number => {
  return pixelsPerRem() * collectionIconRem;
};

export const pixelsPerRem = () => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.25;
};

export const iconButtonStyle = 'h-6 w-6';
export const smallIconButtonStyle = 'h-5 w-5';
export const largeIconButtonStyle = 'h-8 w-8';

export const secondsPerDay = 86400;
export const weekSeconds = secondsPerDay * 7;
export const thirtyDaySeconds = secondsPerDay * 30;

// these include both dark and light
export const cardColor = 'dark:bg-dark-card bg-light-card';
export const textColor = 'dark:text-dark-body text-light-body';
export const secondaryTextColor = 'dark:text-dark-disabled text-light-disabled';
export const brandTextColor = 'dark:text-brand-primary text-brand-primary';
export const textColorInverse = 'dark:text-light-body text-dark-body';
export const primaryBtnBgColor = 'bg-brand-primary bg-opacity-90';
export const primaryBorderColor = 'border-brand-primary';
export const inputBorderColor = 'dark:border-dark-border border-light-border';
export const hoverColor =
  'dark:hover:bg-gray-200 dark:hover:bg-opacity-10 hover:bg-gray-300 hover:bg-opacity-50 hover:text-brand-primary dark:hover:text-brand-primary';
export const activeColor =
  'dark:active:bg-gray-200 dark:active:bg-opacity-10 active:bg-gray-300 active:bg-opacity-50 active:text-brand-primary dark:active:text-brand-primary';
export const selectionBorder = `border-[1px] ${primaryBorderColor}`;
export const infoBoxBgColor = 'dark:bg-gray-200 dark:bg-opacity-10 bg-gray-200 bg-opacity-60';
export const bgColor = 'dark:bg-neutral-900 bg-white';
export const bgColorInverse = 'dark:bg-white bg-neutral-900';
