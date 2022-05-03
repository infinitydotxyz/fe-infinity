import React, { useState } from 'react';

interface Props {
  selected: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
}

export const useToggleTab = (options: string[], defaultOption: string) => {
  const [selected, setSelected] = useState(defaultOption);

  const onChange = (option: string) => {
    setSelected(option);
  };

  return { onChange, selected, options };
};

export const ToggleTab = ({ options, onChange, selected, className = '' }: Props) => {
  return (
    <div className={`flex font-zagmamono ${className}`}>
      <div className="cursor-pointer flex gap-1 rounded-full items-center p-1 bg-gray-100">
        {options.map((option: string) => {
          const activeCx = selected === option ? 'bg-black text-white' : '';

          return (
            <div
              key={option}
              className={`flex min-w-[130px] text-md items-center justify-center py-2.5 px-10 text-center whitespace-no-wrap font-medium rounded-full text-secondary ${activeCx}`}
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
