import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { historyPushState } from 'src/utils';

interface Props {
  selected: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
  tabWidth?: string;
  altStyle?: boolean;
}

export const useToggleTab = (options: string[], selectedOption: string) => {
  const [selected, setSelected] = useState(selectedOption);
  const router = useRouter();

  useEffect(() => {
    setSelected(selectedOption);
  }, [selectedOption]);

  const onChange = (option: string) => {
    historyPushState(router.pathname, { ...router.query, tab: option });
    setSelected(option);
  };

  return { onChange, selected, options };
};

export const ToggleTab = ({ options, onChange, selected, className = '', tabWidth = '', altStyle = false }: Props) => {
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
                tabWidth ? '' : 'min-w-[130px]',
                'select-none flex text-md items-center justify-center  text-center whitespace-nowrap font-medium rounded-full text-secondary',
                selected === option ? 'bg-black text-white font-bold' : '',
                altStyle ? 'py-1 px-6' : 'py-2.5 px-10'
              )}
              style={{ minWidth: tabWidth ?? 'auto' }}
              onClick={() => {
                if (option !== selected) {
                  onChange(option);
                }
              }}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};
