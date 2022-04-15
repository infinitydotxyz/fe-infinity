import React, { useState } from 'react';

interface ToggleTab {
  selected: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
}

export function useToggleTab(options: string[], defaultOption: string) {
  const [selected, setSelected] = useState(defaultOption);

  const onChange = (option: string) => {
    setSelected(option);
  };

  return { onChange, selected, options };
}

export function ToggleTab({ options, onChange, selected, className = '' }: ToggleTab) {
  return (
    <div className={`flex ${className}`}>
      <div className="cursor-pointer flex gap-1 rounded-full items-center p-1 bg-gray-100">
        {options.map((option: string) => {
          return (
            <div
              key={option}
              className={`flex items-center justify-center py-2 px-8 text-center text-xs whitespace-no-wrap rounded-full ${
                selected === option ? 'bg-black text-white' : ''
              }`}
              onClick={() => onChange(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
}
