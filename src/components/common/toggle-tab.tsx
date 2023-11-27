import { useEffect, useState } from 'react';
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
  useEffect(() => {
    setSelected(defaultOption);
  }, [defaultOption]);
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
  );
};
