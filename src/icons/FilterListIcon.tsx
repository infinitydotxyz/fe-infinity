import React from 'react';
import { IconProps } from '.';
import { twMerge } from 'tailwind-merge';

export const FilterListIcon = ({ className }: IconProps) => (
  <svg
    width="13"
    height="11"
    viewBox="0 0 13 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={twMerge('text-neutral-700', className)}
  >
    <rect width="2" height="1" transform="translate(1 3.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(1 0.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(0 0.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(3 3.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(3 0.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(3 6.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(4 3.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(4 0.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(4 6.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(4 9.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(6 3.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(6 0.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(6 6.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(6 9.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(7 3.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(7 0.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(7 6.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(7 9.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(9 3.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(9 0.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(9 6.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(10 3.5)" fill="currentColor" />
    <rect width="1" height="1" transform="translate(10 0.5)" fill="currentColor" />
    <rect width="2" height="1" transform="translate(11 0.5)" fill="currentColor" />
  </svg>
);
