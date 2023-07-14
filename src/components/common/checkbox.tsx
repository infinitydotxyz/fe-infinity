import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spacer } from './spacer';

interface Props {
  label?: string | ReactNode;
  checked: boolean;
  boxOnLeft?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export const Checkbox = ({
  label,
  boxOnLeft = true,
  checked,
  onChange,
  disabled = false,
  className = '',
  labelClassName = ''
}: Props) => {
  const labelClass = boxOnLeft ? 'ml-3' : 'mr-3';
  const checkLabel = <div className={twMerge('select-none truncate', labelClass, labelClassName)}>{label}</div>;

  return (
    <label className={twMerge('flex items-center overflow-hidden', className)}>
      {!boxOnLeft && (
        <>
          {checkLabel}
          <Spacer />
        </>
      )}

      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded h-5 w-5 cursor-pointer checked:bg-brand-primary dark:checked:bg-brand-darkPrimaryFade
       hover:bg-brand-primary dark:hover:bg-brand-darkPrimaryFade
         focus:shadow-none dark:focus:shadow-none hover:shadow-none dark:hover:shadow-none
         focus:outline-none dark:focus:outline-none hover:outline-none dark:hover:outline-none
         focus:ring-0 dark:focus:ring-0 hover:ring-0 dark:hover:ring-0
         focus:ring-offset-0 dark:ring-offset-0"
      />

      {boxOnLeft && checkLabel}
    </label>
  );
};
