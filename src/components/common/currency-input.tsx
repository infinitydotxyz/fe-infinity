import { InputBox } from './input-box';
import { useState } from 'react';
import { BiCaretDown } from 'react-icons/bi';
import { EthSymbol } from './eth-price';

interface Props {
  label: string;
  value: string | number;
  placeholder: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}

export const CurrencyInput = ({ value, label, placeholder, onChange, autoFocus = false }: Props) => {
  const [currency, setCurrency] = useState('WETH');

  return (
    <InputBox>
      <div className="flex-1">
        <label className="block text-xs font-medium text-theme-light-800">{label}</label>
        <div className="flex">
          <div className="pr-2">{EthSymbol}</div>
          <input
            autoFocus={autoFocus}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-0 border-none focus:ring-0 block w-full text-base"
            placeholder={placeholder}
          />
        </div>
      </div>
      <div className="nft-dropdown z-10 relative flex items-center py-3 pl-5 pr-6 rounded-full bg-theme-light-300">
        <div className="uppercase text-heading mr-2">{currency}</div>
        <BiCaretDown className="h-3 w-3" />

        <div className="flex-col nft-dropdown-menu top-12 right-0 absolute hidden text-gray-700 pt-1">
          <MenuItem key="WETH" currency="WETH" onClick={(value) => setCurrency(value)} />
          <MenuItem key="TEST" currency="TEST" onClick={(value) => setCurrency(value)} />
          <MenuItem key="USD" currency="USD" onClick={(value) => setCurrency(value)} />
        </div>
      </div>
    </InputBox>
  );
};

// ===================================================

interface Props2 {
  currency: string;
  onClick: (value: string) => void;
}

const MenuItem = ({ currency, onClick }: Props2) => {
  return (
    <div onClick={() => onClick(currency)} className="bg-gray-200 hover:bg-gray-300 py-2 px-4 whitespace-nowrap">
      {currency}
    </div>
  );
};
