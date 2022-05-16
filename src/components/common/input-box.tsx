import React, { ReactElement, ReactNode, useState } from 'react';
import { DatePicker } from 'src/components/common';
import { ComboBox, ComboBoxBaseType } from './combo-box';
import { CalendarIcon } from '@heroicons/react/outline';
import { EthSymbol } from './eth-price';
import { Tooltip, TooltipIcon, TooltipSpec, TooltipWrapper } from './tool-tip';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import { inputBorderColor } from '../../utils/ui-constants';

interface Props {
  label?: string;
  children: ReactNode;
  tooltip?: TooltipSpec;
  isFullWidth?: boolean;
  renderRightIcon?: () => ReactElement;
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
  isFullWidth,
  labelClassname,
  className = ''
}: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TooltipWrapper show={showTooltip} tooltip={tooltip} className={classNames({ 'w-full': isFullWidth })}>
      <div
        className={twMerge(inputBorderColor, 'py-3 pl-6 pr-2 border rounded-3xl w-full flex items-center', className)}
      >
        {icon && <span className="pr-8">{icon}</span>}
        <div className="w-full">
          {label && (
            <label className={twMerge('block font-normal font-heading text-sm text-theme-light-800', labelClassname)}>
              {label}
            </label>
          )}
          <div className="flex items-center w-full">
            <div className="flex items-center w-full">{children}</div>

            {tooltip && (
              <Tooltip
                className="absolute top-0 bottom-0 right-4 flex flex-col justify-center"
                setShow={setShowTooltip}
              >
                <TooltipIcon />
              </Tooltip>
            )}

            {renderRightIcon && (
              <div className="absolute top-0 bottom-0 right-4 flex flex-col justify-center">{renderRightIcon()}</div>
            )}
          </div>
        </div>
      </div>
    </TooltipWrapper>
  );
};

// =======================================================

interface Props2 {
  label: string;
  value: Date;
  placeholder?: string;
  onChange: (value: Date) => void;
  tooltip?: TooltipSpec;
}

export const DatePickerBox = ({ tooltip, label, value, onChange, placeholder }: Props2) => {
  return (
    <InputBox label={label} tooltip={tooltip}>
      <div className="flex items-center">
        <div className="pr-2">
          <CalendarIcon className="h-4 w-4" />
        </div>
        <DatePicker value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    </InputBox>
  );
};

// ================================================================

interface Props3<T extends ComboBoxBaseType> {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  tooltip?: TooltipSpec;
}

export const ComboInputBox = <T extends ComboBoxBaseType>({ tooltip, label, options, onChange, value }: Props3<T>) => {
  return (
    <InputBox label={label} tooltip={tooltip}>
      <ComboBox options={options} value={value} onChange={onChange} />
    </InputBox>
  );
};

// ================================================================

interface Props4 {
  label: string;
  value?: string;
  type: string;
  placeholder: string;
  addEthSymbol?: boolean;
  onChange?: (value: string) => void;
  tooltip?: TooltipSpec;
  icon?: ReactNode;
  isFullWidth?: boolean;
  autoFocus?: boolean;
  renderRightIcon?: () => ReactElement;
  className?: string;
}

export const TextInputBox = ({
  tooltip,
  value = '',
  label,
  icon,
  addEthSymbol = false,
  type,
  placeholder,
  onChange,
  isFullWidth,
  autoFocus = false,
  renderRightIcon,
  className
}: Props4) => {
  return (
    <InputBox
      label={label}
      tooltip={tooltip}
      icon={icon}
      isFullWidth={isFullWidth}
      renderRightIcon={renderRightIcon}
      className={className}
    >
      <div className="flex items-center w-full">
        {addEthSymbol && <div className="pr-2">{EthSymbol}</div>}
        <input
          autoFocus={autoFocus}
          type={type}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          className="p-0 border-none focus:ring-0 font-bold block w-full font-heading"
          placeholder={placeholder}
        />
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
          className="p-0 border-none focus:ring-0 block w-full text-base"
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
          className="p-0 border-none focus:ring-0 block w-full text-base font-heading"
          placeholder={placeholder}
        />
      </div>
    </InputBox>
  );
};
