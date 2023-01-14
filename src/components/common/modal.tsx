import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { Spacer, Button } from 'src/components/common';
import { XIcon } from '@heroicons/react/outline';
import { bgColor, iconButtonStyle, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;

  showCloseIcon?: boolean;

  children?: ReactNode;
  // you can repurpose the ok/cancel buttons
  // pass in '' to hide button
  okButton?: string;
  cancelButton?: string;

  disableOK?: boolean;
  disableCancel?: boolean;

  // if not set, it will call onClose
  onCancelButton?: () => void;
  onOKButton?: () => void;

  showActionButtons?: boolean;
  wide?: boolean;
  panelClassName?: string;
}

export const Modal = ({
  isOpen,
  children,
  onOKButton,
  onCancelButton,
  okButton = 'OK',
  cancelButton = 'Cancel',
  disableOK = false,
  showCloseIcon = false,
  disableCancel = false,
  title,
  onClose, // X icon, or click outside dialog
  showActionButtons = true,
  wide = true,
  panelClassName
}: Props) => {
  const buttons = [];

  // pass in '' to hide button
  if (cancelButton) {
    buttons.push(
      <Button
        key={Math.random()}
        className="flex-1 px-8 py-3"
        disabled={disableCancel}
        variant="outline"
        onClick={() => {
          if (onCancelButton) {
            onCancelButton();
          } else {
            onClose();
          }
        }}
      >
        {cancelButton}
      </Button>
    );
  }

  // pass in '' to hide button
  if (okButton) {
    buttons.push(
      <Button
        key={Math.random()}
        className="flex-1 px-8 py-3"
        disabled={disableOK}
        onClick={() => {
          if (onOKButton) {
            onOKButton();
          } else {
            onClose();
          }
        }}
      >
        {okButton}
      </Button>
    );
  }

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
          <div className="fixed inset-0 bg-dark-bg bg-opacity-40  " />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto overflow-x-clip">
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
                className={twMerge(
                  'w-full',
                  wide ? 'max-w-xl' : 'max-w-md',
                  'transform rounded-lg py-8 px-9 text-left align-middle shadow-xl transition-all',
                  panelClassName,
                  bgColor,
                  textColor
                )}
              >
                <Dialog.Title
                  as="h3"
                  className={twMerge('flex items-center tracking-tight text-xl font-bold leading-6 mb-5', textColor)}
                >
                  {title}

                  {showCloseIcon && (
                    <>
                      <Spacer />

                      <Button size="plain" variant="round" onClick={onClose}>
                        <XIcon className={iconButtonStyle} />
                      </Button>
                    </>
                  )}
                </Dialog.Title>

                {children}
                {showActionButtons && buttons.length > 0 && <div className="flex space-x-4 mt-10">{buttons}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
