import { useEffect, useState } from 'react';
import { FeedItem, FeedEvent } from './feed-item';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { CommentPanel } from './comment-panel';
import { FeedEventType } from '@infinityxyz/lib/types/core/feed';
import { FeedFilterDropdown } from './feed-filter-dropdown';
import { ActivityItem } from './activity-item';
import { UserActivityItem } from './user-activity-item';
import { apiGet } from 'src/utils';
// import { useAppContext } from 'src/utils/context/AppContext';
import { FetchMore, Spinner } from '../common';

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
  types?: FeedEventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserProfileActivityList = ({
  userAddress,
  types,
  forActivity,
  forUserActivity,
  className
}: UserProfileActivityListProps) => {
  // const { user } = useAppContext();
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
  const [filteringTypes, setFilteringTypes] = useState<FeedEventType[]>([]);
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
    console.log('filteringTypes', filteringTypes);

    if (result?.hasNextPage === true) {
      setCursor(result?.cursor);
    }
    setHasNextPage(result?.hasNextPage);

    const moreData: FeedEvent[] = [];
    // convert UserActivityEvent[] to FeedEvent[] for rendering.
    result?.data?.map((activity: UserActivityEvent) => {
      moreData.push({
        ...activity,
        seller: activity.makerAddress ?? '',
        sellerDisplayName: activity.makerUsername === '_____' ? '' : activity.makerUsername ?? '',
        buyer: activity.takerAddress ?? '',
        buyerDisplayName: activity.takerUsername === '_____' ? '' : activity.takerUsername ?? '',
        price: activity.startPriceEth ?? 0
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
    const selectedType = checkId as FeedEventType;
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
    <div className={`min-h-[1024px] mt-[-66px] ${className}`}>
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
              value: 'listing'
            },
            {
              label: 'Offers',
              value: 'offer'
            },
            {
              label: 'Sales',
              value: 'sale'
            }
          ]}
        />
      </div>

      <ul className="space-y-8 pointer-events-auto">
        {isFetching && <Spinner />}

        {hasNextPage === false && data?.length === 0 ? <div>No results.</div> : null}

        {data?.map((event, idx) => {
          if (forActivity) {
            return <ActivityItem key={idx} event={event} />;
          }
          if (forUserActivity) {
            return <UserActivityItem key={idx} event={event} />;
          }
          return (
            <li key={idx} className="">
              <FeedItem
                data={event}
                onLike={(ev) => {
                  const foundEv = events.find((e) => e.id === ev.id);
                  if (foundEv?.likes !== undefined) {
                    foundEv.likes = foundEv.likes + 1;
                  }
                  setEvents([...events]);
                }}
                onComment={(ev) => {
                  if (ev.id === commentPanelEvent?.id) {
                    setCommentPanelEvent(null);
                  } else {
                    setCommentPanelEvent(ev);
                  }
                }}
              />
              {commentPanelEvent && event.id === commentPanelEvent.id && (
                <div className="ml-20 p-4 ">
                  <CommentPanel
                    contentOnly={true}
                    isOpen={!!commentPanelEvent}
                    event={commentPanelEvent}
                    onClose={() => {
                      setCommentPanelEvent(null);
                    }}
                  />
                </div>
              )}

              <hr className="mt-6 mb-10 text-gray-100" />
            </li>
          );
        })}

        {hasNextPage === true ? (
          <FetchMore
            data={data}
            onFetchMore={async () => {
              await fetchData();
            }}
          />
        ) : null}
      </ul>
    </div>
  );
};
