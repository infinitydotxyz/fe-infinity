import { ReactElement, ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { borderColor, secondaryTextColor } from '../../utils/ui-constants';
import { EthSymbol } from './eth-price';
import { Tooltip, TooltipIcon, TooltipSpec, TooltipWrapper } from './tool-tip';

interface Props {
  label?: string;
  children: ReactNode;
  tooltip?: TooltipSpec;
  isFullWidth?: boolean;
  renderRightIcon?: () => ReactElement;
  renderLeftIcon?: () => ReactElement;
  icon?: ReactNode;
  labelClassname?: string;
  className?: string;
}

export const InputBox = ({
  tooltip,
  label,
  children,
  icon,
  renderRightIcon,
  renderLeftIcon,
  isFullWidth,
  labelClassname,
  className = ''
}: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TooltipWrapper show={showTooltip} tooltip={tooltip} className={isFullWidth ? 'w-full' : ''}>
      <div className={twMerge(borderColor, 'py-2 px-3 border rounded-lg w-full flex items-center', className)}>
        {icon && <span>{icon}</span>}
        <div className="w-full">
          {label && (
            <label
              className={twMerge(
                'block font-normal font-heading text-sm select-none',
                secondaryTextColor,
                labelClassname
              )}
            >
              {label}
            </label>
          )}
          <div className="flex items-center w-full">
            {renderLeftIcon && (
              <div className="absolute top-0 bottom-0 left-4 flex flex-col justify-center">{renderLeftIcon()}</div>
            )}

            {/* NOTE: this centered positioning of the input field using % is kind of a hack, we should look into a better approach when more than one component needs to render a left icon */}
            <div className={twMerge('flex items-center w-full', renderLeftIcon ? 'ml-[40%]' : '')}>{children}</div>

            {tooltip && (
              <Tooltip
                className="absolute top-0 bottom-0 right-4 flex flex-col justify-center"
                setShow={setShowTooltip}
              >
                <TooltipIcon />
              </Tooltip>
            )}

            {renderRightIcon && <div className="pl-2 flex flex-col justify-center">{renderRightIcon()}</div>}
          </div>
        </div>
      </div>
    </TooltipWrapper>
  );
};

// ================================================================

interface Props4 {
  label?: string;
  value: string;
  type: string;
  placeholder: string;
  addEthSymbol?: boolean;
  onChange?: (value: string) => void;
  tooltip?: TooltipSpec;
  icon?: ReactNode;
  isFullWidth?: boolean;
  autoFocus?: boolean;
  renderRightIcon?: () => ReactElement;
  renderLeftIcon?: () => ReactElement;
  className?: string;
  inputClassName?: string;
  onEnter?: () => void;
  stopEnterSpacePropagation?: boolean;
}

export const TextInputBox = ({
  tooltip,
  value,
  label,
  icon,
  addEthSymbol = false,
  type,
  placeholder,
  onChange,
  isFullWidth,
  autoFocus = false,
  renderRightIcon,
  renderLeftIcon,
  className,
  inputClassName = '',
  onEnter,
  stopEnterSpacePropagation = false
}: Props4) => {
  return (
    <InputBox
      label={label}
      tooltip={tooltip}
      icon={icon}
      isFullWidth={isFullWidth}
      renderRightIcon={renderRightIcon}
      renderLeftIcon={renderLeftIcon}
      className={className}
    >
      <div className="flex items-center w-full">
        <input
          autoFocus={autoFocus}
          type={type}
          step="any" // allows 0.0001 etc
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          className={twMerge(
            `p-0 bg-transparent border-none focus:ring-0 block w-full font-heading outline-none ring-transparent shadow-none ${inputClassName}`
          )}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnter) {
              onEnter();
            }
            if ((e.key === 'Enter' || e.key === ' ') && stopEnterSpacePropagation) {
              e.stopPropagation();
            }
          }}
        />
        {addEthSymbol && <div className="pr-2 select-none">{EthSymbol}</div>}
      </div>
    </InputBox>
  );
};

interface Props5 {
  label: string;
  value: string;
  rows?: number;
  placeholder: string;
  tooltip?: TooltipSpec;
  onChange?: (value: string) => void;
}

export const TextAreaBox = ({ value, label, placeholder, tooltip, onChange, rows = 3 }: Props5) => {
  return (
    <InputBox label={label} tooltip={tooltip}>
      <div className="flex items-center w-full">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="p-0 border-none focus:ring-0 block w-full text-base resize-none"
          placeholder={placeholder}
        />
      </div>
    </InputBox>
  );
};

// ================================================================

interface TextAreaInputBoxProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  tooltip?: TooltipSpec;
  className?: string;
  labelClassname?: string;
  rows: number;
}

export const TextAreaInputBox = ({
  tooltip,
  value,
  label,
  placeholder,
  onChange,
  rows,
  className,
  labelClassname
}: TextAreaInputBoxProps) => {
  return (
    <InputBox label={label} tooltip={tooltip} labelClassname={labelClassname} isFullWidth>
      <div className={twMerge('flex items-center w-full', className)}>
        <textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="p-0 border-none focus:ring-0 block w-full text-base font-heading resize-none"
          placeholder={placeholder}
        />
      </div>
    </InputBox>
  );
};
