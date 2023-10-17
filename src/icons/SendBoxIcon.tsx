import React from 'react';
import { twMerge } from 'tailwind-merge';
import { IconProps } from '.';
import { sidebarIconColors } from 'src/utils/ui-constants';

export const SendBoxIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="39"
    height="38"
    viewBox="0 0 39 38"
    fill="none"
    className={twMerge(sidebarIconColors, className)}
  >
    <path
      d="M21.8889 9H19.1111V14.7143H10.7778V17.5714H8V26.1429H10.7778V23.2857H19.1111V29H21.8889V26.1429H24.6667V23.2857H27.4444V20.4286H30.2222V17.5714H27.4444V14.7143H24.6667V11.8571H21.8889V9Z"
      fill="currentColor"
    />
  </svg>
);
