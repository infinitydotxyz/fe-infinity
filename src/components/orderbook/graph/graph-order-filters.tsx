import React from 'react';
import { Button, EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { bgAltColorTW, textAltColorTW, textColorTW } from './graph-utils';
import { MdClear } from 'react-icons/md';
import { BiReset } from 'react-icons/bi';
import { numStr } from 'src/utils';

export const GraphOrderFilters = () => {
  const { updateFilters } = useOrderbook();

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
    <div className={twMerge(textAltColorTW, 'flex items-center')}>
      <Button
        variant="round"
        size="plain"
        className={twMerge(bgAltColorTW, 'text-white')}
        onClick={() => {
          updateFilters([
            { name: 'minPrice', value: '' },
            { name: 'maxPrice', value: '' }
          ]);
        }}
      >
        <BiReset className="h-8 w-8" />
      </Button>

      <div className="ml-4 flex flex-col ">
        {/* <div className="w-full font-bold mb-2 text-lg">Price filter</div> */}
        <SimpleTable className={twMerge('space-y-0', textColorTW)} items={tableItems} />
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
