import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { Filter, OrderType, useFilterContext } from 'src/utils/context/FilterContext';
import { Button, Checkbox } from 'src/components/common';
import { TraitSelection } from './trait-selection';
import CollectionFilter, { CollectionFilterItem } from '../gallery/collection-filter';

interface Props {
  collection?: BaseCollection;
  collectionAddress?: string;
  initialCollections?: CollectionFilterItem[];
  showFilterSections?: string[];
  className?: string;
}

export const FilterPanel = ({
  collection,
  collectionAddress,
  initialCollections = [],
  showFilterSections,
  className
}: Props) => {
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

  const handleSelectCollections = (selectedIds: string[]) => {
    const newFilter = { ...filterState };
    newFilter.collectionAddresses = selectedIds;
    setFilterState(newFilter);
  };

  if (showFilterSections && showFilterSections[0] === 'COLLECTIONS') {
    return (
      <div className={`w-80 mr-12 pointer-events-auto ${className ?? ''}`}>
        <div className="text-2xl font-bold">Filter</div>

        <div className="text-lg mt-10 mb-7 font-heading">Collections</div>
        <div>
          <CollectionFilter initialCollections={initialCollections} onSelect={handleSelectCollections} />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 mr-12 ${className ?? ''}`}>
      <div className="text-2xl font-bold">Filter</div>

      <div className="text-lg mt-6 mb-4 font-heading">Status</div>
      <ul>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filterState.orderType === OrderType.Listing}
            onChange={() => handleClickOrderType(OrderType.Listing)}
            label="Buy now"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filterState.orderType === OrderType.Offer}
            onChange={() => handleClickOrderType(OrderType.Offer)}
            label="Has offers"
          />
        </li>
      </ul>

      <hr className="mt-8" />

      <div className="text-lg mt-6 font-heading">Price</div>
      <div className="flex mt-4 mb-6">
        <input
          type="number"
          className="border rounded-3xl py-3 px-4 w-1/2 border-gray-300"
          placeholder="Ξ Min Price"
          value={minPriceVal}
          onChange={(ev) => {
            setMinPriceVal(ev.target.value);
          }}
        />
        <input
          type="number"
          className="border rounded-3xl py-3 px-4 w-1/2 border-gray-300 ml-2"
          placeholder="Ξ Max Price"
          value={maxPriceVal}
          onChange={(ev) => {
            setMaxPriceVal(ev.target.value);
          }}
        />
      </div>

      <div className="flex">
        <Button variant="outline" className="p-3 w-1/2" onClick={handleClickApply}>
          Apply
        </Button>
        <Button variant="outline" className="p-3 w-1/2 ml-2" onClick={handleClickClear}>
          Clear
        </Button>
      </div>

      <hr className="mt-8" />

      <div className="text-lg mt-6 mb-7 font-heading">Properties</div>
      <TraitSelection
        traits={collection?.attributes}
        collectionAddress={collectionAddress}
        onChange={(traitTypes, traitValues) => {
          const newFilter: Filter = { ...filterState };
          newFilter.traitTypes = traitTypes;
          newFilter.traitValues = traitValues;
          setFilterState(newFilter);
        }}
        onClearAll={() => {
          const newFilter: Filter = { ...filterState };
          newFilter.traitTypes = [];
          newFilter.traitValues = [];
          setFilterState(newFilter);
        }}
      />
    </div>
  );
};
