import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface optionItemInterface {
  id: string;
  name: string;
}

const MultiSwitch = ({
  selectedOption,
  options,
  disabled = false,
  fullWidth = false,
  handleClick
}: {
  selectedOption?: string;
  handleClick: (option: string) => void;
  disabled?: boolean;
  options: optionItemInterface[];
  fullWidth?: boolean;
}) => {
  const switchButtonClass = 'p-2.5 border last:rounded-r-4 first:rounded-l-4';
  const inactiveButtonClass = 'bg-zinc-300 dark:bg-neutral-800 border-zinc-300 dark:border-neutral-800';
  const activeButtonClass = 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-neutral-200';

  return (
    <div
      className={twMerge(
        'rounded-4 text-base font-semibold flex text-neutral-700 dark:text-white overflow-hidden',
        fullWidth && 'w-full'
      )}
    >
      {options.map((chainItem) => (
        <button
          disabled={disabled}
          key={chainItem.id}
          onClick={() => handleClick(chainItem.id)}
          className={twMerge(
            switchButtonClass,
            selectedOption === chainItem.id ? activeButtonClass : inactiveButtonClass,
            fullWidth && 'w-full'
          )}
        >
          {chainItem.name}
        </button>
      ))}
    </div>
  );
};

export default MultiSwitch;
