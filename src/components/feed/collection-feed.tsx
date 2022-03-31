import { FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';
import { useEffect, useState } from 'react';
import FeedItem, { FeedEvent } from './feed-item';
import { COLL_FEED, subscribe } from 'src/utils/firestore/firestoreUtils';

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
  console.log('temp', setFilter, filteredEvents);

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

  console.log('events', events);

  // const data: FeedEvent[] = [
  //   {
  //     id: 'ev1',
  //     type: FeedEventType.TwitterTweet,
  //     title: 'Title 1',
  //     likes: 0,
  //     comments: 0,
  //     timestamp: 0
  //   },
  //   {
  //     id: 'ev2',
  //     type: FeedEventType.TwitterTweet,
  //     title: 'Title 2',
  //     likes: 0,
  //     comments: 0,
  //     timestamp: 0
  //   }
  // ];

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
              <FeedItem data={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CollectionFeed;
