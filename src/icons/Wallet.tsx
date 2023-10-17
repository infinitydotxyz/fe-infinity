import React from 'react';
import { twMerge } from 'tailwind-merge';
import { IconProps } from '.';

export const Wallet = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="17"
    viewBox="0 0 19 17"
    fill="none"
    className={twMerge('text-white', className)}
  >
    <path
      d="M15.1111 0H0V17H17V13.2222H18.8889V3.77778H17V0H15.1111ZM15.1111 13.2222V15.1111H1.88889V1.88889H15.1111V3.77778H7.55556V13.2222H15.1111ZM17 11.3333H9.44445V5.66667H17V11.3333ZM13.2222 7.55556H11.3333V9.44444H13.2222V7.55556Z"
      fill="currentColor"
    />
  </svg>
);
