import { ReactNode } from 'react';
import toast, { Toast, Toaster as RHTRoaster } from 'react-hot-toast';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdErrorOutline, MdWarningAmber } from 'react-icons/md';

export function Toaster() {
  return <RHTRoaster />;
}

// styles: https://tailwindui.com/components/application-ui/overlays/notifications
const ToasterTemplate = ({
  t,
  icon,
  message,
  content
}: {
  t: Toast;
  icon: ReactNode;
  message: ReactNode;
  content?: ReactNode;
}) => (
  <div className="w-1/3">
    <div aria-live="assertive" className="inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-2 sm:items-start">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">{icon}</div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{message}</p>
                {content && <p className="mt-1 text-sm text-gray-500">{content}</p>}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => {
                    toast.remove(t.id);
                  }}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Toast a success message - first, include <Toaster /> in JSX.
export function toastSuccess(message: ReactNode, content?: ReactNode) {
  toast.custom((t) => (
    <ToasterTemplate
      t={t}
      icon={<IoMdCheckmarkCircleOutline className="text-green-400 text-lg" />}
      message={message}
      content={content}
    />
  ));
}

// Toast an error message - first, include <Toaster /> in JSX.
export function toastError(message: ReactNode, content?: ReactNode) {
  toast.custom((t) => (
    <ToasterTemplate
      t={t}
      icon={<MdErrorOutline className="text-red-400 text-lg" />}
      message={message}
      content={content}
    />
  ));
}

// Toast a warning message - first, include <Toaster /> in JSX.
export function toastWarning(message: ReactNode, content?: ReactNode) {
  toast.custom((t) => (
    <ToasterTemplate
      t={t}
      icon={<MdWarningAmber className="text-orange-400 text-lg" />}
      message={message}
      content={content}
    />
  ));
}
