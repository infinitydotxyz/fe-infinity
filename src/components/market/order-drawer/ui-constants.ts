const collectionIconRem = 14;

// only here so purgeCSS doesn't remove the styles we need (sync with collectionIconRem)
// see https://v2.tailwindcss.com/docs/optimizing-for-production
export const purgeCSSHack = 'h-14 w-14';

export const collectionIconHeight = `h-${collectionIconRem}`;
export const collectionIconWidth = `w-${collectionIconRem}`;
export const collectionIconStyle = `${collectionIconHeight} ${collectionIconWidth} rounded-2xl`;

export const collectionIconWidthInPx = (): number => {
  console.log(pixelsPerRem() * collectionIconRem);

  return pixelsPerRem() * collectionIconRem;
};

export const pixelsPerRem = () => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.25;
};
