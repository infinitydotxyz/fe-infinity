import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { RxCopy } from 'react-icons/rx';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { twMerge } from 'tailwind-merge';

interface ClipboardButtonProps {
  textToCopy: string;
  className?: string;
}

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({ textToCopy, className }) => {
  const [copied, setCopied] = useState(false);
  const isMounted = useIsMounted();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);
        // changing back to default state after a bit
        setTimeout(() => {
          if (isMounted()) {
            setCopied(false);
          }
        }, 1500);
      },
      (err) => {
        console.error('failed to copy', err.mesage);
      }
    );
  };

  return (
    <>
      {copied ? (
        <AiOutlineCheckCircle className={className} />
      ) : (
        <div>
          <RxCopy onClick={copyToClipboard} className={twMerge(className, 'cursor-pointer')} />
        </div>
      )}
    </>
  );
};
