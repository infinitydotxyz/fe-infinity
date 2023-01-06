import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { RxCopy } from 'react-icons/rx';
import { TooltipWrapper } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';

interface ClipboardButtonProps {
  textToCopy: string;
  className?: string;
  ignoreTooltip?: boolean;
}

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({ textToCopy, className, ignoreTooltip }) => {
  const [copied, setCopied] = useState(false);
  const isMounted = useIsMounted();
  const [showTooltip, setShowTooltip] = useState(false);

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
        console.log('failed to copy', err.mesage);
      }
    );
  };

  return (
    <>
      {copied ? (
        <AiOutlineCheckCircle className={className} />
      ) : (
        <div>
          <RxCopy
            onClick={copyToClipboard}
            className={className}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          <TooltipWrapper
            className="w-[21rem]"
            show={!ignoreTooltip && showTooltip}
            tooltip={{
              content: textToCopy
            }}
          ></TooltipWrapper>
        </div>
      )}
    </>
  );
};
