import { useEffect, useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { apiGet, getTypesForFilter } from 'src/utils';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { Chip, ScrollLoader, Spacer } from '../common';
import { NftEventRec } from '../asset/activity/activity-item';
import { FilterButton } from './filter-button';
import { CommentPanel } from './comment-panel';
import { FeedListItem } from './feed-list-item';

interface Props {
  types?: EventType[];
  className?: string;
  compact?: boolean;
}

export const GlobalFeedList = ({ types, className = '', compact = false }: Props) => {
  const [filter, setFilter] = useState<FeedFilter>({ types });
  const [commentPanelEvent, setCommentPanelEvent] = useState<NftEventRec | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<NftEventRec[]>([]);
  const [cursor, setCursor] = useState('');

  const fetchActivity = async (isRefresh = false, fromCursor = '') => {
    try {
      setIsLoading(true);
      const url = '/feed/activity';

      const { result, error } = await apiGet(url, {
        query: {
          limit: compact ? 5 : 20,
          eventType: getTypesForFilter(filter),
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

  return (
    <div className={`${className}`}>
      {!compact && (
        <div className="flex items-center mb-8">
          <Spacer />
          <Chip content={'Refresh'} onClick={() => fetchActivity(true)} />

          <FilterButton className="ml-2" filter={filter} onChange={(f) => setFilter(f)} />
        </div>
      )}

      {!isLoading && activities.length === 0 ? <div className="font-heading">No results found</div> : null}

      <div className="space-y-4">
        {activities.map((activity, idx) => {
          // console.log(JSON.stringify(activity, null, 2));
          return (
            <div key={idx}>
              <FeedListItem
                collectionName={activity.collectionName}
                collectionSlug={activity.collectionSlug}
                collectionProfileImage={activity.image}
                activity={activity}
                onComment={(ev) => {
                  if (!ev) {
                    // using the up arrow thing to close the chat?  not sure what it's for
                    setCommentPanelEvent(null);
                  } else {
                    if (ev.id === commentPanelEvent?.id) {
                      setCommentPanelEvent(null);
                    } else {
                      setCommentPanelEvent(ev);
                    }
                  }
                }}
              />

              {commentPanelEvent && commentPanelEvent.id === activity.id && (
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

              {/* <hr className="mt-6 mb-10 text-gray-100" /> */}
            </div>
          );
        })}

        {!compact && (
          <ScrollLoader
            onFetchMore={() => {
              fetchActivity(false, cursor);
            }}
          />
        )}
      </div>
    </div>
  );
};
