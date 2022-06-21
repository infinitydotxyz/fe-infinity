import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from '../../utils/ui-constants';

const classes = {
  // focus ring appears on keyboard tab key navigation for accessibility, not on clicks
  base: 'select-none focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50 transition ease-in-out duration-300 focus:border-black active:bg-gray-900',
  disabled: 'opacity-50 cursor-not-allowed',
  pill: 'rounded-full',
  size: {
    plain: '',
    small: 'px-3 py-1 text-xs',
    normal: 'px-6 py-2',
    large: 'px-8 py-3 text-lg'
  },
  variant: {
    plain: '',
    ghost: 'rounded-full', // hover fill needs to be rounded
    primary: 'border rounded-full border-gray-100 bg-black text-white hover:bg-theme-gray-900',
    secondary: 'border rounded-full border-gray-100 bg-black text-white',
    gray: 'border-none rounded-full bg-theme-gray-100 hover:bg-theme-gray-200',
    outline: twMerge(inputBorderColor, 'border rounded-full text-gray-900 hover:bg-theme-gray-200'),
    danger: 'bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white',
    round: 'rounded-full p-1' // use plain size
  }
};

export interface Props {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: ReactNode;
  variant?: keyof typeof classes.variant;
  size?: keyof typeof classes.size;
  disabled?: boolean;
  className?: string;
  type?: 'submit' | 'button';
}

export const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'normal',
  disabled = false,
  children,
  className = '',
  onClick
}: Props): JSX.Element => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(`
        ${classes.base}
        ${classes.size[size]}
        ${classes.variant[variant]}
        ${disabled ? classes.disabled : ''}
        ${className}
      `)}
      onClick={(e) => {
        if (type === 'button') {
          // this allows a button to be in a clickable div
          e.stopPropagation();
          e.preventDefault();

          if (onClick) {
            onClick(e);
          }
        }
      }}
    >
      <div className="whitespace-nowrap">{children}</div>
    </button>
  );
};
