import { ReactNode } from 'react';
import { toast as reactToast, TypeOptions } from 'react-toastify';
import { ellipsisString, getCustomExceptionMsg } from 'src/utils';

export const toastInfo = (message: ReactNode) => {
  _showToast(message, 'info');
};

// Toast a success message
export const toastSuccess = (message: ReactNode) => {
  _showToast(message, 'success');
};

// Toast an error message
export const toastError = (message: ReactNode, onClick?: (message: ReactNode) => void) => {
  const customMsg = getCustomExceptionMsg(message);
  try {
    if (onClick) {
      reactToast(customMsg, {
        type: 'error',
        onClick: () => onClick(customMsg)
      });
    } else {
      _showToast(customMsg, 'error');
    }
  } catch (err) {
    console.error(err);
  }
};

// Toast a warning message
export const toastWarning = (message: ReactNode) => {
  _showToast(message, 'warning');
};

const _showToast = (message: ReactNode, type: TypeOptions | undefined) => {
  let msg = message;

  // some toasts show a failed transaction which can be long
  if (msg && typeof msg === 'string') {
    if (msg.length > 200) {
      msg = ellipsisString(msg, 200, 0);
    }
  }

  reactToast(msg, { type: type });
};
