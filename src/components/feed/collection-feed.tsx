import { useEffect, useState } from 'react';
import { FeedItem, FeedEvent } from './feed-item';
import { COLL_FEED, FeedFilter, subscribe } from 'src/utils/firestore/firestoreUtils';
import { CommentPanel } from './comment-panel';
import { FeedEventType } from '@infinityxyz/lib/types/core/feed';
import { Chip } from '../common';

// export const COLL_FEED = 'feed'; // collection: /feed - to store feed events
// const EVENTS_PER_PAGE = 10;
// const COMMENTS_PER_PAGE = 10;

let eventsInit = false;

interface CollectionFeedProps {
  collectionAddress?: string;
  type?: FeedEventType;
}

export function CollectionFeed({ collectionAddress, type }: CollectionFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<FeedFilter>({ collectionAddress, type });
  const [activeType, setActiveType] = useState<FeedEventType | ''>('');
  const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
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
    if (filter.type) {
      arr = events.filter((ev) => ev.type === filter.type);
    }
    setFilteredEvents(arr);
  }, [events]);

  const onClickFilterType = (type: FeedEventType | '') => {
    const newFilter = { ...filter };
    if (type) {
      newFilter.type = type;
    } else {
      delete newFilter.type;
    }
    setActiveType(type);
    setFilter(newFilter);
  };

  return (
    <div>
      <div className="flex mb-6">
        <Chip content={'All'} active={activeType === '' && true} onClick={() => onClickFilterType('')} />
        <Chip
          content={'Tweets'}
          active={activeType === FeedEventType.TwitterTweet && true}
          onClick={() => onClickFilterType(FeedEventType.TwitterTweet)}
        />
        <Chip
          content={'Sales'}
          active={activeType === FeedEventType.NftSale && true}
          onClick={() => onClickFilterType(FeedEventType.NftSale)}
        />
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
