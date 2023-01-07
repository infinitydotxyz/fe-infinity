import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { TextInputBox } from '../common';
import { useOrderbook } from '../orderbook/OrderbookContext';
import { AButton, AOutlineButton } from './astra-button';
import { ACustomMenuButton, ACustomMenuContents, ACustomMenuItems, ADropdownButton } from './astra-dropdown';

export const APriceFilter: React.FC = () => {
  const { updateFilters, filters } = useOrderbook();
  const [minPriceVal, setMinPriceVal] = useState(filters.minPrice || '');
  const [maxPriceVal, setMaxPriceVal] = useState(filters.maxPrice || '');

  const onSave = () => {
    updateFilters([
      { name: 'minPrice', value: minPriceVal },
      { name: 'maxPrice', value: maxPriceVal }
    ]);
  };

  const onClear = () => {
    setMinPriceVal('');
    setMaxPriceVal('');
    updateFilters([
      { name: 'minPrice', value: '' },
      { name: 'maxPrice', value: '' }
    ]);
  };

  return (
    <Menu>
      {({ open }) => (
        <ACustomMenuContents>
          <span>
            <ACustomMenuButton>
              <AOutlineButton tooltip="Click to open price filter">
                <ADropdownButton isMenuOpen={open}>Price</ADropdownButton>
              </AOutlineButton>
            </ACustomMenuButton>
          </span>

          <ACustomMenuItems open={open} alignMenuRight={true} innerClassName="border-0">
            <div className="flex mr-2">
              <TextInputBox
                addEthSymbol={true}
                type="number"
                className="font-heading p-3"
                label="Min"
                placeholder=""
                value={minPriceVal}
                onChange={(value) => {
                  setMinPriceVal(value);
                }}
              />
              <TextInputBox
                addEthSymbol={true}
                type="number"
                className="font-heading ml-2 p-3"
                label="Max"
                placeholder=""
                value={maxPriceVal}
                onChange={(value) => {
                  setMaxPriceVal(value);
                }}
              />
            </div>
            <Menu.Button onClick={onClear} className="mt-4 ml-1">
              Clear
            </Menu.Button>
            <Menu.Button onClick={onSave} className="mt-2 mr-1 float-right">
              <AButton primary={true}>Apply</AButton>
            </Menu.Button>
          </ACustomMenuItems>
        </ACustomMenuContents>
      )}
    </Menu>
  );
};
