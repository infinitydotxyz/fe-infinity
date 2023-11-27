import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spacer } from './spacer';
import { checkboxBgColor } from 'src/utils/ui-constants';
import { TickMarkIcon } from 'src/icons';

interface Props {
  label?: string | ReactNode;
  checked: boolean;
  boxOnLeft?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  tickMarkClassName?: string;
  inputClassName?: string;
}

export const Checkbox = ({
  label,
  boxOnLeft = true,
  checked,
  onChange,
  disabled = false,
  className = '',
  labelClassName = '',
  tickMarkClassName = '',
  inputClassName = ''
}: Props) => {
  const labelClass = boxOnLeft ? 'ml-1.5' : 'mr-1.5';
  const checkLabel = <div className={twMerge('select-none truncate', labelClass, labelClassName)}>{label}</div>;

  return (
    <label className={twMerge('flex items-center overflow-hidden', className)}>
      {!boxOnLeft && (
        <>
          {checkLabel}
          <Spacer />
        </>
      )}
      <div className="relative overflow-hidden flex rounded-3 gap-2">
        <input
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
          className={twMerge(
            `bg-white dark:bg-neutral-700 peer relative appearance-none shrink-0 !bg-none h-6 w-6 cursor-pointer rounded  ${
              disabled
                ? 'bg-gray-500'
                : ' focus:shadow-none dark:focus:shadow-none hover:shadow-none dark:hover:shadow-none focus:outline-none dark:focus:outline-none hover:outline-none dark:hover:outline-none focus:ring-0 dark:focus:ring-0 hover:ring-0 dark:hover:ring-0 focus:ring-offset-0 dark:ring-offset-0 hover:bg-transparent'
            }`,
            checkboxBgColor,
            inputClassName
          )}
          type="checkbox"
        />
        <TickMarkIcon
          className={twMerge(
            `rounded-3 bg-white dark:bg-neutral-700 absolute -z-1
            w-6 h-6 pointer-events-none
            hidden peer-checked:block peer-checked:text-yellow-700 dark:peer-checked:text-white`,
            checkboxBgColor,
            tickMarkClassName
          )}
        />
      </div>
      {boxOnLeft && checkLabel}
    </label>
  );
};
