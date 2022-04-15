import React, { ReactNode } from 'react';

const classes = {
  // focus ring appears on keyboard tab key navigation for accessibility, not on clicks
  base: 'focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50 transition ease-in-out duration-300 hover:bg-gray-700 hover:text-white active:bg-gray-900',
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
    ghost: 'rounded-3xl', // hover fill needs to be rounded
    primary: 'border rounded-3xl border-gray-100 bg-black text-white',
    secondary: 'border rounded-3xl border-gray-100 bg-black text-white',
    outline: 'border rounded-3xl border border-gray-300 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white',
    gray: 'border rounded-3xl border-gray-100 bg-gray-100 text-black' // TODO: find better name
  }
};

interface Props {
  onClick?: () => void;
  children: ReactNode;
  variant?: keyof typeof classes.variant;
  size?: keyof typeof classes.size;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'normal',
  disabled = false,
  children,
  className = '',
  onClick
}: Props): JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
      ${classes.base}
      ${classes.size[size]}
      ${classes.variant[variant]}
      ${disabled && classes.disabled}
      ${className}
     `}
      onClick={(e) => {
        // this allows a button to be in a clickable div
        e.stopPropagation();
        e.preventDefault();

        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
}
