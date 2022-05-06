import React from 'react';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from '../../utils/ui-constants';

interface Props {
  title: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export const Switch = ({ title, checked, className = '', onChange }: Props) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor="toggleButton" className="flex justify-between items-center cursor-pointer">
        <div className="font-medium">{title}</div>
        <div className="relative">
          <input type="checkbox" id="toggleButton" className="sr-only" checked={checked} onChange={onChange} />
          {checked ? (
            <>
              <div className={twMerge(inputBorderColor, 'block border w-14 h-8 rounded-full bg-black')}></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
            </>
          ) : (
            <>
              <div className={twMerge(inputBorderColor, 'block border w-14 h-8 rounded-full')}></div>
              <div className="dot absolute left-1 top-1 bg-black w-6 h-6 rounded-full transition"></div>
            </>
          )}
        </div>
      </label>
    </div>
  );
};
