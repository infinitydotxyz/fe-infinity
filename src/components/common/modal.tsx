import React, { Fragment } from 'react';
import { Dialog, Disclosure, Transition } from '@headlessui/react';

/*
  ======================================
    Even though making a modal is easy
    it's better to have a modal with some
    defaults. You don't want to spend
    a lot of time making this again and
    again. The children of this component
    could be anything (it's the trigger for modal)
    and the `content` prop should get a render prop
    component of the form: ({ open, close }) => <></>

    * `open`: tells whether modal is open.` (a boolean)
    * `close`: will close the modal (a function)
  ======================================
*/

export type IContent = {
  open?: boolean;
  close(focusableElement?: HTMLElement | React.MutableRefObject<HTMLElement | null>): void;
};

interface Props {
  children?: React.ReactNode;
  interactive?: boolean;
  content?: ({ open, close }: IContent) => React.ReactNode;
  styles?: {
    overlay?: {
      transition?: {
        className?: string;
      };
      element?: {
        className?: string;
      };
    };
    content?: {
      transition?: {
        className?: string;
      };
      element?: {
        className?: string;
      };
    };
  };
}

export function Modal({ children, interactive, content, ...props }: Props): JSX.Element {
  const styles = {
    overlay: {
      transition: {
        enter: 'transition duration-300 ease-out',
        enterFrom: 'transform opacity-0',
        enterTo: 'transform opacity-100',
        leave: 'transition duration-100 ease-out',
        leaveFrom: 'transform opacity-100',
        leaveTo: 'transform opacity-0',
        ...props?.styles?.overlay?.transition
      },
      element: {
        className:
          'z-[60] w-full h-full overflow-hidden fixed top-0 glass ring-black ring-inset ring-opacity-20 bg-black bg-opacity-20',
        ...props?.styles?.overlay?.element
      }
    },
    content: {
      transition: (close: (focusableElement?: HTMLElement | React.MutableRefObject<HTMLElement | null>) => void) => ({
        enter: 'transition duration-300 ease-out',
        enterFrom: 'transform scale-95 opacity-0',
        enterTo: 'transform scale-100 opacity-100',
        leave: 'transition duration-100 ease-out',
        leaveFrom: 'transform scale-100 opacity-100',
        leaveTo: 'transform scale-95 opacity-0',
        onClick: interactive ? null : close,
        ...props?.styles?.content?.transition
      }),
      element: {
        className: 'z-[60] w-full h-full overflow-hidden fixed top-0 grid place-items-center',
        ...props?.styles?.content?.element
      }
    }
  };

  return (
    <>
      <Disclosure>
        {({ open, close }) => (
          <>
            <Disclosure.Button {...props}>{children}</Disclosure.Button>
            <Disclosure.Panel hidden static>
              {content && (
                <Transition as={Fragment} show={open}>
                  <Dialog onClose={() => close()}>
                    <Transition.Child as={Fragment} {...styles?.overlay?.transition}>
                      <Dialog.Overlay {...styles?.overlay?.element} />
                    </Transition.Child>
                    <Transition.Child as={Fragment} {...styles?.content?.transition(close)}>
                      <div {...styles?.content?.element}>{content ? content({ open, close }) : null}</div>
                    </Transition.Child>
                  </Dialog>
                </Transition>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
