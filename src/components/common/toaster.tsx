import { ReactNode } from 'react';
import { toast as reactToast, TypeOptions } from 'react-toastify';
import { ellipsisString, getCustomExceptionMsg } from 'src/utils';
import { toastBoxShadowDarkPrimary, toastBoxShadowPrimary } from 'src/utils/ui-constants';
import tailwindConfig from '../../settings/tailwind/elements/foundations';

export const toastInfo = (message: ReactNode, darkMode: boolean) => {
  _showToast(message, 'info', darkMode);
};

// Toast a success message
export const toastSuccess = (message: ReactNode, darkMode: boolean) => {
  _showToast(message, 'success', darkMode);
};

// Toast an error message
export const toastError = (message: ReactNode, darkMode: boolean) => {
  const customMsg = getCustomExceptionMsg(message);
  if (!customMsg) {
    return;
  }
  _showToast(customMsg, 'error', darkMode);
};

// Toast a warning message
export const toastWarning = (message: ReactNode, darkMode: boolean) => {
  _showToast(message, 'warning', darkMode);
};

const _showToast = (message: ReactNode, type: TypeOptions | undefined, darkMode: boolean) => {
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const bgColor = themeToUse.bg;
  const textColor = themeToUse.body;
  const boxShadow = darkMode ? toastBoxShadowDarkPrimary : toastBoxShadowPrimary;
  const borderColor = darkMode ? '#fff' : '#000';
  const border = `1px solid ${borderColor}`;

  let msg = message;

  // some toasts show a failed transaction which can be long
  if (msg && typeof msg === 'string') {
    if (msg.length > 200) {
      msg = ellipsisString(msg, 200, 0);
    }
  }

  reactToast(msg, {
    type: type,
    hideProgressBar: true,
    closeButton: false,
    style: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '400px',
      padding: '15px',
      wordBreak: 'break-word',
      backgroundColor: bgColor,
      color: textColor,
      borderRadius: 0,
      border,
      boxShadow,
      fontFamily: 'inherit'
    }
  });
};
