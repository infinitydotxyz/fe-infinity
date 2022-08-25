import React from 'react';
import { Button, EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { blueColorText } from './graph-utils';
import { MdClear } from 'react-icons/md';

const backgroundStyle = 'flex flex-col bg-white bg-opacity-5 border border-[#333] rounded-xl px-8  ';

export const GraphOrderFilters = () => {
  const textColor = blueColorText;

  const tableItems: SimpleTableItem[] = [
    {
      title: <div className="">Min:</div>,
      value: <FilterInput modeMinPrice={true} />
    },
    {
      title: <div className="">Max:</div>,
      value: <FilterInput modeMinPrice={false} />
    }
  ];

  return (
    <div className={twMerge(textColor, backgroundStyle, 'py-5')}>
      <div className="flex flex-col">
        <div className="w-full font-bold mb-2 text-lg">Price filter</div>
        <SimpleTable className="text-gray-300" items={tableItems} />
      </div>
    </div>
  );
};

// ===================================================================

interface Props {
  modeMinPrice: boolean;
}

const FilterInput = ({ modeMinPrice }: Props) => {
  const { filters, updateFilter } = useOrderbook();
  const { minPrice, maxPrice } = filters;

  return (
    <div className="flex items-center">
      <input
        autoFocus={false}
        type="number"
        value={modeMinPrice ? minPrice : maxPrice}
        onChange={(e) => {
          updateFilter(modeMinPrice ? 'minPrice' : 'maxPrice', e.target.value);
        }}
        className={twMerge('px-3 border-none focus:ring-0 block bg-transparent text-right font-heading')}
        placeholder="0.00"
      />
      <div className="  select-none">{EthSymbol}</div>

      <Button
        variant="round"
        size="plain"
        className="bg-black ml-5"
        onClick={() => {
          updateFilter(modeMinPrice ? 'minPrice' : 'maxPrice', '');
        }}
      >
        <MdClear className="h-3 w-3" />
      </Button>
    </div>
  );
};
