import React from 'react';

interface ToggleProps {
  title: string;
}

const Toggle: React.FC<ToggleProps> = ({ title }: ToggleProps) => {
  return (
    <div className="w-full mb-12">
      <label htmlFor="toggleButton" className="flex justify-between items-center cursor-pointer">
        <div className="font-medium">{title}</div>
        <div className="relative">
          <input type="checkbox" id="toggleButton" className="sr-only" />
          <div className="block border w-14 h-8 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-black w-6 h-6 rounded-full transition"></div>
        </div>
      </label>
    </div>
  );
};

export default Toggle;
