import React, { useState } from 'react';
import copy from 'src/images/copy.svg';

interface ClipboardButtonProps {
  textToCopy: string;
}

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);
        // changing back to default state after 2 seconds.
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.log('failed to copy', err.mesage);
      }
    );
  };

  const btnStyle = copied ? 'bg-gray-500 text-white' : '';

  return (
    <>
      {copied ? (
        <span className="pl-4 cursor-pointer">✓</span>
      ) : (
        <img className="ml-4 cursor-pointer" src={copy.src} alt="copy icon" onClick={copyToClipboard} />
      )}
    </>
  );
};
