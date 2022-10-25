import React, { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Chip } from './chip';
import { BiCaretDown } from 'react-icons/bi';

interface Props {
  title: string;
  children: ReactNode;
}

export const PopoverButton = ({ title, children }: Props) => {
  return (
    // this is bullshit. pointer-events-auto, why are we turning off pointer events? fix at somepoint
    <Popover className="relative pointer-events-auto">
      {() => (
        <>
          {/* without as="div", you get a button within button error */}
          <Popover.Button as="div">
            <Chip
              disableClick={true}
              content={
                <div className="flex items-center gap-1">
                  <div className="whitespace-nowrap">{title}</div>
                  <BiCaretDown />
                </div>
              }
            />
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
            <Popover.Panel className="absolute z-10 max-w-sm px-4 mt-3 right-0 transform sm:px-0">
              <div className="overflow-hidden rounded-3xl shadow-[0_20px_10px_-10px_rgba(0,0,0,0.07),0_0px_10px_-2px_rgba(0,0,0,0.08)] p-6 bg-theme-light-50">
                <div className="px-4 bg-theme-light-50 w-80 space-y-4">{children}</div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
