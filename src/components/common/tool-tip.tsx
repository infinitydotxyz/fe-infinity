import { ReactNode } from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { cardColor, secondaryBgColor, smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export interface TooltipSpec {
  title?: string;
  content?: string;
}

export const TooltipIcon = () => {
  return <IoMdInformationCircleOutline className={`${secondaryBgColor} ${smallIconButtonStyle}`} />;
};

interface Props {
  children: ReactNode;
  setShow: (show: boolean) => void;
  className?: string;
}

export const Tooltip = ({ setShow, children, className = '' }: Props) => {
  let timeout: NodeJS.Timeout | undefined;

  const cancelTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  const handleMouseOver = () => {
    cancelTimeout();

    timeout = setTimeout(() => {
      setShow(true);
    }, 500);
  };

  const handleMouseOut = () => {
    cancelTimeout();
    setShow(false);
  };

  return (
    <div className={className}>
      <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div>{children}</div>
      </div>
    </div>
  );
};

// ================================================

interface Props3 {
  tooltip: TooltipSpec;
}

const TooltipContent = ({ tooltip }: Props3) => {
  return (
    <div
      className={twMerge(
        'absolute z-50 top-full mt-2 right-0 left-0 pointer-events-none p-3 shadow-ttip rounded-xl',
        cardColor
      )}
    >
      {tooltip.title && <div className="font-bold text-md mb-1">{tooltip.title}</div>}
      {tooltip.content && <div className="text-sm">{tooltip.content}</div>}
    </div>
  );
};

// ================================================

interface Props4 {
  show: boolean;
  tooltip?: TooltipSpec;
  children?: ReactNode;
  className?: string;
}

export const TooltipWrapper = ({ children, show, tooltip, className }: Props4) => {
  return (
    <div className={twMerge('relative', className)}>
      {children}
      {tooltip && show && <TooltipContent tooltip={tooltip} />}
    </div>
  );
};
