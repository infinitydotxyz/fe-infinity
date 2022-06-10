import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { Checkbox, TextInputBox } from 'src/components/common';

export type UserOrderFilter = {
  orderType?: 'listings' | 'offers';
  minPrice?: string;
  maxPrice?: string;
  numItems?: string;
};

interface Props {
  collection?: BaseCollection;
  collectionAddress?: string;
  showFilterSections?: string[];
  userAddress?: string; // for User's Collection Filter
  className?: string;
  onChange: (filter: UserOrderFilter) => void;
}

export const UserProfileOrderFilterPanel = ({ className, onChange }: Props) => {
  const [minPriceVal, setMinPriceVal] = useState('');
  const [maxPriceVal, setMaxPriceVal] = useState('');
  const [numItems, setNumItems] = useState('');
  const [filter, setFilter] = useState<UserOrderFilter>({
    orderType: 'listings'
  });

  const onClickOrderType = (newType: 'listings' | 'offers') => {
    const newFilter = {
      ...filter,
      orderType: newType
    };
    setFilter(newFilter);
    onChange(newFilter);
  };

  // const onClickApply = () => {
  //   const newFilter = { ...filter };
  //   newFilter.minPrice = minPriceVal;
  //   newFilter.maxPrice = maxPriceVal;
  //   setFilter(newFilter);
  //   onChange(newFilter);
  // };

  // const onClickClear = () => {
  //   const newFilter = { ...filter };
  //   newFilter.minPrice = '';
  //   newFilter.maxPrice = '';
  //   setMinPriceVal('');
  //   setMaxPriceVal('');
  //   setFilter(newFilter);
  //   onChange(newFilter);
  // };

  return (
    <div className={`w-80 mr-12 pointer-events-auto ${className ?? ''}`}>
      <div className="text-2xl font-bold">Filter</div>

      <div className="text-lg mt-6 mb-4 font-heading">Order Type</div>
      <ul>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'listings'}
            onChange={() => onClickOrderType('listings')}
            label="Listing"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'offers'}
            onChange={() => onClickOrderType('offers')}
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
            const newFilter = { ...filter };
            newFilter.minPrice = value;
            setFilter(newFilter);
            onChange(newFilter);
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
            const newFilter = { ...filter };
            newFilter.maxPrice = value;
            setFilter(newFilter);
            onChange(newFilter);
          }}
        />
      </div>

      <div className="text-lg mt-6 font-heading">Number of NFTs</div>
      <div className="flex mt-4 mb-6">
        <TextInputBox
          addEthSymbol={true}
          type="number"
          className="border-gray-300 font-heading"
          label="Amount of NFTs"
          placeholder=""
          value={numItems}
          bindValue={true}
          onChange={(value) => {
            setNumItems(value);
            const newFilter = { ...filter };
            newFilter.numItems = value;
            setFilter(newFilter);
            onChange(newFilter);
          }}
        />
      </div>

      {/* <div className="flex">
        <Button variant="gray" className="py-3 w-1/2 bg-theme-gray-100 font-heading" onClick={onClickApply}>
          Apply
        </Button>
        <Button variant="gray" className="py-3 w-1/2 bg-theme-gray-100 font-heading ml-2" onClick={onClickClear}>
          Clear
        </Button>
      </div> */}

      <hr className="mt-8" />
    </div>
  );
};
