import { useEffect, useState } from 'react';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { EventType, UserFeedEvent } from '@infinityxyz/lib-frontend/types/core/feed';
import { DEFAULT_OPTIONS, FeedFilterDropdown } from './feed-filter-dropdown';
import { CenteredContent, ScrollLoader, Spinner } from '../common';
import { useUserActivity } from 'src/hooks/api/useUserActivity';
import { NftOrder } from './user-feed-events/nft-order';
import { NftSale } from './user-feed-events/nft-sale';

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

  const { result: activities, error, isLoading, fetchMore } = useUserActivity(filteringTypes, userAddress);

  useEffect(() => {
    console.error(error);
  }, [error]);

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
      const _newTypes = [...filteringTypes];
      const index = filteringTypes.indexOf(selectedType as UserFeedEvent['type']);
      if (index >= 0) {
        _newTypes.splice(index, 1);
      }
      newFilter.types = _newTypes;
      setFilter(newFilter);
      setFilteringTypes(_newTypes as UserFeedEvent['type'][]);
    }
  };

  return (
    <div className={`min-h-[50vh] mt-[-74px] ${className}`}>
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <FeedFilterDropdown
          selectedTypes={filteringTypes}
          onChange={onChangeFilterDropdown}
          options={DEFAULT_OPTIONS}
        />
      </div>

      <ul className="space-y-4 pointer-events-auto">
        {!isLoading && activities?.length === 0 ? <div className="font-heading">No results found</div> : null}

        {activities.length > 0 &&
          activities?.map((event) => {
            switch (event.type) {
              case EventType.NftListing:
              case EventType.NftOffer:
                return <NftOrder key={`${event.type}-${event.timestamp}`} event={event} />;
              case EventType.NftSale:
                return <NftSale key={`${event.type}-${event.timestamp}`} event={event} />;
              case EventType.TokensStaked:
              case EventType.TokensUnStaked:
              case EventType.TokensRageQuit:
              case EventType.UserVote:
              case EventType.UserVoteRemoved:
              case EventType.NftTransfer:
                // return <UserActivityItem key={`${event.type}-${event.timestamp}`} event={event} />;
                return <></>;
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
            console.log('Fetching more');
            fetchMore();
          }}
        />
      </ul>
    </div>
  );
};
