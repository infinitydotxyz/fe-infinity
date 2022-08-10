import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Spacer } from './spacer';

export type ProgressBarProps = {
  percentage: number;
  className?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ children, className = '', percentage }) => {
  return (
    <div className={twMerge('bg-theme-light-200 overflow-clip relative rounded-3xl w-full', className)}>
      <div className="flex items-center w-full px-4 absolute top-0 bottom-0 left-0 right-0">
        <div className="">{children}</div>
        <Spacer />
        <div className="font-black">{percentage}%</div>
      </div>

      <div className="bg-[#92DEFF] w-full h-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};
