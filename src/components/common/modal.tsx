import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from 'next-themes';
import { Fragment, ReactNode } from 'react';
import { MdClose } from 'react-icons/md';
import { Button, Spacer } from 'src/components/common';
import { bgColor, iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  titleClassName?: string;

  showCloseIcon?: boolean;

  children?: ReactNode;
  modalButton?: ReactNode;
  // you can repurpose the ok/cancel buttons
  // pass in '' to hide button
  okButton?: string;
  cancelButton?: string;

  disableOK?: boolean;
  disableCancel?: boolean;
  modalStyle?: string;
  showButton?: boolean;

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
  showButton = false,
  disableOK = false,
  showCloseIcon = false,
  modalButton,
  disableCancel = false,
  title,
  modalStyle = '',
  onClose, // X icon, or click outside dialog
  showActionButtons = true,
  wide = true,
  titleClassName,
  panelClassName
}: Props) => {
  const { theme } = useTheme();
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
      <Dialog as="div" className={twMerge('relative z-50')} onClose={onClose}>
        {showButton && modalButton}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={twMerge('fixed inset-0', theme === 'dark' ? 'bg-light-bg' : 'bg-dark-bg', 'bg-opacity-30')} />
        </Transition.Child>

        <div className={twMerge('fixed inset-0 overflow-y-auto overflow-x-clip')}>
          <div className={twMerge('flex min-h-full items-center justify-center p-4 text-center', modalStyle)}>
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
                  'transform rounded-lg md:py-8 md:px-9 p-4 text-left align-middle shadow-xl transition-all text-sm',
                  panelClassName,
                  bgColor
                )}
              >
                <Dialog.Title
                  as="h3"
                  className={twMerge(
                    'flex items-center tracking-tight text-lg font-bold leading-6 mb-5',
                    titleClassName
                  )}
                >
                  {title}

                  {showCloseIcon && (
                    <>
                      <Spacer />

                      <Button size="plain" variant="round" onClick={onClose}>
                        <MdClose className={iconButtonStyle} />
                      </Button>
                    </>
                  )}
                </Dialog.Title>

                {children}
                {showActionButtons && buttons.length > 0 && <div className="flex space-x-4 mt-6">{buttons}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
