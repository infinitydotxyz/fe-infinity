import { ListingType } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { Button } from '../common';

type Filter = {
  listingType?: ListingType | undefined;
};

export const FilerPanel = () => {
  const [filter, setFilter] = useState<Filter>({});

  const handleClickListingType = (listingType: ListingType | undefined) => {
    let newListType = listingType;
    if (listingType === filter.listingType) {
      newListType = undefined;
    }
    setFilter((currentFilter: Filter) => ({ ...currentFilter, listingType: newListType }));
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
              checked={filter.listingType === ListingType.FixedPrice}
              onChange={() => handleClickListingType(ListingType.FixedPrice)}
            />
            <span className="ml-2 align-middle">Fixed Price</span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={filter.listingType === ListingType.DutchAuction}
              onChange={() => handleClickListingType(ListingType.DutchAuction)}
            />
            <span className="ml-2 align-middle">Declining Price</span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={filter.listingType === ListingType.EnglishAuction}
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

      <div className="text-lg mt-6">Properties</div>
      <div>Shirt</div>
    </div>
  );
};

export default FilerPanel;
