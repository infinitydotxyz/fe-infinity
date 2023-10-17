import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';
import { darkWhiteIconColor } from 'src/utils/ui-constants';

export const ArrowSmallIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="20"
    viewBox="0 0 23 20"
    fill="none"
    className={twMerge(darkWhiteIconColor, className)}
  >
    <path
      d="M22.8555 8.57143V11.4286H5.71261V14.2857H2.85547V11.4286H-0.00167274V8.57143H2.85547V5.71429H5.71261V8.57143H22.8555ZM8.56976 2.85714H5.71261V5.71429H8.56976V2.85714ZM8.56976 2.85714H11.4269V0H8.56976V2.85714ZM8.56976 17.1429H5.71261V14.2857H8.56976V17.1429ZM8.56976 17.1429H11.4269V20H8.56976V17.1429Z"
      fill="currentColor"
    />
  </svg>
);
