import { Menu, Transition } from '@headlessui/react';
import { ReactElement, ReactNode } from 'react';
import { borderColor, dropShadow, hoverColor, hoverColorBrandText, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Divider } from '../common';
import { AOutlineButton, ATextButton } from './astra-button';
import { ChevronDown } from 'src/icons';

export type ADropdownItem = {
  label: string | ReactElement;
  icon?: ReactNode;
  onClick: () => void;
};

interface DropdownBtnProps {
  children?: ReactNode;
  isMenuOpen?: boolean;
  className?: string;
}

export const ADropdownButton = ({ children, isMenuOpen, className }: DropdownBtnProps) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-1.5 py-1 text-sm text-neutral-200 dark:text-white font-medium',
        hoverColorBrandText,
        className
      )}
    >
      <div className={twMerge('whitespace-nowrap font-medium')}>{children}</div>
      <div
        style={{
          transition: 'all 0.1s ease',
          transform: `rotate(${!isMenuOpen ? 0 : '0.5turn'})`
        }}
      >
        <ChevronDown className="w-3 h-2" />
      </div>
    </div>
  );
};

interface DropdownProps {
  label?: string | ReactElement;
  items: ADropdownItem[];
  className?: string;
  tooltip?: string;
  alignMenuRight?: boolean;
  hasBorder?: boolean;
  innerClassName?: string;
  menuItemClassName?: string;
  menuButtonClassName?: string;
  menuParentButtonClassName?: string;
}

export const ADropdown = ({
  label,
  items,
  className = '',
  tooltip = '',
  hasBorder = true,
  alignMenuRight = false,
  innerClassName = '',
  menuItemClassName = '',
  menuButtonClassName = '',
  menuParentButtonClassName = ''
}: DropdownProps) => {
  return (
    <div className={twMerge(className, 'text-sm')}>
      <Menu>
        {({ open }) => (
          <ACustomMenuContents>
            <span>
              <ACustomMenuButton>
                {hasBorder && (
                  <AOutlineButton className={menuParentButtonClassName} tooltip={tooltip}>
                    <ADropdownButton className={menuButtonClassName} isMenuOpen={open}>
                      {label}
                    </ADropdownButton>
                  </AOutlineButton>
                )}{' '}
                {!hasBorder && (
                  <ATextButton className={menuParentButtonClassName} tooltip={tooltip}>
                    <ADropdownButton className={menuButtonClassName} isMenuOpen={open}>
                      {label}
                    </ADropdownButton>
                  </ATextButton>
                )}
              </ACustomMenuButton>
            </span>

            <ACustomMenuItems
              open={open}
              alignMenuRight={alignMenuRight}
              innerClassName={twMerge('border-0', innerClassName)}
            >
              <div className="">
                {items.map((item, idx) => {
                  if (item.label === '-') {
                    return <AMenuSeparator key={idx} />;
                  }

                  return (
                    <ACustomMenuItem key={idx} onClick={item.onClick} className={menuItemClassName}>
                      <div className={twMerge(hoverColorBrandText, 'flex items-center cursor-pointer')}>
                        {item.icon && <div className={twMerge('mr-4')}>{item.icon}</div>}
                        {item.label}
                      </div>
                    </ACustomMenuItem>
                  );
                })}
              </div>
            </ACustomMenuItems>
          </ACustomMenuContents>
        )}
      </Menu>
    </div>
  );
};

// =======================================================================

interface Props {
  onClick: () => void;
  children: ReactElement | string;
  className?: string;
}

const ACustomMenuItem = (props: Props) => {
  return (
    <Menu.Item {...props}>
      {({ active, disabled }) => (
        <div
          className={twMerge(
            'flex w-full px-4 py-4 leading-5',
            active ? twMerge(hoverColor, 'rounded-lg cursor-pointer') : ' ',
            disabled && 'cursor-not-allowed opacity-50',
            props.className
          )}
        >
          {props.children}
        </div>
      )}
    </Menu.Item>
  );
};

// =======================================================================

interface Props2 {
  children: ReactNode;
  open: boolean;
  alignMenuRight?: boolean;
  innerClassName?: string;
}

export const ACustomMenuItems = ({ children, open, alignMenuRight, innerClassName }: Props2) => {
  return (
    <div className={twMerge('absolute bottom-0 z-50', alignMenuRight ? 'right-0' : '')}>
      <Transition
        show={open}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={twMerge(
            secondaryBgColor,
            borderColor,
            dropShadow,
            'absolute mt-4 px-2 py-4 w-56 rounded-lg border outline-none',
            alignMenuRight ? 'right-0' : '',
            innerClassName
          )}
        >
          <div
            className={twMerge(
              'h-4 w-4 rotate-45 absolute -top-1.5',
              secondaryBgColor,
              alignMenuRight ? 'right-8' : 'left-8'
            )}
          ></div>
          {children}
        </Menu.Items>
      </Transition>
    </div>
  );
};

// =======================================================================

export const AMenuSeparator = () => {
  return <Divider className="my-1" />;
};

// =======================================================================

interface Props3 {
  children: ReactNode;
  className?: string;
}

export const ACustomMenuButton = ({ children, className = '' }: Props3) => {
  // without as="div", you get a button within button error
  return (
    <Menu.Button as="div" className={twMerge('', className)}>
      {children}
    </Menu.Button>
  );
};

// =======================================================================

interface Props4 {
  children: ReactNode;
}

export const ACustomMenuContents = ({ children }: Props4) => {
  // button needs to be relative for the menu positioning
  return <div className="relative">{children}</div>;
};
