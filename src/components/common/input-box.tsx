import React, { ReactElement, ReactNode, useState } from 'react';
import { DatePicker } from 'src/components/common';
import { ComboBox, ComboBoxBaseType } from './combo-box';
import { CalendarIcon } from '@heroicons/react/outline';
import { EthSymbol } from './eth-price';
import { Tooltip, TooltipIcon, TooltipSpec, TooltipWrapper } from './tool-tip';
import { twMerge } from 'tailwind-merge';
import { Field, FieldConfig, FieldProps } from 'formik';
import classNames from 'classnames';

interface Props {
  label?: string;
  children: ReactNode;
  tooltip?: TooltipSpec;
  isFullWidth?: boolean;
  renderRightIcon?: () => ReactElement;
  icon?: ReactNode;
}

export function InputBox({ tooltip, label, children, icon, renderRightIcon, isFullWidth }: Props): JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TooltipWrapper show={showTooltip} tooltip={tooltip} className={classNames({ 'w-full': isFullWidth })}>
      <div className="py-3 pl-6 pr-2 outline outline-1 outline-gray-300 rounded-2xl w-full flex items-center">
        {icon && <span className="pr-8">{icon}</span>}
        <div className="w-full">
          {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
          <div className="mt-1 flex items-center w-full">
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
  label: string;
  value?: string;
  type: string;
  placeholder: string;
  addEthSymbol?: boolean;
  onChange?: (value: string) => void;
  tooltip?: TooltipSpec;
  icon?: ReactNode;
  bind?: string;
  fieldProps?: FieldConfig;
  className?: string;
}

export function TextInputBox({
  bind,
  tooltip,
  value = '',
  label,
  icon,
  addEthSymbol = false,
  type,
  placeholder,
  onChange,
  fieldProps,
  ...props
}: Props4 & Omit<Props, 'children'>): JSX.Element {
  if (bind) {
    return (
      <Field validateOnChange name={bind} {...fieldProps}>
        {({ meta, field, form }: FieldProps) => (
          <div className="my-4 sm:my-6">
            <InputBox label={label} tooltip={tooltip} icon={icon} {...props}>
              <div className="flex items-center w-full">
                {addEthSymbol && <div className="pr-2">{EthSymbol}</div>}
                <input
                  type={type}
                  value={field.value || ''}
                  className="p-0 border-none focus:ring-0 block w-full text-base"
                  placeholder={placeholder}
                  onChange={(e) => {
                    if (onChange) {
                      onChange(e.target.value);
                    }
                    if (!e.defaultPrevented) {
                      form.setFieldValue(bind, e.target.value);
                    }
                  }}
                />
              </div>
            </InputBox>
            {meta.touched && meta.error && <div className="text-red-800 text-xs pl-6">{meta.error}</div>}
          </div>
        )}
      </Field>
    );
  }

  return (
    <InputBox label={label} tooltip={tooltip} icon={icon} {...props}>
      <div className="flex items-center w-full">
        {addEthSymbol && <div className="pr-2">{EthSymbol}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="p-0 border-none focus:ring-0 block w-full text-base"
          placeholder={placeholder}
        />
      </div>
    </InputBox>
  );
}

interface Props5 {
  label: string;
  value?: string;
  rows?: number;
  placeholder: string;
  tooltip?: TooltipSpec;
  onChange?: (value: string) => void;
  bind?: string;
  fieldProps?: FieldConfig;
}

export function TextAreaBox({
  value = '',
  label,
  placeholder,
  tooltip,
  onChange,
  rows = 3,
  bind,
  fieldProps
}: Props5): JSX.Element {
  if (bind) {
    return (
      <Field validateOnChange name={bind} {...fieldProps}>
        {({ meta, field, form }: FieldProps) => (
          <div className="my-4 sm:my-6">
            <InputBox label={label} tooltip={tooltip}>
              <div className="flex items-center w-full">
                <textarea
                  rows={rows}
                  value={field.value || ''}
                  onChange={(e) => {
                    if (onChange) {
                      onChange(e.target.value);
                    }
                    if (!e.defaultPrevented) {
                      form.setFieldValue(bind, e.target.value);
                    }
                  }}
                  className="p-0 border-none focus:ring-0 block w-full text-base"
                  placeholder={placeholder}
                />
              </div>
            </InputBox>
            {meta.touched && meta.error && <div className="text-red-800 text-xs pl-6">{meta.error}</div>}
          </div>
        )}
      </Field>
    );
  }
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
