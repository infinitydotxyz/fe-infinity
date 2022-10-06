import { Menu, Transition } from '@headlessui/react';
import { ReactElement, ReactNode } from 'react';
import { BiCaretDown } from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from '../../utils/ui-constants';
import { Divider } from './divider';

export type DropdownItem = {
  label: string | ReactElement;
  icon?: ReactNode;
  onClick: () => void;
};

interface DropdownProps {
  label?: string | ReactElement;
  items: DropdownItem[];
  toggler?: ReactElement; // custom toggler element.
  itemListClassName?: string;
  itemClassName?: string;
  className?: string;
  alignMenuRight?: boolean;
}

export const Dropdown = ({
  label,
  items,
  toggler,
  itemListClassName = '',
  itemClassName = '',
  className = '',
  alignMenuRight = false
}: DropdownProps) => {
  return (
    <div className={twMerge(className)}>
      <Menu>
        {({ open }) => (
          <CustomMenuContents>
            {toggler ? (
              <CustomMenuButton>{toggler}</CustomMenuButton>
            ) : (
              <span>
                <CustomMenuButton
                  className={twMerge(
                    inputBorderColor,
                    'transition ease-in-out duration-300 bg-white active:bg-gray-900 hover:bg-theme-gray-200',
                    'focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50',
                    'px-6 py-2.5 border rounded-full text-gray-900 font-heading flex items-center space-x-1'
                  )}
                >
                  <div className="whitespace-nowrap">{label}</div>
                  <BiCaretDown />
                </CustomMenuButton>
              </span>
            )}

            <CustomMenuItems open={open} alignMenuRight={alignMenuRight}>
              <div className={`py-1 ${itemListClassName}`}>
                {items.map((item, idx) => {
                  if (item.label === '-') {
                    return <MenuSeparator key={idx} />;
                  }

                  return (
                    <CustomMenuItem key={idx} onClick={item.onClick} itemclassname={itemClassName}>
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
  itemclassname?: string;
}
export const CustomMenuItem = (props: Props) => {
  return (
    <Menu.Item {...props}>
      {({ active, disabled }) => (
        <div
          className={twMerge(
            'flex w-full justify-between px-4 py-4 text-left leading-5 font-heading ',
            active ? 'hover:bg-theme-light-200 rounded-xl' : 'text-gray-700',
            disabled && 'cursor-not-allowed opacity-50',
            props.itemclassname
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
            'absolute mt-2 p-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-2xl',
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

export const MenuSeparator = () => {
  return <Divider />;
};

// =======================================================================

interface Props3 {
  children: ReactNode;
  className?: string;
}

export const CustomMenuButton = ({ children, className = '' }: Props3) => {
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

export const CustomMenuContents = ({ children }: Props4) => {
  // button needs to be relative for the menu positioning
  return <div className="relative">{children}</div>;
};
