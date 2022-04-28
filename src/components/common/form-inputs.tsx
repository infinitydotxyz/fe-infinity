import React, { ReactNode } from 'react';
import { InputBox } from 'src/components/common';
import { EthSymbol } from './eth-price';
import { TooltipSpec } from './tool-tip';
import { Field, FieldConfig, FieldProps } from 'formik';

interface Props4 {
  label: string;
  type: string;
  placeholder: string;
  addEthSymbol?: boolean;
  onChange?: (value: string) => void;
  tooltip?: TooltipSpec;
  icon?: ReactNode;
  bind: string;
  fieldProps?: FieldConfig;
}

export const TextInputForm = ({
  bind,
  tooltip,
  label,
  icon,
  addEthSymbol = false,
  type,
  placeholder,
  onChange,
  fieldProps,
  ...props
}: Props4) => {
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
                className="p-0 border-none focus:ring-0 block w-full text-base font-zagmamono"
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
};

// ==============================================================

interface Props5 {
  label: string;
  rows?: number;
  placeholder: string;
  tooltip?: TooltipSpec;
  onChange?: (value: string) => void;
  bind: string;
  fieldProps?: FieldConfig;
}

export const TextAreaForm = ({ label, placeholder, tooltip, onChange, rows = 3, bind, fieldProps }: Props5) => {
  return (
    <Field validateOnChange name={bind} {...fieldProps}>
      {({ meta, field, form }: FieldProps) => (
        <div className="my-4 sm:my-6">
          <InputBox label={label} tooltip={tooltip} labelClassname="mt-4">
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
                className="p-0 mt-2 border-none focus:ring-0 block w-full text-base font-zagmamono"
                placeholder={placeholder}
              />
            </div>
          </InputBox>
          {meta.touched && meta.error && <div className="text-red-800 text-xs pl-6">{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};
