import { Popover, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import {
  borderColor,
  dropShadow,
  hoverColorBrandText,
  secondaryBgColor,
  secondaryTextColor,
  smallIconButtonStyle
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra/astra-button';

interface Props {
  title: string;
  children: ReactNode;
  alignMenuRight?: boolean;
}

export const PopoverButton = ({ title, children, alignMenuRight }: Props) => {
  return (
    // this is bullshit. pointer-events-auto, why are we turning off pointer events? fix at somepoint
    <Popover className="relative pointer-events-auto text-sm">
      {({ open }) => (
        <>
          {/* without as="div", you get a button within button error */}
          <Popover.Button as="div">
            <AOutlineButton>
              <div className="flex items-center gap-1 py-1">
                <div className={twMerge('whitespace-nowrap font-medium', secondaryTextColor, hoverColorBrandText)}>
                  {title}
                </div>
                <RxCaretDown
                  className={twMerge(smallIconButtonStyle)}
                  style={{
                    transition: 'all 0.1s ease',
                    transform: `rotate(${!open ? 0 : '0.5turn'})`
                  }}
                />
              </div>
            </AOutlineButton>
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
            <Popover.Panel className="z-10">
              <div
                className={twMerge(
                  secondaryBgColor,
                  borderColor,
                  dropShadow,
                  alignMenuRight ? 'right-0' : '',
                  'absolute mt-4 px-4 py-4 w-56 rounded-lg border-0 outline-none'
                )}
              >
                <div
                  className={twMerge(
                    'h-4 w-4 rotate-45 absolute top-[-6px]',
                    secondaryBgColor,
                    alignMenuRight ? 'right-8' : 'left-8'
                  )}
                ></div>
                {children}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
