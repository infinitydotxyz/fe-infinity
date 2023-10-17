import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const ShoppingBag = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="20"
    viewBox="0 0 19 20"
    fill="none"
    className={twMerge('text-white', className)}
  >
    <path
      d="M6.77734 0H12.7773V2H6.77734V0ZM12.7773 4V2H14.7773V4H18.7773V20H0.777344V4H4.77734V2H6.77734V4H12.7773ZM12.7773 6H6.77734V8H4.77734V6H2.77734V18H16.7773V6H14.7773V8H12.7773V6Z"
      fill="currentColor"
    />
  </svg>
);
