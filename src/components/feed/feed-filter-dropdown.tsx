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
    <PopoverButton title="Filter">
      {options.map((item, idx) => (
        <Checkbox
          boxOnLeft={false}
          key={idx}
          label={item.label}
          checked={selectedTypes.indexOf(item.value as FeedEventType) >= 0}
          onChange={(checked) => {
            onChange(checked, item.value);
          }}
        />
      ))}
    </PopoverButton>
  );
};
