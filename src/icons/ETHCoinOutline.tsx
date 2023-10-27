import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';
import { darkWhiteIconColor } from 'src/utils/ui-constants';

export const ETHCoinOutline = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    className={twMerge(darkWhiteIconColor, className)}
  >
    <path
      d="M3 0H12V1.5H3V0ZM1.5 3V1.5H3V3H1.5ZM1.5 12V3H0V12H1.5ZM3 13.5V12H1.5V13.5H3ZM12 13.5V15H3V13.5H12ZM13.5 12V13.5H12V12H13.5ZM13.5 3H15V12H13.5V3ZM13.5 3V1.5H12V3H13.5Z"
      fill="currentColor"
    />
    <path
      d="M4.62451 12.5V10.9751H10.6245V12.5H4.62451ZM5.35737 8.68994V7.21777H9.92165V8.68994H5.35737ZM4.78737 5.04687V3.5H10.3502V5.04687H4.78737Z"
      fill="currentColor"
    />
  </svg>
);
