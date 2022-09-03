import React from 'react';
import { Button, EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { textAltColorTW, textColorTW } from './graph-utils';
import { MdClear } from 'react-icons/md';
import { numStr } from 'src/utils';
import { GraphBox } from './graph-box';

export const GraphOrderFilters = () => {
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
    <GraphBox className="py-3">
      <div className={twMerge(textAltColorTW, 'flex items-center')}>
        <div className="flex flex-col ">
          <SimpleTable className={twMerge('space-y-0', textColorTW)} items={tableItems} />
        </div>
      </div>
    </GraphBox>
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
          'px-2 placeholder-gray-300 max-w-[100px] py-0 border-none bg-black focus:ring-0 block bg-transparent text-right font-heading'
        )}
        placeholder="0.00"
      />
      <div className="select-none">{EthSymbol}</div>

      <Button
        variant="round"
        size="plain"
        className="bg-gray-200 text-black ml-5"
        onClick={() => {
          updateFilter(modeMinPrice ? 'minPrice' : 'maxPrice', '');
        }}
      >
        <MdClear className="h-3 w-3" />
      </Button>
    </div>
  );
};
