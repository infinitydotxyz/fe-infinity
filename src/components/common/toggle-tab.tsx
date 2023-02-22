import { useState } from 'react';
import { borderColor, hoverColorBrandText, primaryBtnBgColorText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  defaultOption: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
  small?: boolean;
}

export const ToggleTab = ({ options, onChange, defaultOption, className = '', small = false }: Props) => {
  const [selected, setSelected] = useState(defaultOption);

  return (
    <div className={`flex ${className}`}>
      <div className={twMerge('cursor-pointer flex gap-1 rounded-lg items-center p-1 border-[1px]', borderColor)}>
        {options.map((option: string) => {
          return (
            <div
              key={option}
              className={twMerge(
                small ? 'min-w-[110px]' : 'min-w-[140px]',
                'select-none flex text-md items-center justify-center text-center whitespace-nowrap font-medium rounded-lg',
                selected === option ? twMerge(primaryBtnBgColorText) : hoverColorBrandText,
                'py-2 px-6'
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
