import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { OrderType, useFilterContext } from 'src/utils/context/FilterContext';
import { Button, Checkbox, TextInputBox } from 'src/components/common';

interface Props {
  collection?: BaseCollection;
  collectionAddress?: string;
  showFilterSections?: string[];
  userAddress?: string; // for User's Collection Filter
  className?: string;
}

export const UserProfileOrderFilterPanel = ({ className }: Props) => {
  const { filterState, setFilterState } = useFilterContext();
  const [minPriceVal, setMinPriceVal] = useState('');
  const [maxPriceVal, setMaxPriceVal] = useState('');

  const handleClickOrderType = (orderType: OrderType | '') => {
    let newValue = orderType;
    if (orderType === filterState.orderType) {
      newValue = ''; // toggle orderType
    }
    const newFilter = { ...filterState };
    if (newValue) {
      newFilter.orderType = newValue;
    } else {
      delete newFilter.orderType;
    }
    setFilterState(newFilter);
  };

  const handleClickApply = () => {
    const newFilter = { ...filterState };
    newFilter.minPrice = minPriceVal;
    newFilter.maxPrice = maxPriceVal;
    newFilter.orderBy = 'price';
    setFilterState(newFilter);
  };

  const handleClickClear = () => {
    const newFilter = { ...filterState };
    newFilter.minPrice = '';
    newFilter.maxPrice = '';
    newFilter.orderBy = '';
    newFilter.orderDirection = '';
    setMinPriceVal('');
    setMaxPriceVal('');
    setFilterState(newFilter);
  };

  return (
    <div className={`w-80 mr-12 pointer-events-auto ${className ?? ''}`}>
      <div className="text-2xl font-bold">Filter</div>

      <div className="text-lg mt-6 mb-4 font-heading">Order Type</div>
      <ul>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filterState.orderType === OrderType.Listing}
            onChange={() => handleClickOrderType(OrderType.Listing)}
            label="Listing"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filterState.orderType === OrderType.Offer}
            onChange={() => handleClickOrderType(OrderType.Offer)}
            label="Offers"
          />
        </li>
      </ul>

      <hr className="mt-8" />

      <div className="text-lg mt-6 font-heading">Price</div>
      <div className="flex mt-4 mb-6">
        <TextInputBox
          addEthSymbol={true}
          type="number"
          className="border-gray-300 font-heading"
          label="Min"
          placeholder=""
          value={minPriceVal}
          bindValue={true}
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
          bindValue={true}
          onChange={(value) => {
            setMaxPriceVal(value);
          }}
        />
      </div>

      <div className="flex">
        <Button variant="gray" className="py-3 w-1/2 bg-theme-gray-100 font-heading" onClick={handleClickApply}>
          Apply
        </Button>
        <Button variant="gray" className="py-3 w-1/2 bg-theme-gray-100 font-heading ml-2" onClick={handleClickClear}>
          Clear
        </Button>
      </div>

      <hr className="mt-8" />
    </div>
  );
};
