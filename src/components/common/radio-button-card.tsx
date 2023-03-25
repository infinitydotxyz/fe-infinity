import { RadioGroup } from '@headlessui/react';
import { borderColor, brandBorderColor, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

/**
 * Radio button component that's rendered on screen like a small card.
 * To be used within `RadioGroup`.
 */
export const RadioButtonCard: React.FC<{ value: string | number; label: string; description?: string }> = ({
  value,
  label,
  description
}) => {
  return (
    <div className="cursor-pointer">
      <RadioGroup.Option
        value={value}
        className={({ checked }) => `
            ${checked ? `${brandBorderColor}` : `${borderColor}`}
            relative flex flex-row justify-between items-center border rounded-md p-4
          `}
      >
        {({ checked }) => (
          <>
            <div className="flex flex-col">
              <RadioGroup.Label as="span" className={twMerge('block text-sm font-medium')}>
                {label}
              </RadioGroup.Label>

              {description ? (
                <RadioGroup.Description as="span" className={twMerge(secondaryTextColor, 'block text-sm')}>
                  {description}
                </RadioGroup.Description>
              ) : null}
            </div>
            <input type="radio" checked={checked} readOnly />
          </>
        )}
      </RadioGroup.Option>
    </div>
  );
};
