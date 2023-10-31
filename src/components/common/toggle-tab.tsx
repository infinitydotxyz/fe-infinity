import { useState } from 'react';
import { golderBorderColor, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  defaultOption: string;
  className?: string;
  options: string[];
  onChange: (option: string) => void;
  small?: boolean;
  border?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ToggleTab = ({ options, onChange, defaultOption, className = '', small = false, border }: Props) => {
  const [selected, setSelected] = useState(defaultOption);

  return (
    <div
      className={twMerge(
        'flex space-x-7.5 text-base overflow-auto scrollbar-hide border-b border-light-borderUnderline dark:border-dark-borderUnderline px-5',
        className
      )}
    >
      {options.map((e) => {
        return (
          <div key={e} className={twMerge('py-2.5', selected === e ? `border-b-3 ${golderBorderColor}` : '')}>
            <div
              className={twMerge(
                selected === e ? 'text-amber-900' : secondaryTextColor,
                'hover:text-yellow-700 dark:hover:text-yellow-700',
                'font-semibold font-body cursor-pointer'
              )}
              onClick={() => {
                setSelected(e);
                onChange(e);
              }}
            >
              {e}
            </div>
          </div>
        );
      })}
    </div>
    // <div className={`flex ${className}`}>
    //   <div
    //     className={twMerge(
    //       'cursor-pointer flex gap-1 rounded-lg items-center p-1',
    //       borderColor,
    //       border ? 'border-[1px]' : ''
    //     )}
    //   >
    //     {options.map((option: string) => {
    //       return (
    //         <div
    //           key={option}
    //           className={twMerge(
    //             small ? 'md:min-w-[110px]' : 'md:min-w-[140px]',
    //             'select-none flex text-md items-center justify-center text-center whitespace-nowrap font-medium rounded-lg',
    //             selected === option ? twMerge(primaryBtnBgColorText) : hoverColorBrandText,
    //             'py-2 md:px-6 px-3'
    //           )}
    //           onClick={() => {
    //             if (option !== selected) {
    //               setSelected(option);
    //               onChange(option);
    //             }
    //           }}
    //         >
    //           {option}
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
  );
};
