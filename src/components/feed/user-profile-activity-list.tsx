import { useEffect, useState } from 'react';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { BaseFeedEvent, EventType, ExchangeEvent } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedFilterDropdown } from './feed-filter-dropdown';
import { UserActivityItem } from './user-activity-item';
import { apiGet } from 'src/utils';
import { CenteredContent, ScrollLoader, Spinner } from '../common';

export type FeedEvent = BaseFeedEvent &
  ExchangeEvent & {
    id?: string;
    type?: EventType;
    title?: string;
    text?: string;
    userDisplayName?: string;
  };

type UserActivityEvent = FeedEvent & {
  makerAddress?: string;
  makerUsername?: string;
  takerAddress?: string;
  takerUsername?: string;
  usersInvolved?: string[];
  startPriceEth?: number;
};
const ITEMS_LIMIT = 10;

interface UserProfileActivityListProps {
  userAddress?: string;
  types?: EventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserProfileActivityList = ({ userAddress, types, className }: UserProfileActivityListProps) => {
  const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  const [filteringTypes, setFilteringTypes] = useState<EventType[]>([]);
  const [data, setData] = useState<FeedEvent[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    let newCursor = cursor;
    if (isRefresh) {
      newCursor = '';
    }

    const { result } = await apiGet(`/user/${userAddress}/activity`, {
      query: {
        limit: ITEMS_LIMIT,
        cursor: newCursor,
        events: filteringTypes
      }
    });

    if (result?.hasNextPage === true) {
      setCursor(result?.cursor);
    }
    setHasNextPage(result?.hasNextPage);

    const moreData: FeedEvent[] = [];
    // convert UserActivityEvent[] to FeedEvent[] for rendering.
    result?.data?.map((act: UserActivityEvent) => {
      moreData.push({
        ...act,
        seller: act.seller ?? act.makerAddress ?? '',
        sellerDisplayName: act.sellerDisplayName ?? act.makerUsername === '_____' ? '' : act.makerUsername ?? '',
        buyer: act.buyer ?? act.takerAddress ?? '',
        buyerDisplayName: act.buyerDisplayName ?? act.takerUsername === '_____' ? '' : act.takerUsername ?? '',
        price: act.price ?? act.startPriceEth ?? 0
      });
    });

    setIsFetching(false);
    if (isRefresh) {
      setData([...moreData]);
    } else {
      setData([...data, ...moreData]);
    }
  };

  useEffect(() => {
    setData([]);
    fetchData(true);
  }, [filter]);

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
      setFilteringTypes(newFilter.types);
    } else {
      const _newTypes = [...filteringTypes];
      const index = filteringTypes.indexOf(selectedType);
      if (index >= 0) {
        _newTypes.splice(index, 1);
      }
      newFilter.types = _newTypes;
      setFilter(newFilter);
      setFilteringTypes(_newTypes);
    }
  };

  return (
    <div className={`min-h-[50vh] mt-[-74px] ${className}`}>
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <FeedFilterDropdown
          selectedTypes={filteringTypes}
          onChange={onChangeFilterDropdown}
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
            }
          ]}
        />
      </div>

      <ul className="space-y-4 pointer-events-auto">
        {isFetching && (
          <div className="mt-8">
            <CenteredContent>
              <Spinner />
            </CenteredContent>
          </div>
        )}

        {!isFetching && hasNextPage === false && data?.length === 0 ? (
          <div className="font-heading">No results found</div>
        ) : null}

        {!isFetching &&
          data?.map((event, idx) => {
            return <UserActivityItem key={idx} event={event} />;
          })}

        {hasNextPage === true ? (
          <ScrollLoader
            onFetchMore={async () => {
              await fetchData();
            }}
          />
        ) : null}
      </ul>
    </div>
  );
};
