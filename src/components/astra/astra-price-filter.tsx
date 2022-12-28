import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { TextInputBox } from '../common';
import { useOrderbook } from '../orderbook/OrderbookContext';
import { AButton, ATextButton } from './astra-button';
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
    <>
      <Menu>
        {({ open }) => (
          <ACustomMenuContents>
            <span>
              <ACustomMenuButton>
                <ATextButton tooltip="Click to open price filter">
                  <ADropdownButton>Price</ADropdownButton>
                </ATextButton>
              </ACustomMenuButton>
            </span>

            {open && (
              <ACustomMenuItems open={open}>
                <div className="flex">
                  <TextInputBox
                    addEthSymbol={true}
                    type="number"
                    className="border-gray-300 font-heading"
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
                    className="border-gray-300 font-heading ml-2"
                    label="Max"
                    placeholder=""
                    value={maxPriceVal}
                    onChange={(value) => {
                      setMaxPriceVal(value);
                    }}
                  />
                </div>
                <Menu.Button onClick={onClear} className="mt-2 float-left">
                  <AButton highlighted>Clear</AButton>
                </Menu.Button>
                <Menu.Button onClick={onSave} className="mt-2 float-right">
                  <AButton primary>Save</AButton>
                </Menu.Button>
              </ACustomMenuItems>
            )}
          </ACustomMenuContents>
        )}
      </Menu>
    </>
  );
};
