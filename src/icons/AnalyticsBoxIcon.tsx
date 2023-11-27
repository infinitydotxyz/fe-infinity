import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';
import { sidebarIconColors } from 'src/utils/ui-constants';

export const AnalyticsBoxIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="39"
    height="38"
    viewBox="0 0 39 38"
    fill="none"
    className={twMerge(sidebarIconColors, className)}
  >
    <path d="M28.2463 11.6421V26.83H10.8887V28.9997H30.416V11.6421H28.2463Z" fill="currentColor" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M26.4418 9H9V25.0276H26.4418V9ZM18.5034 13.1483H16.0898V22.7649H18.5034V13.1483ZM11.2627 15.5524H13.6763V22.7649H11.2627V15.5524ZM23.3305 17.9566H20.917V22.7649H23.3305V17.9566Z"
      fill="currentColor"
    />
  </svg>
);
