import { useEffect, useState } from 'react';
import { FeedItem, FeedEvent } from './feed-item';
import { COLL_FEED, FeedFilter, subscribe } from 'src/utils/firestore/firestoreUtils';
import { CommentPanel } from './comment-panel';
import { FeedEventType } from '@infinityxyz/lib/types/core/feed';
import { FeedFilterDropdown } from './feed-filter-dropdown';

let eventsInit = false;

interface CollectionFeedProps {
  collectionAddress?: string;
  types?: FeedEventType[];
}

export function CollectionFeed({ collectionAddress, types }: CollectionFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<FeedFilter>({ collectionAddress, types });
  const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
  const [filteringTypes, setFilteringTypes] = useState<FeedEventType[]>([]);
  console.log('', typeof setFilter, filteredEvents);

  async function getEvents() {
    try {
      subscribe(COLL_FEED, filter, (type: string, data: FeedEvent) => {
        if (type === 'added') {
          if (eventsInit === false) {
            setEvents((currentEvents) => [data, ...currentEvents]); // add initial feed events.
            setTimeout(() => {
              eventsInit = true;
            }, 3000);
          } else {
            setNewEvents((currentEvents) => [data, ...currentEvents]);
          }
        } else {
          setEvents((currentEvents) => [...currentEvents, data]);
        }
      });
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  useEffect(() => {
    eventsInit = false;
    setEvents([]);
    setNewEvents([]);
    getEvents();
  }, [filter]);

  useEffect(() => {
    let arr = events;
    if (filter.types) {
      arr = events.filter((event) => (filter.types ?? []).indexOf(event?.type as FeedEventType) >= 0);
    }
    setFilteredEvents(arr);
  }, [events]);

  const onChangeFilterDropdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter };

    if (event.target.name === '') {
      setFilteringTypes([]);
      delete newFilter.types;
      setFilter(newFilter);
      return;
    }
    const selectedType = event.target.name as FeedEventType;
    if (event.target.checked) {
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
  console.log('filteringTypes', filteringTypes);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-3xl mb-6">Feed</div>
        <FeedFilterDropdown selectedTypes={filteringTypes} onChange={onChangeFilterDropdown} />
      </div>

      {newEvents.length > 0 ? (
        <div
          className="p-4 border border-gray-200 hover:bg-gray-100 mb-4 cursor-pointer w-1/3"
          onClick={() => {
            setEvents((currentEvents) => [...newEvents, ...currentEvents]);
            setNewEvents([]);
          }}
        >
          Show {newEvents.length} more events.
        </div>
      ) : null}

      <ul className="space-y-8">
        {events.map((item, idx) => {
          return (
            <li key={idx} className="">
              <FeedItem
                data={item}
                onLike={(ev) => {
                  const foundEv = events.find((e) => e.id === ev.id);
                  if (foundEv?.likes !== undefined) {
                    foundEv.likes = foundEv.likes + 1;
                  }
                  setEvents([...events]);
                }}
                onComment={(ev) => setCommentPanelEvent(ev)}
              />
              <hr className="mt-6 mb-10 text-gray-100" />
            </li>
          );
        })}
      </ul>

      {commentPanelEvent && (
        <CommentPanel
          isOpen={!!commentPanelEvent}
          event={commentPanelEvent}
          onClose={() => {
            setCommentPanelEvent(null);
          }}
        />
      )}
    </div>
  );
}
