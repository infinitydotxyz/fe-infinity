import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  selected: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
  equalWidths?: boolean;
  altStyle?: boolean;
}

export const useToggleTab = (options: string[], defaultOption: string) => {
  const [selected, setSelected] = useState(defaultOption);

  const onChange = (option: string) => {
    setSelected(option);
  };

  return { onChange, selected, options };
};

export const ToggleTab = ({
  options,
  onChange,
  selected,
  className = '',
  equalWidths = true,
  altStyle = false
}: Props) => {
  return (
    <div className={`flex ${className}`}>
      <div
        className={twMerge(
          'cursor-pointer flex gap-1 rounded-full items-center p-1',
          altStyle ? 'bg-white' : 'bg-gray-100'
        )}
      >
        {options.map((option: string) => {
          return (
            <div
              key={option}
              className={twMerge(
                equalWidths ? 'min-w-[130px]' : '',
                'flex text-md items-center justify-center  text-center whitespace-nowrap font-medium rounded-full text-secondary',
                selected === option ? 'bg-black text-white font-bold' : '',
                altStyle ? 'py-1 px-6' : 'py-2.5 px-10'
              )}
              onClick={() => onChange(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};
