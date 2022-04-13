import { BaseCollection, ListingType } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { Filter, useFilterContext } from 'src/utils/context/FilterContext';
import { Button } from 'src/components/common';
import { TraitSelection } from './trait-selection';

interface Props {
  collection?: BaseCollection;
  collectionAddress?: string;
}

export const FilterPanel = ({ collection, collectionAddress }: Props) => {
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
    <div className="w-60 mr-8">
      <div className="text-lg">Filter</div>

      {showSaleAndPriceFilters && (
        <>
          <div className="text-lg mt-6 mb-4">Sale Type</div>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={filterState.listingType === ListingType.FixedPrice}
                  onChange={() => handleClickListingType(ListingType.FixedPrice)}
                />
                <span className="ml-2 align-middle">Fixed Price</span>
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={filterState.listingType === ListingType.DutchAuction}
                  onChange={() => handleClickListingType(ListingType.DutchAuction)}
                />
                <span className="ml-2 align-middle">Declining Price</span>
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={filterState.listingType === ListingType.EnglishAuction}
                  onChange={() => handleClickListingType(ListingType.EnglishAuction)}
                />
                <span className="ml-2 align-middle">On Aunction</span>
              </label>
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

      <div className="text-lg mt-6 mb-4 font-heading">Properties</div>
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
