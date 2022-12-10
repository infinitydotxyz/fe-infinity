import React, { ReactNode } from 'react';
import { cardClr, inputBorderColor, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  onClick: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: ReactNode;
  small?: boolean;
  disabled?: boolean;
  className?: string;
  propagateClick?: boolean;
}

export const AButton = ({ small = false, disabled = false, children, className = '', onClick }: Props): JSX.Element => {
  return (
    <ButtonBase
      disabled={disabled}
      className={twMerge(small ? 'text-sm px-3 py-0.5' : 'px-4 py-1', 'rounded-md', cardClr, className)}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  );
};

// ======================================================

interface BaseProps {
  onClick: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  propagateClick?: boolean;
}

const ButtonBase = ({
  disabled = false,
  children,
  className = '',
  onClick,
  propagateClick
}: BaseProps): JSX.Element => {
  const disabledClass = 'opacity-30 cursor-not-allowed';

  return (
    <button
      // don't disable here, just use the disabled style
      // otherwise a disabled buttons click will go to the parent, onClick isn't called
      // disabled={disabled}
      className={twMerge(
        textClr,
        'active:dark:bg-light-bg  active:dark:text-dark-bg  ',
        'active:bg-dark-bg active:text-light-bg',
        'hover:dark:bg-opacity-10 hover:dark:bg-gray-200   ',
        'hover:bg-opacity-80 hover:bg-gray-200 ',
        'select-none transition ease-in-out duration-300',
        'focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50',
        disabled ? disabledClass : '',
        className
      )}
      onClick={(e) => {
        if (!propagateClick) {
          e.stopPropagation();
          e.preventDefault();
        }

        if (!disabled) {
          onClick(e);
        }
      }}
    >
      <div className="whitespace-nowrap">{children}</div>
    </button>
  );
};

// ======================================================

export const ARoundButton = ({
  small = false,
  disabled = false,
  children,

  className = '',
  onClick
}: Props): JSX.Element => {
  const base = 'rounded-full p-2  ';

  return (
    <ButtonBase disabled={disabled} className={twMerge(base, small ? '' : '', className)} onClick={onClick}>
      {children}
    </ButtonBase>
  );
};

// ==============================================================

export const AOutlineButton = ({
  small = false,
  disabled = false,
  children,
  className = '',
  onClick
}: Props): JSX.Element => {
  return (
    <ButtonBase
      disabled={disabled}
      className={twMerge(
        small ? 'text-sm px-3 py-0.5' : 'px-4 py-1',
        inputBorderColor,
        'border rounded-full',
        className
      )}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  );
};

// ==============================================================

export const ATextButton = ({
  small = false,
  disabled = false,
  children,
  className = '',
  onClick
}: Props): JSX.Element => {
  return (
    <ButtonBase
      disabled={disabled}
      className={twMerge(
        small ? 'text-sm px-3 py-0.5' : 'px-4 py-1',
        '  rounded-full text-gray-900 hover:bg-theme-gray-700',
        className
      )}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  );
};

// ==============================================================

interface Props4 {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export const AToggleButton = ({ selected, children, onClick }: Props4) => {
  return (
    <AButton
      onClick={() => {
        onClick();
      }}
      className={twMerge(
        'p-2 rounded-md  select-none focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50 transition ease-in-out duration-300 active:bg-gray-900 active:text-white',
        selected ? 'bg-gray-300' : ''
      )}
    >
      {children}
    </AButton>
  );
};
