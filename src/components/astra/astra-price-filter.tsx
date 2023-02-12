import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { OrderBy, TokensFilter } from 'src/utils/types';
import { brandTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Spacer, TextInputBox } from '../common';
import { AOutlineButton } from './astra-button';
import { ACustomMenuButton, ACustomMenuContents, ACustomMenuItems, ADropdownButton } from './astra-dropdown';

interface Props {
  filter: TokensFilter;
  setFilter: (filter: TokensFilter) => void;
}

export const APriceFilter = ({ filter, setFilter }: Props) => {
  const [minPriceVal, setMinPriceVal] = useState('');
  const [maxPriceVal, setMaxPriceVal] = useState('');

  return (
    <Menu>
      {({ open }) => (
        <ACustomMenuContents>
          <span>
            <ACustomMenuButton>
              <AOutlineButton tooltip="Filter by price">
                <ADropdownButton isMenuOpen={open}>Price</ADropdownButton>
              </AOutlineButton>
            </ACustomMenuButton>
          </span>

          <ACustomMenuItems open={open} alignMenuRight={true} innerClassName="border-0">
            <div className="flex mr-2">
              <TextInputBox
                addEthSymbol={true}
                type="number"
                className="p-3"
                inputClassName="text-sm"
                placeholder="Min"
                value={minPriceVal}
                onChange={(value) => {
                  setMinPriceVal(value);
                  const newFilter: TokensFilter = {};
                  newFilter.minPrice = value;
                  newFilter.orderBy = OrderBy.Price;
                  setFilter({ ...filter, ...newFilter });
                }}
              />
              <TextInputBox
                addEthSymbol={true}
                type="number"
                className="ml-2 p-3"
                inputClassName="text-sm"
                placeholder="Max"
                value={maxPriceVal}
                onChange={(value) => {
                  setMaxPriceVal(value);
                  const newFilter: TokensFilter = {};
                  newFilter.maxPrice = value;
                  newFilter.orderBy = OrderBy.Price;
                  setFilter({ ...filter, ...newFilter });
                }}
              />
            </div>

            <div className="flex mt-4 text-sm px-1">
              <div
                onClick={() => {
                  setMinPriceVal('');
                  setMaxPriceVal('');
                  const newFilter: TokensFilter = {};
                  newFilter.minPrice = '';
                  newFilter.maxPrice = '';
                  setFilter({ ...filter, ...newFilter });
                }}
                className={twMerge('cursor-pointer', brandTextColor)}
              >
                Clear
              </div>
            </div>
          </ACustomMenuItems>
        </ACustomMenuContents>
      )}
    </Menu>
  );
};
