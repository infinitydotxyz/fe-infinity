import { ReactNode } from 'react';
import { toast as reactToast } from 'react-toastify';

export const toastInfo = (message: ReactNode) => {
  reactToast(message, { type: 'info' });
};

// Toast a success message
export const toastSuccess = (message: ReactNode) => {
  reactToast(message, { type: 'success' });
};

// Toast an error message
export const toastError = (message: ReactNode, onClick?: (message: ReactNode) => void) => {
  try {
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

// Toast a warning message
export const toastWarning = (message: ReactNode) => {
  reactToast(message, { type: 'warning' });
};
