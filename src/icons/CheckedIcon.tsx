import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const CheckedIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="25"
    viewBox="0 0 26 25"
    fill="none"
    className={twMerge('text-white', className)}
  >
    <path
      d="M5.4707 12.6206H8.281V15.4309H11.0913V12.6206H13.9016V9.81029H16.7119V7H19.5222V9.81029H16.7119V12.6206H13.9016V15.4309H11.0913V18.2412H8.281V15.4309H5.4707V12.6206Z"
      fill="currentColor"
    />
  </svg>
);
