import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { Spacer, Button } from 'src/components/common';
import { XIcon } from '@heroicons/react/outline';
import { iconButtonStyle } from '../market/order-drawer/ui-constants';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  title?: string;
  titleChildren?: ReactNode;
  okButton?: string;
  onClose: () => void;
  onSubmit?: () => void;
  showActionButtons?: boolean;
  wide?: boolean;
}

export const Modal = ({
  children,
  onSubmit,
  okButton = 'OK',
  title,
  titleChildren,
  isOpen,
  onClose,
  showActionButtons = true,
  wide = true
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                className={`w-full ${
                  wide ? 'max-w-lg' : 'max-w-md'
                } transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <Dialog.Title as="h3" className="flex items-center text-lg font-medium leading-6 text-gray-900">
                  {title}
                  {titleChildren}

                  <Spacer />

                  <Button size="small" variant="ghost" onClick={onClose}>
                    <XIcon className={iconButtonStyle} />
                  </Button>
                </Dialog.Title>

                {children}

                {showActionButtons && (
                  <div className="flex space-x-4 mt-8">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>

                    <Button onClick={onSubmit}>{okButton}</Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
