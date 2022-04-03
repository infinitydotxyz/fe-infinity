import { ReactNode } from 'react';
import { DatePicker } from 'src/components/common';
import { ComboBox, ComboBoxBaseType } from './combo-box';
import { CalendarIcon } from '@heroicons/react/outline';
import { EthSymbol } from './eth-price';

interface Props {
  label?: string;
  children: ReactNode;
}

export function InputBox({ label, children }: Props): JSX.Element {
  return (
    <div className="py-2 pl-6 pr-2 mb-1 outline outline-1 outline-slate-300 rounded-2xl ">
      {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
      <div className="mt-1 flex items-center">{children}</div>
    </div>
  );
}

// =======================================================

interface Props2 {
  label: string;
  value: Date;
  placeholder?: string;
  onChange: (value: Date) => void;
}

export function DatePickerBox({ label, value, onChange, placeholder }: Props2): JSX.Element {
  return (
    <InputBox label={label}>
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
}

export function ComboInputBox<T extends ComboBoxBaseType>({ label, options, onChange, value }: Props3<T>): JSX.Element {
  return (
    <InputBox label={label}>
      <ComboBox options={options} value={value} onChange={onChange} />
    </InputBox>
  );
}

// ================================================================

interface Props4 {
  label: string;
  value: string;
  type: string;
  placeholder: string;
  addEthSymbol?: boolean;
  onChange: (value: string) => void;
}

export function TextInputBox({ value, label, addEthSymbol = false, type, placeholder, onChange }: Props4): JSX.Element {
  return (
    <InputBox label={label}>
      <div className="flex items-center">
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
