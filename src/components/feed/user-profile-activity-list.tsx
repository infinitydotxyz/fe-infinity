import { useState } from 'react';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { EventType, UserFeedEvent } from '@infinityxyz/lib-frontend/types/core/feed';
import { FEED_FILTER_DEFAULT_OPTIONS, FeedFilterDropdown } from './feed-filter-dropdown';
import { CenteredContent, ScrollLoader, Spinner } from '../common';
import { useUserActivity } from 'src/hooks/api/useUserActivity';
import { NftOrderEvent } from './user-feed-events/nft-order-event';
import { NftSaleEvent } from './user-feed-events/nft-sale-event';
import { TokenStakeEvent } from './user-feed-events/token-stake-event';
import { VoteEvent } from './user-feed-events/vote-event';
import { NftTransferEvent } from './user-feed-events/nft-transfer-event';
import { twMerge } from 'tailwind-merge';
import { negativeMargin } from 'src/utils/ui-constants';

interface UserProfileActivityListProps {
  userAddress?: string;
  types?: EventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserProfileActivityList = ({ userAddress, types, className }: UserProfileActivityListProps) => {
  const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  const [filteringTypes, setFilteringTypes] = useState<UserFeedEvent['type'][]>([]);

  const { result: activities, isLoading, fetchMore } = useUserActivity(filteringTypes, userAddress);

  const onChangeFilterDropdown = (checked: boolean, checkId: string) => {
    const newFilter = { ...filter };

    if (checkId === '') {
      setFilteringTypes([]);
      delete newFilter.types;
      setFilter(newFilter);
      return;
    }
    const selectedType = checkId as EventType;
    if (checked) {
      newFilter.types = [...filteringTypes, selectedType];
      setFilter(newFilter);
      setFilteringTypes(newFilter.types as UserFeedEvent['type'][]);
    } else {
      const _newTypes = [...filteringTypes].filter((item) => item !== selectedType);
      newFilter.types = _newTypes;
      setFilter(newFilter);
      setFilteringTypes(_newTypes as UserFeedEvent['type'][]);
    }
  };

  return (
    <div className={twMerge('min-h-[50vh]', negativeMargin, className)}>
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <FeedFilterDropdown
          selectedTypes={filteringTypes}
          onChange={onChangeFilterDropdown}
          options={FEED_FILTER_DEFAULT_OPTIONS}
        />
      </div>

      <div className="space-y-3 pointer-events-auto">
        {!isLoading && activities?.length === 0 ? <div className="font-heading">No results found</div> : null}

        {activities.length > 0 &&
          activities?.map((event, index) => {
            switch (event.type) {
              case EventType.NftListing:
              case EventType.NftOffer:
                return <NftOrderEvent key={`${event.orderItemId} ${index}`} event={event} />;
              case EventType.NftSale:
                return (
                  <NftSaleEvent
                    key={`${event.txHash}-${event.collectionAddress}-${event.tokenId}-${event.type}`}
                    event={event}
                  />
                );
              case EventType.TokensStaked:
              case EventType.TokensUnStaked:
              case EventType.TokensRageQuit:
                return <TokenStakeEvent key={`${event.txHash}-${event.type}`} event={event} />;
              case EventType.UserVote:
              case EventType.UserVoteRemoved:
                return <VoteEvent key={`${event.collectionAddress}-${event.timestamp}-${event.type}`} event={event} />;
              case EventType.NftTransfer:
                return <NftTransferEvent key={`${event.txHash}-${event.type}`} event={event} />;
              default:
                console.error(`Unhandled user event type: ${JSON.stringify(event, null, 2)}`);
                return <></>;
            }
          })}

        <div className="mt-8">
          {isLoading && (
            <CenteredContent>
              <Spinner />
            </CenteredContent>
          )}
        </div>

        <ScrollLoader
          onFetchMore={() => {
            fetchMore();
          }}
        />
      </div>
    </div>
  );
};
