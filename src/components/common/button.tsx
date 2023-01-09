import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { activeColor, hoverColor, inputBorderColor, primaryBtnBgColor, textColor } from '../../utils/ui-constants';

const classes = {
  // focus ring appears on keyboard tab key navigation for accessibility, not on clicks
  base: twMerge(
    'select-none focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50 transition ease-in-out duration-300',
    activeColor
  ),
  disabled: 'opacity-50 cursor-not-allowed',
  pill: 'rounded-full',
  size: {
    plain: '',
    round: 'p-2.5',
    small: 'px-3 py-1 text-xs',
    normal: 'px-6 py-2',
    medium: 'px-4 py-2 text-sm',
    large: 'px-5 py-2 text-lg'
  },
  variant: {
    plain: '',
    ghost: 'rounded-xl', // hover fill needs to be rounded
    primary: twMerge(inputBorderColor, hoverColor, primaryBtnBgColor, 'text-light-body', 'rounded-xl'),
    gray: twMerge(hoverColor, 'border-none rounded-xl bg-gray-100'),
    outline: twMerge(inputBorderColor, hoverColor, textColor, 'border rounded-xl'),
    outlineWhite: twMerge(inputBorderColor, hoverColor, 'border bg-white rounded-xl'),
    round: 'rounded-full',
    roundBorder: twMerge(inputBorderColor, hoverColor, textColor, 'border rounded-full'),
    danger: twMerge(
      textColor,
      'rounded-xl bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
    ),
    outlineDanger:
      'rounded-xl border rounded-full text-gray-900 bg-gray-100 hover:bg-gray-200 border-red-500 hover:border-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
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
