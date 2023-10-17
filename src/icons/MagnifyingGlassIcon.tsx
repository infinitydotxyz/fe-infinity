import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const MagnifyingGlassIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    className={twMerge('text-neutral-700', className)}
  >
    <path
      d="M2 0H6V1H2V0ZM1 2V1H2V2H1ZM1 6H0V2H1V6ZM2 7H1V6H2V7ZM6 7V8H2V7H6ZM7 6H6V7H7V8H8V9H9V10H10V9H9V8H8V7H7V6ZM7 2H8V6H7V2ZM7 2V1H6V2H7Z"
      fill="currentColor"
    />
  </svg>
);
