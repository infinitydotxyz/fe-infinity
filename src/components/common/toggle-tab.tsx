import React, { useState } from 'react';

interface ToggleTab {
  selected: string;
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

export function ToggleTab({ options, onChange, selected }: ToggleTab) {
  return (
    <div className="flex">
      <div className="cursor-pointer flex m-2 gap-1 rounded-full">
        {options.map((option: string) => {
          return (
            <div
              key={option}
              className={`flex items-center justify-center py-2 px-6 text-center text-sm whitespace-no-wrap rounded-full ${
                selected === option ? 'bg-black text-white' : ''
              }`}
              onClick={() => onChange(option)}
            >
              {option}
            </div>
          );
        })}
      </div>{' '}
    </div>
  );
}
