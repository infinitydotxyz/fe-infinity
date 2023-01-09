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
  const checkLabel = (
    <div className={twMerge('font-heading select-none truncate', labelClass, labelClassName)}>{label}</div>
  );

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
        // NOTE: "focus-visible:ring focus:ring-0" shows the focus ring on tab, but not click
        className="focus-visible:ring focus:ring-0 rounded h-5 w-5 cursor-pointer checked:bg-dark-bg checked:hover:bg-dark-bg checked:focus:bg-dark-bg"
      />

      {boxOnLeft && checkLabel}
    </label>
  );
};
