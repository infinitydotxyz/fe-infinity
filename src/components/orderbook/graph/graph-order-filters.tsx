import React, { useState } from 'react';
import { Button, EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { textColorTW } from './graph-utils';
import { MdClear } from 'react-icons/md';

interface Props3 {
  className?: string;
}

export const GraphOrderFilters = ({ className = '' }: Props3) => {
  const tableItems: SimpleTableItem[] = [
    {
      title: <div className="text-black font-normal text-sm">Min:</div>,
      value: <FilterInput modeMinPrice={true} />
    }
  ];

  const tableItems2: SimpleTableItem[] = [
    {
      title: <div className="text-black font-normal text-sm">Max:</div>,
      value: <FilterInput modeMinPrice={false} />
    }
  ];

  return (
    <div className={twMerge('text-dark-gray-300 flex flex-col items-start', className)}>
      <SimpleTable className={twMerge('w-full space-y-0', textColorTW)} items={tableItems} />
      <SimpleTable className={twMerge('w-full space-y-0  ', textColorTW)} items={tableItems2} />
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
  const [price, setPrice] = useState(modeMinPrice ? minPrice?.toString() ?? '' : maxPrice?.toString() ?? '');

  const onSubmit = () => {
    updateFilter(modeMinPrice ? 'minPrice' : 'maxPrice', price);
  };

  return (
    <form className="flex items-center" onSubmit={onSubmit}>
      <input
        autoFocus={false}
        type="number"
        value={price}
        step="any" // allows 0.0001 etc
        onBlur={() => {
          onSubmit();
        }}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
        className={twMerge(
          'px-2 placeholder-gray-300 max-w-[70px] py-0 border-none bg-black focus:ring-0 block bg-transparent text-right font-heading'
        )}
        placeholder="0.00"
      />
      <div className="select-none text-sm">{EthSymbol}</div>

      <Button
        variant="round"
        size="plain"
        className="bg-gray-100 text-gray-500 ml-3"
        onClick={() => {
          updateFilter(modeMinPrice ? 'minPrice' : 'maxPrice', '');
        }}
      >
        <MdClear className="h-3 w-3" />
      </Button>
    </form>
  );
};
