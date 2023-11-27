import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';
import { sidebarIconColors } from 'src/utils/ui-constants';

export const ExploreBoxIcon = ({ className }: IconProps) => (
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
      d="M10 9H18.8889V20.1111H10V9ZM21.1111 9H30V15.6667H21.1111V9ZM21.1111 17.8889H30V29H21.1111V17.8889ZM10 22.3333H18.8889V29H10V22.3333Z"
      fill="currentColor"
    />
  </svg>
);
