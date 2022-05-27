import { BaseCollection, ListingType } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { Filter, useFilterContext } from 'src/utils/context/FilterContext';
import { Button, Checkbox } from 'src/components/common';
import { TraitSelection } from './trait-selection';

interface Props {
  collection?: BaseCollection;
  collectionAddress?: string;
  className?: string;
}

export const FilterPanel = ({ collection, collectionAddress, className }: Props) => {
  const { filterState, setFilterState } = useFilterContext();
  const [minPriceVal, setMinPriceVal] = useState('');
  const [maxPriceVal, setMaxPriceVal] = useState('');

  const handleClickListingType = (listingType: ListingType | '') => {
    let newValue = listingType;
    if (listingType === filterState.listingType) {
      newValue = ''; // toggle listingType
    }
    const newFilter = { ...filterState };
    newFilter.listingType = newValue;
    setFilterState(newFilter);
  };

  const handleClickApply = () => {
    const newFilter = { ...filterState };
    newFilter.priceMin = minPriceVal;
    newFilter.priceMax = maxPriceVal;
    setFilterState(newFilter);
  };

  const handleClickClear = () => {
    const newFilter = { ...filterState };
    newFilter.priceMin = '';
    newFilter.priceMax = '';
    setMinPriceVal('');
    setMaxPriceVal('');
    setFilterState(newFilter);
  };
  const showSaleAndPriceFilters = false;

  return (
    <div className={`w-80 mr-12 ${className ?? ''}`}>
      <div className="text-2xl font-bold">Filter</div>

      {showSaleAndPriceFilters && (
        <>
          <div className="text-lg mt-6 mb-4">Sale Type</div>
          <ul>
            <li>
              <Checkbox
                checked={filterState.listingType === ListingType.FixedPrice}
                onChange={() => handleClickListingType(ListingType.FixedPrice)}
                label="Fixed Price"
              />
            </li>
            <li>
              <Checkbox
                checked={filterState.listingType === ListingType.DutchAuction}
                onChange={() => handleClickListingType(ListingType.DutchAuction)}
                label="Declining Price"
              />
            </li>
            <li>
              <Checkbox
                checked={filterState.listingType === ListingType.EnglishAuction}
                onChange={() => handleClickListingType(ListingType.EnglishAuction)}
                label="On Auction"
              />
            </li>
          </ul>

          <hr className="mt-8" />

          <div className="text-lg mt-6">Price (ETH)</div>
          <div className="flex mt-4 mb-6">
            <input
              type="number"
              className="border rounded-lg p-2 w-1/2"
              placeholder="Min Price"
              value={minPriceVal}
              onChange={(ev) => {
                setMinPriceVal(ev.target.value);
              }}
            />
            <input
              type="number"
              className="border rounded-lg p-2 w-1/2 ml-2"
              placeholder="Max Price"
              value={maxPriceVal}
              onChange={(ev) => {
                setMaxPriceVal(ev.target.value);
              }}
            />
          </div>

          <Button variant="outline" onClick={handleClickApply}>
            Apply
          </Button>
          <Button variant="outline" className="ml-2" onClick={handleClickClear}>
            Clear
          </Button>
        </>
      )}

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
      />
    </div>
  );
};
