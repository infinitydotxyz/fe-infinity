import React from 'react';
import { Button, EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { textAltColorTW, textColorTW } from './graph-utils';
import { MdClear } from 'react-icons/md';
import { numStr } from 'src/utils';

interface Props3 {
  className?: string;
}

export const GraphOrderFilters = ({ className = '' }: Props3) => {
  const tableItems: SimpleTableItem[] = [
    {
      title: <div className="text-sm">Min:</div>,
      value: <FilterInput modeMinPrice={true} />
    }
  ];

  const tableItems2: SimpleTableItem[] = [
    {
      title: <div className="text-sm">Max:</div>,
      value: <FilterInput modeMinPrice={false} />
    }
  ];

  return (
    <div className={twMerge(textAltColorTW, 'flex items-center', className)}>
      <SimpleTable className={twMerge('w-full space-y-0', textColorTW)} items={tableItems} />
      <SimpleTable className={twMerge('w-full space-y-0 ml-7', textColorTW)} items={tableItems2} />
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
        value={modeMinPrice ? numStr(minPrice ?? '') : numStr(maxPrice ?? '')}
        onChange={(e) => {
          updateFilter(modeMinPrice ? 'minPrice' : 'maxPrice', e.target.value);
        }}
        className={twMerge(
          'px-2 placeholder-gray-300 max-w-[70px] py-0 border-none bg-black focus:ring-0 block bg-transparent text-right font-heading'
        )}
        placeholder="0.00"
      />
      <div className="select-none">{EthSymbol}</div>

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
    </div>
  );
};
