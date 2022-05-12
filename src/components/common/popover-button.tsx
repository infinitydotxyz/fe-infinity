import React, { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { inputBorderColor } from '../../utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  title: string;
  children: ReactNode;
  buttonClassName?: string;
}

export const PopoverButton = ({ title, children, buttonClassName }: Props) => {
  return (
    <Popover className="relative">
      {() => (
        <>
          <Popover.Button
            className={twMerge(`
                ${inputBorderColor}
                transition ease-in-out duration-300 hover:border-black  active:bg-gray-900
                focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50
                px-6 py-2
                border rounded-full text-gray-900
                flex items-center space-x-1 ${buttonClassName ?? ''}`)}
          >
            {title}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10  max-w-sm px-4 mt-3 right-0 transform sm:px-0 ">
              <div className="overflow-hidden rounded-lg  shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-5 bg-theme-light-50 w-80 space-y-4">{children}</div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
