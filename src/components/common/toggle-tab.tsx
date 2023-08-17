import { useState } from 'react';
import { borderColor, hoverColorBrandText, primaryBtnBgColorText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  defaultOption: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
  small?: boolean;
  border?: boolean;
}

export const ToggleTab = ({ options, onChange, defaultOption, className = '', small = false, border }: Props) => {
  const [selected, setSelected] = useState(defaultOption);

  return (
    <div className={`flex ${className}`}>
      <div
        className={twMerge(
          'cursor-pointer flex gap-1 rounded-lg items-center p-1',
          borderColor,
          border ? 'border-[1px]' : ''
        )}
      >
        {options.map((option: string) => {
          return (
            <div
              key={option}
              className={twMerge(
                small ? 'md:min-w-[110px]' : 'md:min-w-[140px]',
                'select-none flex text-md items-center justify-center text-center whitespace-nowrap font-medium rounded-lg',
                selected === option ? twMerge(primaryBtnBgColorText) : hoverColorBrandText,
                'py-2 md:px-6 px-3'
              )}
              onClick={() => {
                if (option !== selected) {
                  setSelected(option);
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
