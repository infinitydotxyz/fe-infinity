import { Menu, Transition } from '@headlessui/react';
import { ReactElement, ReactNode } from 'react';
import { BiCaretDown } from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';
import { Divider } from '../common';
import { AOutlineButton } from './astra-button';

export type ADropdownItem = {
  label: string | ReactElement;
  icon?: ReactNode;
  onClick: () => void;
};

interface DropdownProps {
  label?: string | ReactElement;
  items: ADropdownItem[];
  className?: string;
  alignMenuRight?: boolean;
}

export const ADropdown = ({ label, items, className = '', alignMenuRight = false }: DropdownProps) => {
  return (
    <div className={twMerge(className)}>
      <Menu>
        {({ open }) => (
          <CustomMenuContents>
            <span>
              <CustomMenuButton>
                <AOutlineButton>
                  <div className="flex items-center gap-1">
                    <div className="whitespace-nowrap">{label}</div>
                    <BiCaretDown />
                  </div>
                </AOutlineButton>
              </CustomMenuButton>
            </span>

            <CustomMenuItems open={open} alignMenuRight={alignMenuRight}>
              <div className={`py-1  `}>
                {items.map((item, idx) => {
                  if (item.label === '-') {
                    return <MenuSeparator key={idx} />;
                  }

                  return (
                    <CustomMenuItem key={idx} onClick={item.onClick}>
                      <div className="flex items-center cursor-pointer">
                        {item.icon && <div className="mr-4">{item.icon}</div>}
                        {item.label}
                      </div>
                    </CustomMenuItem>
                  );
                })}
              </div>
            </CustomMenuItems>
          </CustomMenuContents>
        )}
      </Menu>
    </div>
  );
};

// =======================================================================

interface Props {
  onClick: () => void;
  children: ReactElement | string;
}

const CustomMenuItem = (props: Props) => {
  return (
    <Menu.Item {...props}>
      {({ active, disabled }) => (
        <div
          className={twMerge(
            'flex w-full justify-between px-4 py-4 text-left leading-5 font-heading ',
            active ? 'hover:bg-theme-light-200 rounded-xl' : 'text-gray-700',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span>{props.children}</span>
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
}

export const CustomMenuItems = ({ children, open, alignMenuRight }: Props2) => {
  return (
    <div className={twMerge('absolute bottom-0  z-50', alignMenuRight ? 'right-0' : ' ')}>
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
            'absolute mt-2 p-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none',
            alignMenuRight ? 'right-0' : ''
          )}
        >
          {children}
        </Menu.Items>
      </Transition>
    </div>
  );
};

// =======================================================================

const MenuSeparator = () => {
  return <Divider className="my-1" />;
};

// =======================================================================

interface Props3 {
  children: ReactNode;
  className?: string;
}

const CustomMenuButton = ({ children, className = '' }: Props3) => {
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

const CustomMenuContents = ({ children }: Props4) => {
  // button needs to be relative for the menu positioning
  return <div className="relative">{children}</div>;
};
