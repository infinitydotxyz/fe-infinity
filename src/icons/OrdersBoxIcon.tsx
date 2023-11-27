import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';
import { sidebarIconColors } from 'src/utils/ui-constants';

export const OrdersBoxIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="39"
    height="38"
    viewBox="0 0 39 38"
    fill="none"
    className={twMerge(sidebarIconColors, className)}
  >
    <path
      d="M17 9H13V13H17V9ZM24 16V14H10V23H12V29H14V23H16V29H18V16H24ZM19 9H30V23H19V21H28V11H19V9Z"
      fill="currentColor"
    />
  </svg>
);
