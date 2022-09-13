import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from '../../utils/ui-constants';

const classes = {
  // focus ring appears on keyboard tab key navigation for accessibility, not on clicks
  base: 'select-none focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50 transition ease-in-out duration-300 active:bg-gray-900 active:text-white',
  disabled: 'opacity-50 cursor-not-allowed',
  pill: 'rounded-full',
  size: {
    plain: '',
    round: 'p-3',
    small: 'px-3 py-1 text-xs',
    normal: 'px-6 py-2',
    medium: 'px-5 py-2 text-sm',
    large: 'px-8 py-3 text-lg'
  },
  variant: {
    plain: '',
    ghost: 'rounded-full', // hover fill needs to be rounded
    primary: 'rounded-full border-gray-100 bg-gradient-to-b from-[#333] to-[#000] text-white hover:bg-theme-gray-900',
    gray: 'border-none rounded-full bg-theme-gray-100 hover:bg-theme-gray-200',
    outline: twMerge(inputBorderColor, 'border rounded-full text-gray-900 hover:bg-theme-gray-200'),
    outlineWhite: twMerge(inputBorderColor, 'border bg-white rounded-full text-gray-900 hover:bg-theme-gray-200'),
    danger: 'bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white',
    round: 'rounded-full p-1', // use plain size
    white: 'border rounded-full border-gray-100 bg-white text-black hover:bg-theme-gray-200'
  }
};

export interface ButtonProps {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: ReactNode;
  variant?: keyof typeof classes.variant;
  size?: keyof typeof classes.size;
  disabled?: boolean;
  className?: string;
  type?: 'submit' | 'button';
  title?: string;
}

export const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'normal',
  disabled = false,
  children,
  className = '',
  title,
  onClick
}: ButtonProps): JSX.Element => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(
        classes.base,
        classes.size[size],
        classes.variant[variant],
        disabled ? classes.disabled : '',
        className
      )}
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
      title={title}
    >
      <div className="whitespace-nowrap">{children}</div>
    </button>
  );
};
