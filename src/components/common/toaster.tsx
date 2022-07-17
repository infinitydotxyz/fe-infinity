import { ReactNode } from 'react';
// import toast, { Toast, Toaster as RHTRoaster } from 'react-hot-toast';
// import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
// import { MdErrorOutline, MdWarningAmber } from 'react-icons/md';
// import { XIcon } from '@heroicons/react/outline';
// import { Button } from './button';
import { toast as reactToast } from 'react-toastify';

// export const Toaster = () => {
//   return <RHTRoaster />;
// };

// styles: https://tailwindui.com/components/application-ui/overlays/notifications
// const ToasterTemplate = ({
//   t,
//   icon,
//   message,
//   content
// }: {
//   t: Toast;
//   icon: ReactNode;
//   message: ReactNode;
//   content?: ReactNode;
// }) => (
//   <div className="w-1/3" onClick={() => toast.remove(t.id)}>
//     <div aria-live="assertive" className="inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-2 sm:items-start">
//       <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
//         <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
//           <div className="p-4">
//             <div className="flex items-start">
//               <div className="flex-shrink-0 mt-1">{icon}</div>
//               <div className="ml-3 w-0 flex-1 pt-0.5">
//                 <p className="text-sm font-medium text-gray-900">{message}</p>
//                 {content && <p className="mt-1 text-sm text-gray-500">{content}</p>}
//               </div>
//               <div className="ml-4 flex-shrink-0 flex">
//                 <Button
//                   variant="round"
//                   size="plain"
//                   onClick={() => {
//                     toast.remove(t.id);
//                   }}
//                 >
//                   <XIcon className="h-5 w-5" aria-hidden="true" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

export const toastInfo = (message: ReactNode) => {
  reactToast(message, { type: 'info' });
};

// Toast a success message - first, include <Toaster /> in JSX.
export const toastSuccess = (message: ReactNode) => {
  // toast.custom((t) => (
  //   <ToasterTemplate
  //     t={t}
  //     icon={<IoMdCheckmarkCircleOutline className="text-green-400 text-lg" />}
  //     message={message}
  //     content={content}
  //   />
  // ));
  reactToast(message, { type: 'success' });
};

// Toast an error message - first, include <Toaster /> in JSX.
export const toastError = (message: ReactNode, onClick?: (message: ReactNode) => void) => {
  try {
    // toast.custom((t) => (
    //   <ToasterTemplate
    //     t={t}
    //     icon={<MdErrorOutline className="text-red-400 text-lg" />}
    //     message={message}
    //     content={content}
    //   />
    // ));

    if (onClick) {
      reactToast(message, {
        type: 'error',
        onClick: () => onClick(message)
      });
    } else {
      reactToast(message, {
        type: 'error'
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Toast a warning message - first, include <Toaster /> in JSX.
export const toastWarning = (message: ReactNode) => {
  // toast.custom((t) => (
  //   <ToasterTemplate
  //     t={t}
  //     icon={<MdWarningAmber className="text-orange-400 text-lg" />}
  //     message={message}
  //     content={content}
  //   />
  // ));
  reactToast(message, { type: 'warning' });
};
