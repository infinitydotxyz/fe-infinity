import React from 'react';

import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { Checkbox, PopoverButton } from '../common';

type FilterOption = {
  label: string;
  value: string;
};

interface FeedFilterDropdownProps {
  selectedTypes: Array<EventType>;
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
      value: EventType.NftListing
    },
    {
      label: 'Offers',
      value: EventType.NftOffer
    },
    {
      label: 'Sales',
      value: EventType.NftSale
    }
  ];
  return (
    <PopoverButton title="Filter" buttonClassName="font-heading pointer-events-auto py-2.5">
      {filterOptions.map((item, idx) => {
        let isChecked = selectedTypes.indexOf(item.value as EventType) >= 0;
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
