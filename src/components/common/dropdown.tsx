import { Menu } from '@headlessui/react';
import { ReactElement } from 'react';
import { BiCaretDown } from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from '../../utils/ui-constants';

export type DropdownItems = {
  label: string | ReactElement;
  onClick: () => void;
};

interface DropdownProps {
  label?: string | ReactElement;
  items: DropdownItems[];
  toggler?: ReactElement; // custom toggler element.
  contentClassName?: string; // className for the dropdown content panel.
  itemListClassName?: string;
  itemClassName?: string;
  className?: string;
}

export const Dropdown = ({
  label,
  items,
  toggler,
  contentClassName,
  itemListClassName = '',
  itemClassName = '',
  className
}: DropdownProps) => {
  return (
    <div className={twMerge(`relative inline-block text-left ${className ?? ''}`)}>
      <Menu>
        {toggler ? (
          <Menu.Button>{toggler}</Menu.Button>
        ) : (
          <span>
            <Menu.Button
              className={twMerge(
                inputBorderColor,
                'transition ease-in-out duration-300 bg-white active:bg-gray-900 hover:bg-theme-gray-200',
                'focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50',
                'px-6 py-2.5 border rounded-xl text-gray-900 font-heading flex items-center space-x-1'
              )}
            >
              <div className="whitespace-nowrap">{label}</div>
              <BiCaretDown />
            </Menu.Button>
          </span>
        )}

        <Menu.Items
          className={twMerge(
            `absolute mt-2 p-4 w-56 origin-top-right divide-y divide-gray-100 rounded-xl z-50
            border border-gray-200 bg-white shadow-2xl outline-none ${contentClassName ?? ''}`
          )}
        >
          <div className={`py-1 ${itemListClassName}`}>
            {items.map((item, idx) => {
              return (
                <CustomMenuItem key={idx} onClick={item.onClick} itemclassname={itemClassName}>
                  {item.label}
                </CustomMenuItem>
              );
            })}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

interface CustomMenuItemProps {
  onClick: () => void;
  children: ReactElement | string;
  itemclassname?: string;
}
export const CustomMenuItem = (props: CustomMenuItemProps) => {
  return (
    <Menu.Item {...props}>
      {({ active, disabled }) => (
        <a
          href="#"
          className={twMerge(
            'flex w-full justify-between px-4 py-4 text-left leading-5 font-heading ',
            active ? 'hover:bg-theme-light-200 rounded-xl' : 'text-gray-700',
            disabled && 'cursor-not-allowed opacity-50',
            props.itemclassname
          )}
        >
          <span>{props.children}</span>
        </a>
      )}
    </Menu.Item>
  );
};
