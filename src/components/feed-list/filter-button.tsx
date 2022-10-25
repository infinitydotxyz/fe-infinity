import { useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { FeedFilterDropdown } from '../feed/feed-filter-dropdown';
import { SaleSource } from '@infinityxyz/lib-frontend/types/core';

interface Props {
  filter: FeedFilter;
  className?: string;
  onChange: (filter: FeedFilter) => void;
}

export const FilterButton = ({ onChange, filter, className = '' }: Props) => {
  const [filteringTypes, setFilteringTypes] = useState<EventType[]>(filter.types ?? []);

  const onChangeFilterDropdown = (checked: boolean, checkId: string) => {
    const newFilter = { ...filter };

    if (checkId === '') {
      newFilter.types = [];
      setFilteringTypes(newFilter.types);
    } else {
      const selectedType = checkId as EventType;

      if (checked) {
        newFilter.types = [...filteringTypes, selectedType];
        setFilteringTypes(newFilter.types);
      } else {
        const newTypes = [...filteringTypes];
        const index = filteringTypes.indexOf(selectedType);

        if (index >= 0) {
          newTypes.splice(index, 1);
        }

        newFilter.types = newTypes;
        setFilteringTypes(newTypes);
      }
    }

    onChange(newFilter);
  };

  return (
    <div className={className}>
      <FeedFilterDropdown
        optionInfinityOnly={filter.source === SaleSource.Infinity}
        onOptionChange={(checked: boolean, checkId: string) => {
          if (checkId === 'infinityOnly') {
            const newFilter = { ...filter };

            newFilter.source = checked ? SaleSource.Infinity : undefined;

            onChange(newFilter);
          }
        }}
        options={[
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
        ]}
        selectedTypes={filteringTypes}
        onChange={onChangeFilterDropdown}
      />
    </div>
  );
};
