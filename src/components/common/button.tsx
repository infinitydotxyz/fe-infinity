import React, { forwardRef, ReactElement } from 'react';

const classes = {
  base: 'focus:outline-none transition ease-in-out duration-300 hover:bg-gray-700 hover:text-white active:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
  disabled: 'opacity-50 cursor-not-allowed',
  pill: 'rounded-full',
  size: {
    plain: '',
    small: 'px-2 py-1 text-sm',
    normal: 'px-6 py-2',
    large: 'px-8 py-3 text-lg'
  },
  variant: {
    plain: '',
    primary: 'border rounded-3xl border-gray-100 bg-black text-white',
    secondary: 'border rounded-3xl border-gray-100 bg-black text-white',
    outline: 'border rounded-3xl border border-gray-300 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white'
  }
};

type ButtonProps = JSX.IntrinsicElements['button'] & {
  children: ReactElement | ReactElement[] | string;
  variant?: 'plain' | 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'plain' | 'small' | 'normal' | 'large';
};

// eslint-disable-next-line
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'primary', size = 'normal', disabled = false, ...rest }: ButtonProps, ref) => (
    <button
      type="button"
      ref={ref}
      disabled={disabled}
      className={`
        ${classes.base}
        ${classes.size[size]}
        ${classes.variant[variant]}
        ${disabled && classes.disabled}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
);

export default Button;
