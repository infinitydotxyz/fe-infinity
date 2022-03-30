import { ListingType } from '@infinityxyz/lib/types/core';
import { Filter, useFilterContext } from 'src/utils/context/FilterContext';
import { Button } from '../common';
import TraitSelection from './trait-list';

interface Props {
  collectionAddress?: string;
}

export const FilerPanel = ({ collectionAddress }: Props) => {
  const { filterState, setFilterState } = useFilterContext();

  const handleClickListingType = (listingType: ListingType | '') => {
    let newValue = listingType;
    if (listingType === filterState.listingType) {
      newValue = ''; // toggle listingType
    }
    const newFilter = { ...filterState };
    newFilter.listingType = newValue;
    setFilterState(newFilter);

    console.log('newFilter', newFilter);
  };

  return (
    <div className="w-60">
      <div className="text-lg">Filter</div>

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
        <input className="border rounded-lg p-2 w-1/2" placeholder="Min Price" />
        <input className="border rounded-lg p-2 w-1/2 ml-2" placeholder="Max Price" />
      </div>

      <Button variant="outline">Apply</Button>
      <Button variant="outline" className="ml-2">
        Clear
      </Button>

      <hr className="mt-8" />

      <div className="text-lg mt-6">Properties</div>
      <TraitSelection
        collectionAddress={collectionAddress}
        onChange={(traitTypes, traitValues) => {
          const newFilter: Filter = { ...filterState };
          newFilter.traitTypes = traitTypes.join(',');
          newFilter.traitValues = traitValues.join(',');
          setFilterState(newFilter);

          console.log('newFilter', newFilter);
        }}
      />
    </div>
  );
};

export default FilerPanel;
