import { useEffect, useState } from 'react';
import { FeedItem, FeedEvent } from './feed-item';
import { COLL_FEED, FeedFilter, subscribe } from 'src/utils/firestore/firestoreUtils';
import { CommentPanel } from './comment-panel';
import { FeedEventType } from '@infinityxyz/lib/types/core/feed';
import { FeedFilterDropdown } from './feed-filter-dropdown';
import { ActivityItem } from './activity-item';
import { UserActivityItem } from './user-activity-item';

let eventsInit = false;

interface UserProfileFeedProps {
  header: string;
  userAddress?: string;
  types?: FeedEventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserProfileFeed = ({
  header,
  userAddress,
  types,
  forActivity,
  forUserActivity,
  className
}: UserProfileFeedProps) => {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null);
  const [filteringTypes, setFilteringTypes] = useState<FeedEventType[]>([]);

  const getEvents = () => {
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
      console.error('ERR: ', err);
    }
  };

  useEffect(() => {
    eventsInit = false;
    setEvents([]);
    setNewEvents([]);
    getEvents();
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
    <div className={`min-h-[1024px] ${className}`}>
      <div className="flex justify-between">
        <div className="text-3xl mb-6">{header}</div>
        <FeedFilterDropdown selectedTypes={filteringTypes} onChange={onChangeFilterDropdown} />
      </div>

      {newEvents.length > 0 ? (
        <div
          //  w-1/3 sm:w-full
          className="p-4 border border-gray-200 hover:bg-gray-100 mb-4 cursor-pointer"
          onClick={() => {
            setEvents((currentEvents) => [...newEvents, ...currentEvents]);
            setNewEvents([]);
          }}
        >
          Show {newEvents.length} more events.
        </div>
      ) : null}

      <ul className="space-y-8">
        {events.map((event, idx) => {
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
      </ul>
    </div>
  );
};
