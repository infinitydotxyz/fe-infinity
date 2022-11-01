import React, { useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { SaleSource } from '@infinityxyz/lib-frontend/types/core';
import { Button, Checkbox, Divider, PopoverButton } from '../common';

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

interface Props {
  options: FilterPopdownOption[];
  filter: FeedFilter;
  className?: string;
  onChange: (filter: FeedFilter) => void;
}

export const FilterPopdown = ({ onChange, options, filter, className = '' }: Props) => {
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
      <FeedFilterPopdown
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
  options: FilterPopdownOption[];
}

const FeedFilterPopdown: React.FC<Props2> = ({
  options,
  selectedTypes,
  onChange,
  onOptionChange,
  optionInfinityOnly,
  select
}) => {
  return (
    <PopoverButton title="Filter">
      <div className="flex gap-3 justify-center items-center">
        <Button
          variant="gray"
          size="medium"
          onClick={() => {
            select(true);
          }}
        >
          Select All
        </Button>

        <Button
          onClick={() => {
            select(false);
          }}
          variant="gray"
          size="medium"
        >
          Deselect All
        </Button>
      </div>

      <Divider />

      {options.map((item, idx) => {
        const isChecked = selectedTypes.indexOf(item.value as EventType) >= 0;

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

      <Divider />
      <Checkbox
        className="pointer-events-auto"
        boxOnLeft={false}
        key="infinityOnly"
        label="Infinity sales only"
        checked={optionInfinityOnly ?? false}
        onChange={(checked) => {
          if (onOptionChange) {
            onOptionChange(checked, 'infinityOnly');
          }
        }}
      />
    </PopoverButton>
  );
};

// ==========================================================================

type FilterPopdownOption = {
  label: string;
  value: EventType;
};

export const feedFilterDefaultOptions: FilterPopdownOption[] = [
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

// from discord
// On the asset page “tokens staked”, “vote”, “tweets”, “discord” and “news”.
// None of these are related to the specific asset so could be removed. Not a priority though.
export const assetDefaultOptions: FilterPopdownOption[] = [
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

// why is this different?
export const filterButtonDefaultOptions: FilterPopdownOption[] = [
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
  },
  {
    label: 'News',
    value: EventType.CoinMarketCapNews
  },
  {
    label: 'Discord',
    value: EventType.DiscordAnnouncement
  },
  {
    label: 'Tweets',
    value: EventType.TwitterTweet
  },
  {
    label: 'Tokens Staked',
    value: EventType.TokensStaked
  },
  {
    label: 'Vote',
    value: EventType.UserVote
  }
];
