import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const BlueCheckIcon = ({ className = '' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    className={twMerge('text-cyan-500', className)}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 0.5H16.6667V10.5H15.0002V10.9168H15V12.1667H13.3333V10.9168H13.3331V11.7502V12.1667H13.3333V13.8333H13.3331V13.8335H11.6667V15.5002H5.00008V15.5H5V13.8335H3.33309V12.1667H1.66667V10.5H1.66683V9.25H1.66667V10.5H0V0.5ZM6.66691 7.16659H5.00024V8.83325H6.66691V10.4999H8.33358V8.83325H10.0002V7.16659H11.6669V5.49992H13.3336V3.83325H11.6669V5.49992H10.0002V7.16659H8.33358V8.83325H6.66691V7.16659Z"
      fill="currentColor"
    />
  </svg>
);
