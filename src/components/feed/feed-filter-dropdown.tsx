import React from 'react';

import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { Checkbox, PopoverButton } from '../common';

type FilterOption = {
  label: string;
  value: string;
};

export type EventTypeOption = EventType | '';

interface FeedFilterDropdownProps {
  selectedTypes: Array<EventTypeOption>;
  onChange: (checked: boolean, checkId: string) => void;
  options?: FilterOption[];
  autoCheckAll?: boolean;
}

export const DEFAULT_OPTIONS = [
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
  },
  {
    label: 'Tokens Staked',
    value: EventType.TokensStaked
  },
  {
    label: 'Tokens Unstaked',
    value: EventType.TokensUnStaked
  },
  {
    label: 'Rage Quit',
    value: EventType.TokensRageQuit
  },
  {
    label: 'Vote',
    value: EventType.UserVote
  },
  {
    label: 'Votes Removed',
    value: EventType.UserVoteRemoved
  },
  {
    label: 'Transfer',
    value: EventType.NftTransfer
  }
];

export const FeedFilterDropdown: React.FC<FeedFilterDropdownProps> = ({
  options,
  selectedTypes,
  onChange,
  autoCheckAll = true
}) => {
  const filterOptions = options ?? DEFAULT_OPTIONS;
  return (
    <PopoverButton title="Filter">
      {filterOptions.map((item, idx) => {
        let isChecked = selectedTypes.indexOf(item.value as EventType) >= 0;

        if (autoCheckAll === true && item.value === '' && selectedTypes.length === 0) {
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
