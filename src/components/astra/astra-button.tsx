import { Switch } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { BsGrid, BsList } from 'react-icons/bs';
import { useAppContext } from 'src/utils/context/AppContext';
import {
  activeColor,
  buttonBorderColor,
  textColor,
  brandTextColor,
  brandBgCustomColor,
  btnBgColorText
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: ReactNode;
  small?: boolean;
  disabled?: boolean;
  className?: string;
  highlighted?: boolean;
  primary?: boolean;
  submit?: boolean;
  tooltip?: string;
}

export const AButton = ({
  small = false,
  disabled = false,
  primary = false,
  submit = false,
  children,
  className = '',
  tooltip = '',
  highlighted = false,
  onClick
}: Props): JSX.Element => {
  return (
    <ButtonBase
      disabled={disabled}
      submit={submit}
      primary={primary}
      highlighted={highlighted}
      tooltip={tooltip}
      className={twMerge(small ? 'text-sm px-2 py-0.5' : 'px-2.5 py-1.25', primary ? btnBgColorText : '', className)}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  );
};

// ======================================================

interface BaseProps {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  primary?: boolean;
  highlighted?: boolean;
  submit?: boolean;
  tooltip?: string;
}

const ButtonBase = ({
  primary = false,
  disabled = false,
  submit = false,
  children,
  className = '',
  highlighted = false,
  tooltip = '',
  onClick
}: BaseProps): JSX.Element => {
  const disabledClass = 'opacity-30 cursor-not-allowed';

  return (
    <button
      type={submit ? 'submit' : 'button'}
      // don't disable here, just use the disabled style
      // otherwise a disabled buttons click will go to the parent, onClick isn't called
      // disabled={disabled}
      className={twMerge(
        highlighted ? brandTextColor : primary ? 'text-light-body' : textColor,
        activeColor,
        'select-none transition ease-in-out duration-300',
        'focus:outline-none focus-visible:ring focus:ring-dark-bg focus:ring-opacity-50',
        disabled ? disabledClass : '',
        className
      )}
      title={tooltip}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          e.preventDefault();

          if (!disabled) {
            onClick(e);
          }
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
  highlighted,
  tooltip = '',
  className = '',
  onClick
}: Props): JSX.Element => {
  const base = 'rounded-full p-2  ';

  return (
    <ButtonBase
      disabled={disabled}
      tooltip={tooltip}
      highlighted={highlighted}
      className={twMerge(base, small ? 'p-1' : 'p-2', className)}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  );
};

// ======================================================

export const ARoundOutlineButton = ({
  small = false,
  disabled = false,
  children,
  highlighted,
  className = '',
  tooltip = '',
  onClick
}: Props): JSX.Element => {
  return (
    <ARoundButton
      small={small}
      tooltip={tooltip}
      disabled={disabled}
      highlighted={highlighted}
      className={twMerge(buttonBorderColor, 'border rounded-full', className)}
      onClick={onClick}
    >
      {children}
    </ARoundButton>
  );
};

// ==============================================================

export const AOutlineButton = ({
  small = false,
  disabled = false,
  children,
  className = '',
  tooltip = '',
  onClick
}: Props): JSX.Element => {
  return (
    <AButton
      small={small}
      tooltip={tooltip}
      disabled={disabled}
      className={twMerge(buttonBorderColor, 'border', className)}
      onClick={onClick}
    >
      {children}
    </AButton>
  );
};

// ==============================================================

export const ATextButton = ({
  small = false,
  disabled = false,
  children,
  className = '',
  tooltip = '',
  onClick
}: Props): JSX.Element => {
  return (
    <ButtonBase
      disabled={disabled}
      tooltip={tooltip}
      className={twMerge(
        small ? 'text-sm px-3 py-0.5' : 'px-4 py-1',
        'hover:text-brand-primary dark:hover:text-brand-darkPrimary',
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
  onClick: () => void;
}

export const AToggleButton = ({ children, onClick }: Props4) => {
  return (
    <AButton
      onClick={() => {
        onClick();
      }}
      className={twMerge('p-2 rounded-md')}
    >
      {children}
    </AButton>
  );
};

interface Props5 {
  checked: boolean;
  onChange: () => void;
}

export const ASwitchButton = ({ checked, onChange }: Props5) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={twMerge(
        'border border-light-customBorder dark:border-dark-customBorder relative inline-flex p-1 w-13 shrink-0 cursor-pointer rounded \
             transition-colors duration-100 ease-in-out',
        checked ? brandBgCustomColor : ''
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={twMerge(
          'bg-gray-300',
          checked ? 'translate-x-full bg-white dark:bg-black' : 'translate-x-0',
          'h-5.5 w-5.5 rounded-3'
        )}
      />
    </Switch>
  );
};

// ==============================================================

export const AListGridButton = () => {
  const { setListMode, listMode } = useAppContext();

  return (
    <div className="flex items-center">
      <AToggleButton onClick={() => setListMode(true)}>
        <BsList className={twMerge(listMode ? textColor : '', 'h-4 w-4')} />
      </AToggleButton>
      <div className="  w-1  " />
      <AToggleButton onClick={() => setListMode(false)}>
        <BsGrid className={twMerge(!listMode ? textColor : '', 'h-4 w-4')} />
      </AToggleButton>
    </div>
  );
};

// ==============================================================

interface Props5 {
  left?: ReactNode;
  label?: string;
  right?: ReactNode;
}

export const AButtonContents = ({ left, right, label }: Props5) => {
  return (
    <div className="flex items-center gap-1">
      {left}
      <div className="whitespace-nowrap">{label}</div>
      {right}
    </div>
  );
};
