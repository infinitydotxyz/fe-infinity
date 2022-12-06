import React, { ReactNode } from 'react';
import { cl } from 'src/utils';
import { twMerge } from 'tailwind-merge';

export type ThemeColor = 'red' | 'white' | 'blue' | 'black';

export const backColorForTheme = (theme: ThemeColor) => {
  switch (theme) {
    case 'white':
      return '#d45658';
    case 'red':
    case 'blue':
    case 'black':
      return '#fff';
  }
};

export const textColorForTheme = (theme: ThemeColor) => {
  switch (theme) {
    case 'red':
      return '#d45658';
    case 'white':
      return '#fff';
    case 'blue':
      return '#573fd0';
    case 'black':
      return '#151515';
  }
};

export const headerColorForTheme = (theme: ThemeColor) => {
  switch (theme) {
    case 'white':
      return '#000';
    case 'red':
    case 'blue':
    case 'black':
      return '#fff';
  }
};

interface Props {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  backgroundColor: string;
  textColor: string;
  title?: string;
}

export const ColoredButton = ({
  disabled = false,
  backgroundColor,
  children,
  className = '',
  title,
  textColor,
  onClick
}: Props): JSX.Element => {
  const baseClass =
    'select-none focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50 transition ease-in-out duration-300 active:bg-gray-900 active:text-white';
  const disabledClass = 'opacity-50 cursor-not-allowed';
  cl(textColor);

  return (
    <button
      type="button"
      disabled={disabled}
      className={twMerge(baseClass, disabled ? disabledClass : '', 'font-bold text-sm rounded-md px-5 py-1', className)}
      style={{ background: backgroundColor, color: textColor }}
      onClick={(e) => {
        // this allows a button to be in a clickable div
        e.stopPropagation();
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }
      }}
      title={title}
    >
      <div className="whitespace-nowrap">{children}</div>
    </button>
  );
};
