import { SaleSource } from '@infinityxyz/lib-frontend/types/core';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import React, { useState } from 'react';
import { Checkbox, PopoverButton } from '../common';

export const commonEventTypes = [
  EventType.NftSale,
  EventType.NftListing,
  EventType.CoinMarketCapNews,
  EventType.DiscordAnnouncement,
  EventType.NftTransfer,
  EventType.TwitterTweet,
  EventType.NftOffer,
  EventType.TokensStaked,
  EventType.UserVote
];

export const minEventTypes: EventType[] = [
  EventType.NftSale,
  EventType.NftOffer,
  EventType.NftListing,
  EventType.NftTransfer
];

export const shortEventTypes: EventType[] = [
  EventType.NftSale,
  EventType.NftOffer,
  EventType.NftListing,
  EventType.TokensStaked,
  EventType.UserVote,
  EventType.NftTransfer
];

export const globalEventTypes: EventType[] = [
  EventType.DiscordAnnouncement,
  EventType.TokensStaked,
  EventType.TwitterTweet,
  EventType.UserVote,
  EventType.NftListing,
  EventType.NftOffer
];

export type FeedFilter = {
  types?: EventType[];
  collectionAddress?: string;
  tokenId?: string;
  userAddress?: string;
  source?: SaleSource;
};

interface Props {
  options: AFilterPopdownOption[];
  filter: FeedFilter;
  className?: string;
  onChange: (filter: FeedFilter) => void;
}

export const AFilterPopdown = ({ onChange, options, filter, className = '' }: Props) => {
  const [filteringTypes, setFilteringTypes] = useState<EventType[]>(filter.types ?? []);

  const onChangeFilterDropdown = (checked: boolean, checkId: EventType) => {
    const selectedType = checkId as EventType;

    if (checked) {
      updateFilter([...filteringTypes, selectedType], filter.source);
    } else {
      const newTypes = [...filteringTypes];
      const index = filteringTypes.indexOf(selectedType);

      if (index >= 0) {
        newTypes.splice(index, 1);
      }

      updateFilter(newTypes, filter.source);
    }
  };

  const updateFilter = (types: EventType[], source: SaleSource | undefined) => {
    const newFilter = { ...filter };

    newFilter.types = types;
    newFilter.source = source;
    setFilteringTypes(types);
    onChange(newFilter);
  };

  const onOptionChange = (checked: boolean, checkId: string) => {
    if (checkId === 'infinityOnly') {
      let newTypes: EventType[] = [];

      if (checked) {
        newTypes = [EventType.NftSale];
      } else {
        newTypes = [];
      }

      updateFilter(newTypes, checked ? SaleSource.Infinity : undefined);
    }
  };

  return (
    <div className={className}>
      <AFeedFilterPopdown
        optionInfinityOnly={filter.source === SaleSource.Infinity}
        onOptionChange={onOptionChange}
        options={options}
        selectedTypes={filteringTypes}
        onChange={onChangeFilterDropdown}
        select={(selectAll) => {
          if (selectAll) {
            updateFilter(options?.map((o) => o.value) ?? [], filter.source);
          } else {
            updateFilter([], filter.source);
          }
        }}
      />
    </div>
  );
};

// ====================================================================================

interface Props2 {
  selectedTypes: Array<EventType>;
  select: (selectAll: boolean) => void;
  onChange: (checked: boolean, eventType: EventType) => void;
  onOptionChange: (checked: boolean, checkId: string) => void;
  optionInfinityOnly?: boolean;
  options: AFilterPopdownOption[];
}

const AFeedFilterPopdown: React.FC<Props2> = ({ options, selectedTypes, onChange }) => {
  return (
    <PopoverButton title="Filter">
      {options.map((item, idx) => {
        const isChecked = selectedTypes.indexOf(item.value as EventType) >= 0;

        return (
          <Checkbox
            className="pointer-events-auto"
            boxOnLeft={true}
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

// ==========================================================================

type AFilterPopdownOption = {
  label: string;
  value: EventType;
};

export const filterButtonDefaultOptions: AFilterPopdownOption[] = [
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
    label: 'Transfers',
    value: EventType.NftTransfer
  }
];
