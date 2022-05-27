import React, { useState } from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

interface ClipboardButtonProps {
  textToCopy: string;
  className?: string;
}

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({ textToCopy, className }) => {
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
        <button className={twMerge(`ml-4 pt-1cursor-pointer ${className ?? ''}`)}>
          <MdOutlineContentCopy width={16} height={16} onClick={copyToClipboard} />
        </button>
      )}
    </>
  );
};
