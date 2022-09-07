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
export const textLight = '#777';
export const textAltColorTW = 'text-[#555]';
export const bgAltColorTW = 'bg-[#555]';

export const accentColor = '#92deff';
export const accentColorTW = 'text-[#92deff]';

export const accentAltColor = '#e8adad';
export const accentAltColorTW = 'text-[#e8adad]';

export const axisLineColor = `${textColor}88`;

// for GraphBox
export const borderColor = 'border-gray-200';
export const gradientTW = 'bg-gradient-to-b from-[#00000007] to-[#00000007]';
export const darkGradientTW = 'bg-gradient-to-b from-[#00000001] to-[#00000001]';

export const hoverStrokeColor = '#62aeff';
