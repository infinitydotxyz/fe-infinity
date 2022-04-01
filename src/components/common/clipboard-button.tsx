import React, { useState } from 'react';
import Image from 'next/image';
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

  return (
    <>
      {copied ? (
        <span className="pl-4 cursor-pointer">✓</span>
      ) : (
        <button className="ml-4 pt-1cursor-pointer">
          <Image width={16} height={16} src={copy.src} alt="copy icon" onClick={copyToClipboard} />
        </button>
      )}
    </>
  );
};
