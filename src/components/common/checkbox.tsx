import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spacer } from './spacer';

interface Props {
  label: string | ReactNode;
  checked: boolean;
  boxOnLeft?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Checkbox = ({ label, boxOnLeft = true, checked, onChange, disabled = false, className = '' }: Props) => {
  const labelClass = boxOnLeft ? 'ml-2' : '';
  const checkLabel = <label className={twMerge('text-theme-light-800 font-heading', labelClass)}>{label}</label>;

  return (
    <div className={twMerge('flex items-center', className)}>
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
        className="focus-visible:ring focus:ring-0 rounded h-5 w-5"
      />

      {boxOnLeft && checkLabel}
    </div>
  );
};
