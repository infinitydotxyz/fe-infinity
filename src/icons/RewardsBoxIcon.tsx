import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';
import { sidebarIconColors } from 'src/utils/ui-constants';

export const RewardsBoxIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="39"
    height="38"
    viewBox="0 0 39 38"
    fill="none"
    className={twMerge(sidebarIconColors, className)}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.4444 9H23.5556H25.7778V11.2222H30.2222V22.3333H25.7778V24.5556H20.2222V26.7778H23.5556V29H14.6667V26.7778H18V24.5556H12.4444V22.3333H8V11.2222H12.4444V9ZM28 20.1111V13.4444H25.7778V20.1111H28ZM10.2222 20.1111H12.4444V13.4444H10.2222V20.1111Z"
      fill="currentColor"
    />
  </svg>
);
