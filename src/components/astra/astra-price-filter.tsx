import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { brandTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { TextInputBox } from '../common';
import { AOutlineButton } from './astra-button';
import { ACustomMenuButton, ACustomMenuContents, ACustomMenuItems, ADropdownButton } from './astra-dropdown';

interface Props {
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  onClear: () => void;
}

export const APriceFilter = ({ setMinPrice, setMaxPrice, onClear }: Props) => {
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
                label="Min"
                placeholder=""
                value={minPriceVal}
                onChange={(value) => {
                  setMinPriceVal(value);
                  setMinPrice(value);
                }}
              />
              <TextInputBox
                addEthSymbol={true}
                type="number"
                className="ml-2 p-3"
                label="Max"
                placeholder=""
                value={maxPriceVal}
                onChange={(value) => {
                  setMaxPriceVal(value);
                  setMaxPrice(value);
                }}
              />
            </div>
            <Menu.Button
              onClick={() => {
                setMinPriceVal('');
                setMaxPriceVal('');
                onClear();
              }}
              className={twMerge('mt-4 ml-1 text-sm', brandTextColor)}
            >
              Clear
            </Menu.Button>
          </ACustomMenuItems>
        </ACustomMenuContents>
      )}
    </Menu>
  );
};
