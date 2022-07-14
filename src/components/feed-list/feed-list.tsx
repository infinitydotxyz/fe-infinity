import { useEffect, useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { apiGet } from 'src/utils';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { Button, ScrollLoader, Spacer } from '../common';
// import { CommentPanel } from '../feed/comment-panel';
import { NftEventRec } from '../asset/activity/activity-item';
import { useAppContext } from 'src/utils/context/AppContext';
import { FeedListItem } from './feed-list-item';
import { FilterButton } from './filter-button';
import { CommentPanel } from './comment-panel';

interface Props {
  collectionAddress: string;
  tokenId?: string;
  types?: EventType[];
  className?: string;
}

export const FeedList = ({ collectionAddress, tokenId, types, className = '' }: Props) => {
  const { chainId } = useAppContext();
  const [filter, setFilter] = useState<FeedFilter>({ collectionAddress, tokenId, types });
  const [commentPanelEvent, setCommentPanelEvent] = useState<NftEventRec | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<NftEventRec[]>([]);
  const [cursor, setCursor] = useState('');

  const allTypes = [
    EventType.NftSale,
    EventType.NftListing,
    EventType.CoinMarketCapNews,
    EventType.DiscordAnnouncement,
    EventType.NftTransfer,
    EventType.TwitterTweet,
    EventType.NftOffer
  ];

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
          limit: 10,
          eventType: filter.types || allTypes,
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

  if (!collectionAddress) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center mb-8">
        <div className="text-4xl">Feed</div>

        <Spacer />
        <Button className="mr-2" variant="outline" onClick={() => fetchActivity(true)}>
          Refresh
        </Button>
        <FilterButton filter={filter} onChange={(f) => setFilter(f)} />
      </div>

      {!isLoading && activities.length === 0 ? <div className="font-heading">No results found</div> : null}

      <div className="space-y-4">
        {activities.map((activity, idx) => {
          return (
            <div key={idx}>
              <FeedListItem
                activity={activity}
                onLike={(ev) => {
                  console.log(ev);
                }}
                onComment={(ev) => {
                  if (ev.id === commentPanelEvent?.id) {
                    setCommentPanelEvent(null);
                  } else {
                    setCommentPanelEvent(ev);
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

              <hr className="mt-6 mb-10 text-gray-100" />
            </div>
          );
        })}

        <ScrollLoader
          onFetchMore={async () => {
            fetchActivity(false, cursor);
          }}
        />
      </div>
    </div>
  );
};
