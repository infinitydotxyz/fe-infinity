import { FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';
import { useEffect, useState } from 'react';
import { FeedItem, FeedEvent } from './feed-item';
import { COLL_FEED, subscribe } from 'src/utils/firestore/firestoreUtils';
import { CommentPanel } from './comment-panel';

// export const COLL_FEED = 'feed'; // collection: /feed - to store feed events
// const EVENTS_PER_PAGE = 10;
// const COMMENTS_PER_PAGE = 10;

type Filter = {
  type?: FeedEventType;
};
let eventsInit = false;

export function CollectionFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<Filter>({});
  const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
  console.log('', typeof setFilter, filteredEvents);

  async function getEvents() {
    try {
      subscribe(COLL_FEED, filter, (type: string, data: FeedEvent) => {
        // console.log('--- change: ', type, data);
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
    getEvents();
  }, [filter]);

  useEffect(() => {
    let arr = events;
    if (filter.type) {
      arr = events.filter((ev) => ev.type === filter.type);
    }
    setFilteredEvents(arr);
  }, [events]);

  return (
    <div>
      <div className="text-3xl mb-6">Feed</div>

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
