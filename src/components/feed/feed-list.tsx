import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { Button, CenteredContent, ScrollLoader, Spacer } from '../common';
// import { CommentPanel } from '../feed/comment-panel';
import { IoMdRefresh } from 'react-icons/io';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { NftEventRec } from '../asset/activity/activity-item';
import { AFilterPopdown, FeedFilter, filterButtonDefaultOptions } from '../astra/astra-filter-popdown';
import { FeedListItem } from './feed-list-item';

interface Props {
  collectionAddress: string;
  tokenId?: string;
  types: EventType[];
  className?: string;
  collectionName?: string;
  collectionSlug?: string;
  collectionProfileImage?: string;
}

export const FeedList = ({
  collectionAddress,
  tokenId,
  collectionName,
  collectionSlug,
  types,
  collectionProfileImage,
  className = ''
}: Props) => {
  const { chainId } = useOnboardContext();
  const [filter, setFilter] = useState<FeedFilter>({ collectionAddress, tokenId, types });
  const [commentPanelEvent, setCommentPanelEvent] = useState<NftEventRec | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<NftEventRec[]>([]);
  const [cursor, setCursor] = useState('');

  const fetchActivity = async (isRefresh = false, fromCursor = '') => {
    if (!collectionAddress) {
      return;
    }

    try {
      setIsLoading(true);

      const types = filter.types ?? [];
      if (types?.length > 0) {
        const url = tokenId
          ? `/collections/${chainId}:${collectionAddress}/nfts/${tokenId}/activity`
          : `/collections/${chainId}:${collectionAddress}/activity`;

        const { result, error } = await apiGet(url, {
          query: {
            limit: 20,
            eventType: filter.types,
            cursor: fromCursor,
            source: filter.source
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
      } else {
        setActivities([]);
        setCursor('');
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

  if (!collectionAddress) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center mb-8">
        <div className="text-4xl">Feed</div>

        <Spacer />
        <Button className="mr-3 hover:scale-110" variant="roundBorder" size="small" onClick={() => fetchActivity(true)}>
          {isLoading ? <IoMdRefresh className={iconButtonStyle} /> : <IoMdRefresh className={iconButtonStyle} />}
        </Button>

        <AFilterPopdown
          options={filterButtonDefaultOptions}
          filter={filter}
          onChange={(f) => {
            setFilter(f);
          }}
        />
      </div>

      {!isLoading && activities.length === 0 ? (
        <CenteredContent>
          <div className="text-sm">No results found</div>
        </CenteredContent>
      ) : null}

      <div className="space-y-4">
        {activities.map((activity) => {
          return (
            <div key={activity.id}>
              <FeedListItem
                collectionName={collectionName}
                collectionSlug={collectionSlug}
                collectionProfileImage={collectionProfileImage}
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
            </div>
          );
        })}

        <ScrollLoader
          onFetchMore={() => {
            fetchActivity(false, cursor);
          }}
        />
      </div>
    </div>
  );
};
