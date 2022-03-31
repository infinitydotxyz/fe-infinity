import { InputBox } from './input-box';
import downArrow from 'src/images/down-arrow.svg';
import { useState } from 'react';

interface Props {
  label: string;
  value: string | number;
  type: string;
  placeholder: string;
  onChange: (value: string | number) => void;
}

export function CurrencyInput({ value, label, type, placeholder, onChange }: Props): JSX.Element {
  const [currency, setCurrency] = useState('WETH');

  return (
    <InputBox>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600">{label}</label>
        <div className="flex">
          Ξ&nbsp;&nbsp;
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-0 border-none focus:ring-0 block w-full text-base"
            placeholder={placeholder}
          />
        </div>
      </div>
      <div className="dropdown z-10 relative flex items-center py-3 pl-5 pr-6 rounded-full bg-gray-50">
        <span className="uppercase text-heading mr-2">{currency}</span>
        <img src={downArrow.src} alt="list currencies" />
        <ul className="dropdown-menu top-12 right-0 absolute hidden text-gray-700 pt-1">
          <li onClick={() => setCurrency('WETH')}>
            <a className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">
              WETH
            </a>
          </li>
          <li onClick={() => setCurrency('TEST')}>
            <a className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">
              TEST
            </a>
          </li>
          <li onClick={() => setCurrency('USD')}>
            <a className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">
              USD
            </a>
          </li>
        </ul>
      </div>
    </InputBox>
  );
}
