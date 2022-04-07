import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  setShow: (show: boolean) => void;
  className?: string;
}

export const Tooltip = ({ setShow, children, className = '' }: Props) => {
  const handleMouseOver = () => {
    setShow(true);
  };

  const handleMouseOut = () => {
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
  tooltip: string;
}

const HoverText = ({ tooltip }: Props3) => {
  return (
    <div className="absolute z-50 top-full  right-0 left-0 pointer-events-none p-6 bg-white shadow-lg rounded-2xl">
      {tooltip}
    </div>
  );
};

// ================================================

interface Props4 {
  show: boolean;
  tooltip?: string;
  children: ReactNode;
}

export const TooltipWrapper = ({ children, show, tooltip }: Props4) => {
  return (
    <div className="relative">
      {children}

      {tooltip && show && <HoverText tooltip={tooltip} />}
    </div>
  );
};
