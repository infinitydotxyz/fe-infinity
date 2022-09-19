import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { Spacer, Button } from 'src/components/common';
import { XIcon } from '@heroicons/react/outline';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  isOpen: boolean;
  onClose: () => void;

  children?: ReactNode;
}

export const FullScreenModal = ({
  isOpen,
  children,

  onClose // X icon, or click outside dialog
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={twMerge(
                'w-full h-full max-h-full transform rounded-2xl bg-white py-8 px-9 text-left align-middle shadow-xl transition-all'
              )}
            >
              <div className=" flex flex-col  h-full  max-h-full    ">
                <Dialog.Title
                  as="h3"
                  className="flex items-center tracking-tight text-xl font-bold leading-6 text-gray-900 mb-6"
                >
                  <Spacer />

                  <Button size="plain" variant="round" onClick={onClose}>
                    <XIcon className={iconButtonStyle} />
                  </Button>
                </Dialog.Title>

                <div className="   flex-1  overflow-scroll">{children}</div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
