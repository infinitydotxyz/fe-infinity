import React, { ReactNode } from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { smallIconButtonStyle } from '../market/order-drawer/ui-constants';

export interface TooltipSpec {
  title: string;
  content: string;
}

export const TooltipIcon = () => {
  return <IoMdInformationCircleOutline className={`fill-gray-500 ${smallIconButtonStyle}`} />;
};

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
  tooltip: TooltipSpec;
}

const TooltipContent = ({ tooltip }: Props3) => {
  return (
    <div className="absolute z-50 top-full  right-0 left-0 pointer-events-none px-6 py-4 bg-white shadow-lg rounded-2xl">
      <div className="font-bold text-sm mb-1">{tooltip.title}</div>
      <div className="text-xs">{tooltip.content}</div>
    </div>
  );
};

// ================================================

interface Props4 {
  show: boolean;
  tooltip?: TooltipSpec;
  children: ReactNode;
}

export const TooltipWrapper = ({ children, show, tooltip }: Props4) => {
  return (
    <div className="relative">
      {children}

      {tooltip && show && <TooltipContent tooltip={tooltip} />}
    </div>
  );
};
