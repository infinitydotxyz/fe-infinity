const collectionIconRem = 14;

// only here so purgeCSS doesn't remove the styles we need (sync with collectionIconRem)
// see https://v2.tailwindcss.com/docs/optimizing-for-production
export const purgeCSSHack = 'h-14 w-14';

export const collectionIconHeight = `h-${collectionIconRem}`;
export const collectionIconWidth = `w-${collectionIconRem}`;
export const collectionIconStyle = `${collectionIconHeight} ${collectionIconWidth} rounded-lg overflow-clip`;
export const heroSectionWidth = 'w-[calc(100%_-_180px)]';
export const collectionIconWidthInPx = (): number => {
  return pixelsPerRem() * collectionIconRem;
};

export const pixelsPerRem = () => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.25;
};

export const iconButtonStyle = 'h-6 w-6';
export const smallIconButtonStyle = 'h-5 w-5';
export const mediumIconButtonStyle = 'h-3.75 w-3.75';
export const extraSmallIconButtonStyle = 'h-3 w-3';
export const largeIconButtonStyle = 'h-8 w-8';

export const secondsPerDay = 86400;
export const weekSeconds = secondsPerDay * 7;
export const thirtyDaySeconds = secondsPerDay * 30;

export const saleDataPointColor = '#FA8147';
export const saleDataPointDarkColor = '#FFEB00';
export const saleDataPointLightColor = '#675D1E';
export const hoveredDataPointColor = '#66d981';
export const listingDataPointColor = '#4899f1';
export const bidDataPointColor = '#f731bf';
export const gridDarkColor = '#222222';
export const gridLightColor = '#E7E7E7';
export const chartAxisLabelDarkColor = '#ffffff';
export const chartAxisLabelLightColor = '#444444';

// these include both dark and light
export const bgColor = 'dark:bg-dark-bg bg-light-bg';
export const brandBgColor = 'dark:bg-brand-darkPrimary bg-brand-primary';
export const brandBgCustomColor = `dark:${saleDataPointDarkColor} bg-amber-500`;
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
export const secondaryTextColor = 'text-neutral-700 dark:text-white';
export const brandTextColor = 'dark:text-brand-darkPrimary text-brand-primary';
export const brandTextColorFade = 'dark:text-brand-darkPrimaryFade text-brand-primaryFade';
export const inverseTextColor = 'dark:text-light-body text-dark-body';
export const toastBoxShadowPrimary = '3px 3px 0px 0px rgba(237,193,0)';
export const toastBoxShadowDarkPrimary = '2px 2px 0px 0px rgba(200,247,81)';
export const primaryShadow = `shadow-[3px_3px_0px_0px_rgba(237,193,0)] dark:shadow-[2px_2px_0px_0px_rgba(200,247,81)]`;
export const primaryBtnBgColorText = `border ${buttonBorderColor} ${textColor} ${primaryShadow}`;
export const btnBgColorText = `border-2 border-black/40 dark:border-black/40 dark:bg-zinc-400 bg-neutral-200 text-white dark:text-neutral-700`;
export const primaryBtnWithBgColorTextTransition = `${primaryBtnBgColorText} font-medium`;
export const secondaryBtnBgColorText = `dark:bg-gray-400 dark:bg-opacity-10 bg-gray-200 bg-opacity-60 ${brandTextColor}`;
export const hoverColorBrandText = 'hover:text-brand-primary dark:hover:text-brand-darkPrimary';
export const hoverColorNewBrandText = 'hover:text-yellow-700 dark:hover:text-yellow-700';
export const hoverColor = `dark:hover:bg-gray-200 dark:hover:bg-opacity-10 hover:bg-gray-200 hover:bg-opacity-40 ${hoverColorBrandText}`;
export const selectedColor = `bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-neutral-200`;
export const activeColor =
  'dark:active:bg-gray-200 dark:active:bg-opacity-10 active:bg-gray-300 active:bg-opacity-50 active:text-brand-primary dark:active:text-brand-darkPrimary';
export const selectionBorder = `outline-6 outline outline-neutral-700`;
export const dropShadow = 'shadow-lightDropdown dark:shadow-darkDropdown';
export const sidebarIconColors = 'dark:text-neutral-100 text-neutral-700';
export const checkboxBgColor = 'bg-white dark:text-neutral-700';
export const darkWhiteIconColor = 'text-neutral-700 dark:text-white';
export const golderBorderColor = 'border-yellow-700';
export const tabItemBGColor = 'bg-zinc-300 dark:bg-zinc-900';
export const containerBGColor = 'bg-zinc-300 dark:bg-neutral-800';
export const heroSectionBGImage = '-top-[267px] -left-[272px]';
export const rewardSectionItemLabel = 'text-sm font-medium text-neutral-700 dark:text-white whitespace-nowrap';
export const rewardSectionItemValue = 'md:text-31 font-supply font-normal text-amber-700 leading-9 text-center';
export const analyticsSectionItemValue =
  'text-17 md:text-31 font-supply font-normal text-amber-700 leading-5 md:leading-9 text-center';
export const analyticsSectionItemLabel =
  'text-base leading-5 font-medium text-neutral-700 dark:text-white line-clamp-1 whitespace-nowrap';
export const referralLink = 'max-w-[calc(100vw_-_90px)]';
export const cardShadow = 'shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)] hover:shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)]';
export const tokenCardGridCols =
  'grid grid-flow-row-dense gap-5 3xl:grid-cols-[repeat(auto-fill,_minmax(258px,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(205px,_1fr))] grid-cols-[repeat(auto-fit,_minmax(169px,_1fr))]';
