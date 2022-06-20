import { useEffect, useState } from 'react';
import { FeedEventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { apiGet } from 'src/utils';
import { FeedFilter, fetchMoreEvents } from 'src/utils/firestore/firestoreUtils';
import { ScrollLoader } from '../common';
// import { ActivityItem } from './activity-item';
import { CommentPanel } from './comment-panel';
import { FeedFilterDropdown } from './feed-filter-dropdown';
import { FeedEvent, FeedItem } from './feed-item';
import { ActivityItem, NftActivity } from '../asset/activity/activity-item';

// let eventsInit = false;

interface CollectionFeedProps {
  collectionAddress?: string;
  tokenId?: string;
  types?: FeedEventType[];
  forActivity?: boolean;
  className?: string;
}

export const CollectionFeed = ({ collectionAddress, tokenId, types, forActivity, className }: CollectionFeedProps) => {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<FeedFilter>({ collectionAddress, tokenId, types });
  // const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
  const [filteringTypes, setFilteringTypes] = useState<FeedEventType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<NftActivity[] | null>(null);

  if (forActivity && !collectionAddress) {
    return null; // require collectionAddress
  }

  const fetchActivity = async () => {
    setIsLoading(true);
    const { result, error } = await apiGet(`/collections/1:${collectionAddress}/nfts/${tokenId}/activity`, {
      // const { result } = await apiGet(`/collections/1:0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/nfts/8880/activity`, {
      query: {
        limit: 50,
        eventType: ['sale', 'listing', 'offer']
      }
    });
    setIsLoading(false);
    if (!error) {
      setActivities(result?.data);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  // const getEvents = () => {
  //   try {
  //     subscribe(COLL_FEED, filter, (type: string, data: FeedEvent) => {
  //       if (type === 'added') {
  //         if (eventsInit === false) {
  //           setEvents((currentEvents) => [data, ...currentEvents].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))); // add initial feed events.
  //           setTimeout(() => {
  //             eventsInit = true;
  //           }, 3000);
  //         } else {
  //           setNewEvents((currentEvents) =>
  //             [data, ...currentEvents].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  //           );
  //         }
  //       } else {
  //         setEvents((currentEvents) => [...currentEvents, data].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)));
  //       }
  //     });
  //   } catch (err) {
  //     console.error('ERR: ', err);
  //   }
  // };

  // useEffect(() => {
  //   eventsInit = false;
  //   setEvents([]);
  //   setNewEvents([]);
  //   getEvents();
  // }, [filter]);

  // useEffect(() => {
  //   let arr = events;
  //   if (filter.types) {
  //     arr = events.filter((event) => (filter.types ?? []).indexOf(event?.type as FeedEventType) >= 0);
  //   }
  //   setFilteredEvents(arr);
  // }, [events]);

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
    <div className={`min-h-[1024px] ${className}`}>
      <div className="flex justify-between mt-[-66px] mb-6">
        <div className="text-3xl mb-6">&nbsp;</div>
        <FeedFilterDropdown selectedTypes={filteringTypes} onChange={onChangeFilterDropdown} />
      </div>

      {!isLoading && activities && activities.length === 0 ? (
        <div className="font-heading">No data available.</div>
      ) : null}

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
          (activities || []).map((act: NftActivity, idx) => {
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
            const data: FeedEvent[] = (await fetchMoreEvents(filter)) as FeedEvent[];
            console.log('data', data);
            setEvents([...events, ...data]);
          }}
        />
      </ul>
    </div>
  );
};
