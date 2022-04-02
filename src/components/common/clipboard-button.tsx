import React, { useState } from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';

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

  return (
    <>
      {copied ? (
        <span className="pl-4 cursor-pointer">✓</span>
      ) : (
        <button className="ml-4 pt-1cursor-pointer">
          <MdOutlineContentCopy width={16} height={16} onClick={copyToClipboard} />
        </button>
      )}
    </>
  );
};
