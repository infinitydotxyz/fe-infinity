import { useEffect, useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { apiGet } from 'src/utils';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { ScrollLoader } from '../common';
// import { ActivityItem } from './activity-item';
import { CommentPanel } from './comment-panel';
import { FeedFilterDropdown } from './feed-filter-dropdown';
import { FeedEvent, FeedItem } from './feed-item';
import { ActivityItem, NftActivity } from '../asset/activity/activity-item';
import { useAppContext } from 'src/utils/context/AppContext';

// let eventsInit = false;

interface CollectionFeedProps {
  collectionAddress?: string;
  tokenId?: string;
  types?: EventType[];
  forActivity?: boolean;
  className?: string;
}

export const CollectionFeed = ({ collectionAddress, tokenId, types, forActivity, className }: CollectionFeedProps) => {
  const { chainId } = useAppContext();
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<FeedFilter>({ collectionAddress, tokenId, types });
  // const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
  const [filteringTypes, setFilteringTypes] = useState<EventType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<NftActivity[]>([]);
  const [cursor, setCursor] = useState('');

  const fetchActivity = async (isRefresh = false, fromCursor = '') => {
    if (!collectionAddress) {
      return;
    }

    try {
      setIsLoading(true);
      const url = tokenId
        ? `/collections/${chainId}:${collectionAddress}/nfts/${tokenId}/activity`
        : `/collections/${chainId}:${collectionAddress}/activity`;
      const { result, error } = await apiGet(url, {
        query: {
          limit: 50,
          eventType: filter.types || ['sale', 'listing', 'offer'],
          cursor: fromCursor
        }
      });

      if (!error && result) {
        if (isRefresh) {
          setActivities([...result.data]);
        } else {
          setActivities([...activities, ...result.data]);
        }
        setCursor(result?.cursor);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity(true);
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

  if (forActivity && !collectionAddress) {
    return null; // require collectionAddress
  }

  return (
    <div className={`min-h-[1024px] ${className}`}>
      <div className="flex justify-between mt-[-66px] mb-6">
        <div className="text-3xl mb-6">&nbsp;</div>
        <FeedFilterDropdown
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
          selectedTypes={filteringTypes}
          onChange={onChangeFilterDropdown}
        />
      </div>

      {!isLoading && activities.length === 0 ? <div className="font-heading">No data available.</div> : null}

      {newEvents.length > 0 ? (
        <div
          //  w-1/3 sm:w-full
          className="py-4 px-8 border rounded-3xl border-gray-200 hover:bg-gray-100 mb-8 cursor-pointer"
          onClick={() => {
            setEvents((currentEvents) => [...newEvents, ...currentEvents]);
            setNewEvents([]);
          }}
        >
          Show {newEvents.length} more event{newEvents.length === 1 ? '' : 's'}.
        </div>
      ) : null}

      <ul className="space-y-4">
        {forActivity &&
          activities.map((act: NftActivity, idx) => {
            return <ActivityItem key={idx} item={act} />;
          })}

        {events.map((event, idx) => {
          if (forActivity) {
            // return <ActivityItem key={idx} event={event} />;
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

        <ScrollLoader
          onFetchMore={async () => {
            fetchActivity(false, cursor);
          }}
        />
      </ul>
    </div>
  );
};
