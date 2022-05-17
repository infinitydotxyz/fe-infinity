import React from 'react';

import { FeedEventType } from '@infinityxyz/lib/types/core/feed';
import { Checkbox, PopoverButton } from '../common';

type FilterOption = {
  label: string;
  value: string;
};

interface FeedFilterDropdownProps {
  selectedTypes: Array<FeedEventType>;
  onChange: (checked: boolean, checkId: string) => void;
  options?: FilterOption[];
}

export const FeedFilterDropdown: React.FC<FeedFilterDropdownProps> = ({ options, selectedTypes, onChange }) => {
  const filterOptions = options ?? [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Listings',
      value: FeedEventType.NftListing
    },
    {
      label: 'Offers',
      value: FeedEventType.NftOffer
    },
    {
      label: 'Sales',
      value: FeedEventType.NftSale
    }
  ];
  return (
    <PopoverButton title="Filter" buttonClassName="font-heading pointer-events-auto">
      {filterOptions.map((item, idx) => {
        let isChecked = selectedTypes.indexOf(item.value as FeedEventType) >= 0;
        if (item.value === '' && selectedTypes.length === 0) {
          isChecked = true; // 'All' option selected.
        }
        return (
          <Checkbox
            className="pointer-events-auto"
            boxOnLeft={false}
            key={idx}
            label={item.label}
            checked={isChecked}
            onChange={(checked) => {
              onChange(checked, item.value);
            }}
          />
        );
      })}
    </PopoverButton>
  );
};
