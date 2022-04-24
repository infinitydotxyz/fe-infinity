import React, { ReactElement, ReactNode, useState } from 'react';
import { DatePicker } from 'src/components/common';
import { ComboBox, ComboBoxBaseType } from './combo-box';
import { CalendarIcon } from '@heroicons/react/outline';
import { EthSymbol } from './eth-price';
import { Tooltip, TooltipIcon, TooltipSpec, TooltipWrapper } from './tool-tip';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

interface Props {
  label?: string;
  children: ReactNode;
  tooltip?: TooltipSpec;
  isFullWidth?: boolean;
  renderRightIcon?: () => ReactElement;
}

export function InputBox({ tooltip, label, children, isFullWidth, renderRightIcon }: Props): JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TooltipWrapper show={showTooltip} tooltip={tooltip} className={classNames({ 'w-full': isFullWidth })}>
      <div className="py-2 pl-6 pr-2 mb-1 outline outline-1 outline-slate-300 rounded-2xl ">
        {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
        <div className={classNames('mt-1 flex items-center', { 'w-full': isFullWidth })}>
          <div className={classNames('flex items-center', { 'w-full': isFullWidth })}>{children}</div>

          {tooltip && (
            <Tooltip className="absolute top-0 bottom-0 right-2 flex flex-col justify-center" setShow={setShowTooltip}>
              <TooltipIcon />
            </Tooltip>
          )}
          {renderRightIcon && (
            <div className="absolute top-0 bottom-0 right-2 flex flex-col justify-center">{renderRightIcon()}</div>
          )}
        </div>
      </div>
    </TooltipWrapper>
  );
}

// =======================================================

interface Props2 {
  label: string;
  value: Date;
  placeholder?: string;
  onChange: (value: Date) => void;
  tooltip?: TooltipSpec;
}

export function DatePickerBox({ tooltip, label, value, onChange, placeholder }: Props2): JSX.Element {
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
}

// ================================================================

interface Props3<T extends ComboBoxBaseType> {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  tooltip?: TooltipSpec;
}

export function ComboInputBox<T extends ComboBoxBaseType>({
  tooltip,
  label,
  options,
  onChange,
  value
}: Props3<T>): JSX.Element {
  return (
    <InputBox label={label} tooltip={tooltip}>
      <ComboBox options={options} value={value} onChange={onChange} />
    </InputBox>
  );
}

// ================================================================

interface Props4 {
  value: string;
  type: string;
  placeholder: string;
  addEthSymbol?: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export function TextInputBox({
  tooltip,
  value,
  label,
  addEthSymbol = false,
  type,
  placeholder,
  onChange,
  className,
  ...props
}: Props4 & Omit<Props, 'children'>): JSX.Element {
  return (
    <InputBox label={label} tooltip={tooltip} {...props}>
      <div className={twMerge('flex items-center', className, props.isFullWidth ? 'w-full' : '')}>
        {addEthSymbol && <div className="pr-2">{EthSymbol}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-0 border-none focus:ring-0 block w-full text-base"
          placeholder={placeholder}
        />
      </div>
    </InputBox>
  );
}

// ================================================================

interface TextAreaInputBoxProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  tooltip?: TooltipSpec;
  className?: string;
}

export function TextAreaInputBox({
  tooltip,
  value,
  label,
  placeholder,
  onChange,
  className,
  ...props
}: TextAreaInputBoxProps & Omit<React.HTMLProps<HTMLTextAreaElement>, 'onChange'>): JSX.Element {
  return (
    <InputBox label={label} tooltip={tooltip} isFullWidth>
      <div className={twMerge('flex items-center w-full', className)}>
        <textarea
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-0 border-none focus:ring-0 block w-full text-base"
          placeholder={placeholder}
        />
      </div>
    </InputBox>
  );
}
