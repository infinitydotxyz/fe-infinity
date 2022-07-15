import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  selected: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
  small?: boolean;
  altStyle?: boolean;
}

export const useToggleTab = (options: string[], selectedOption: string) => {
  const [selected, setSelected] = useState(selectedOption);
  const router = useRouter();

  useEffect(() => {
    setSelected(selectedOption);
  }, [selectedOption]);

  const onChange = (option: string) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: option }
      },
      undefined,
      { shallow: true }
    );
    setSelected(option);
  };

  return { onChange, selected, options };
};

export const ToggleTab = ({ options, onChange, selected, className = '', small = false, altStyle = false }: Props) => {
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
                small ? 'min-w-[120px]' : 'min-w-[140px]',
                'select-none flex text-md items-center justify-center  text-center whitespace-nowrap font-medium rounded-full text-secondary',
                selected === option ? 'bg-black text-white font-bold' : '',
                altStyle ? 'py-1 px-6' : 'py-2.5 px-10'
              )}
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
