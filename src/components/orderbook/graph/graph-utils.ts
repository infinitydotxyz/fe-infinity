import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';

export type GraphData = {
  isSellOrder: boolean;
  price: number;
  order: SignedOBOrder;
};

export const graphHeight = 560;

export const clamp = (num: number, min: number, max: number): number => {
  return Math.max(min, Math.min(num, max));
};

export const textColor = '#333333';
export const textColorTW = 'text-[#333333]';

export const textAltColor = '#555';
export const textAltColorTW = 'text-[#555]';
export const bgAltColorTW = 'bg-[#555]';

export const accentColor = '#92deff';
export const accentColorTW = 'text-[#92deff]';

export const accentAltColor = '#e8adad';
export const accentAltColorTW = 'text-[#e8adad]';

export const axisLineColor = `${textColor}88`;
export const borderColor = 'border-gray-200';

export const gradientTW = 'bg-gradient-to-b from-[#f6f6f6] via-[#fcfcfc] to-[#f6f6f6]';
// export const darkGradientTW = 'bg-gradient-to-b from-[#666699] via-[#666688] to-[#666699]';
export const darkGradientTW = ' ';

export const hoverStrokeColor = '#62aeff';
