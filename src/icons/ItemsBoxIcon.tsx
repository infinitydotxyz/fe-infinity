import React from 'react';
import { sidebarIconColors } from 'src/utils/ui-constants';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const ItemsBoxIcon = ({ className }: IconProps) => (
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
      d="M32 9H7V16.5H9.5V29H29.5V16.5H32V9ZM23.248 18.999H15.748V21.499H23.248V18.999Z"
      fill="currentColor"
    />
  </svg>
);
