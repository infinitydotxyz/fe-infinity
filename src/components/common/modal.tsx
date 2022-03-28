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

interface Props {
  children?: React.ReactNode;
  interactive?: boolean;
  content?: any;
  props?: any;
  styles?: {
    overlay?: {
      transition?: any;
      element?: any;
    };
    content?: {
      transition?: any;
      element?: any;
    };
  };
}

export const Modal = React.forwardRef(({ children, interactive, content, ...props }: Props, ref) => {
  /*
    ======================================
      All props to every component in the
      markup are structured logically in
      this object, and then passed down
      to the elements by spreading the values.
      This makes maintenance easy.
      (Mark it up if you don't like it, imo
      this is better, will remove this comment
      and do it the usual way if this fails
      the review).
    ======================================
  */
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
          'w-full h-full overflow-hidden fixed top-0 glass ring-black ring-inset ring-opacity-20 bg-black bg-opacity-20',
        ...props?.styles?.overlay?.element
      }
    },
    content: {
      transition: (close: any) => ({
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
        className: 'w-full h-full overflow-hidden fixed top-0 grid place-items-center',
        ...props?.styles?.content?.element
      }
    }
  };

  /*
    ======================================
      Modal can be built with a combination
      of Disclosure and a Dialog. Disclosure
      provides the states that a Modal needs
      and Dialog + Transition provides the
      behavior that the model needs to exhibit.
    ======================================
  */

  return (
    <>
      <Disclosure>
        {({ open, close }) => (
          <>
            <Disclosure.Button {...props} ref={ref}>
              {children}
            </Disclosure.Button>
            <Disclosure.Panel hidden static>
              {content && (
                <Transition as={Fragment} show={open}>
                  <Dialog onClose={close}>
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
});

export default Modal;
