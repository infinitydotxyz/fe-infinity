import React, { ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TooltipSpec } from './tool-tip';

interface Props5 {
  tooltip: TooltipSpec;
  children: ReactNode;
  className?: string;
}

export const SimpleTooltip = ({ children, tooltip, className = '' }: Props5) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <SimpleTooltipWrapper show={showTooltip} tooltip={tooltip} className={className}>
      <SimpleTooltipMouseOver className="" setShow={setShowTooltip}>
        {children}
      </SimpleTooltipMouseOver>
    </SimpleTooltipWrapper>
  );
};

// ================================================

interface Props {
  children: ReactNode;
  setShow: (show: boolean) => void;
  className?: string;
}

const SimpleTooltipMouseOver = ({ setShow, children, className = '' }: Props) => {
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

const SimpleTooltipContent = ({ tooltip }: Props3) => {
  return (
    <div className="absolute z-50 flex flex-col text-left text-black left-0 pointer-events-none px-4 py-4 bg-white shadow-ttip rounded-2xl">
      <div className="font-bold text-md mb-1">{tooltip.title}</div>
      <div className="text-sm">{tooltip.content}</div>
    </div>
  );
};

// ================================================

interface Props4 {
  show: boolean;
  tooltip: TooltipSpec;
  children: ReactNode;
  className?: string;
}

export const SimpleTooltipWrapper = ({ children, show, tooltip, className = '' }: Props4) => {
  return (
    <div className={twMerge('relative', className)}>
      {children}
      {tooltip && show && <SimpleTooltipContent tooltip={tooltip} />}
    </div>
  );
};
