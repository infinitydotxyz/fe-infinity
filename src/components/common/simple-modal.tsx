import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { Button } from 'src/components/common/button';
import { Spacer } from 'src/components/common/spacer';
import { XIcon } from '@heroicons/react/outline';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  title?: string;
  okButton?: string;
  onClose: () => void;
  onSubmit?: () => void;
  showActionButtons?: boolean;
}

export const SimpleModal = ({
  children,
  onSubmit,
  okButton = 'OK',
  title,
  isOpen,
  onClose,
  showActionButtons = true
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h2" className="flex text-lg font-bold leading-6 text-gray-900 mb-2">
                {title}
                <Spacer />
                <Button size="small" variant="ghost" onClick={onClose}>
                  <XIcon className="h-6 w-6" />
                </Button>
              </Dialog.Title>

              {children}

              {showActionButtons && (
                <div className="flex space-x-1 mt-4">
                  <div className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Button onClick={onSubmit}>{okButton}</Button>
                  </div>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
