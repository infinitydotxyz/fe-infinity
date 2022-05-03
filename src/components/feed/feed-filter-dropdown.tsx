import React from 'react';

import { FeedEventType } from '@infinityxyz/lib/types/core/feed';
import { Checkbox, PopoverButton } from '../common';

interface FeedFilterDropdownProps {
  selectedTypes: Array<FeedEventType>;
  onChange: (checked: boolean, checkId: string) => void;
}

export const FeedFilterDropdown: React.FC<FeedFilterDropdownProps> = ({ selectedTypes, onChange }) => {
  const options = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Tweets',
      value: FeedEventType.TwitterTweet
    },
    {
      label: 'Discord',
      value: FeedEventType.DiscordAnnouncement
    },
    {
      label: 'Sales',
      value: FeedEventType.NftSale
    }
  ];
  return (
    <PopoverButton title="Filter" buttonClassName="font-heading">
      {options.map((item, idx) => {
        let isChecked = selectedTypes.indexOf(item.value as FeedEventType) >= 0;
        if (item.value === '' && selectedTypes.length === 0) {
          isChecked = true; // 'All' option selected.
        }
        return (
          <Checkbox
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
