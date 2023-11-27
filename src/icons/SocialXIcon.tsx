import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const SocialXIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="20"
    viewBox="0 0 23 20"
    fill="none"
    className={twMerge('text-neutral-300', className)}
  >
    <path
      d="M17.8622 0H21.255L13.8427 8.4718L22.5627 20H15.735L10.3873 13.0082L4.26832 20H0.873447L8.80165 10.9385L0.436523 0H7.43755L12.2714 6.39077L17.8622 0ZM16.6714 17.9692H18.5514L6.41601 1.9241H4.39858L16.6714 17.9692Z"
      fill="currentColor"
    />
  </svg>
);
