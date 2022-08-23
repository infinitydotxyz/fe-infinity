import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';

export type GraphData = {
  isSellOrder: boolean;
  price: number;
  order: SignedOBOrder;
};

// const offerColor = '255, 113, 243';
// const listingColor = '23, 203, 255';
export const offerColor = '23, 203, 255';
export const barColorSolid = `rgba(${offerColor}, 1)`;
export const textColor = `rgba(${offerColor}, .6)`;
export const barColorLight = `rgba(${offerColor}, .5)`;
