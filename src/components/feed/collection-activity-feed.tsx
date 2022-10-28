import { useEffect, useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { apiGet } from 'src/utils';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { ScrollLoader } from '../common';
import { ActivityItem, NftEventRec } from '../asset/activity/activity-item';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

interface Props {
  collectionAddress?: string;
  tokenId?: string;
  types?: EventType[];
  className?: string;
}

export const CollectionActivityFeed = ({
  collectionAddress,
  tokenId,
  types = [EventType.NftSale],
  className = ''
}: Props) => {
  const { chainId } = useOnboardContext();
  const [filter] = useState<FeedFilter>({ collectionAddress, tokenId, types });

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<NftEventRec[]>([]);
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
          eventType: filter.types || [
            EventType.NftSale,
            EventType.NftListing,
            EventType.NftOffer,
            EventType.TokensStaked,
            EventType.UserVote,
            EventType.NftTransfer
          ],
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
    return null; // require collectionAddress
  }

  return (
    <div className={`min-h-[50vh] ${className}`}>
      {!isLoading && activities.length === 0 ? <div className="font-heading">No results found</div> : null}

      <ul className="space-y-4">
        {activities.map((act: NftEventRec, idx) => {
          return <ActivityItem key={idx} item={act} />;
        })}

        <ScrollLoader
          onFetchMore={() => {
            fetchActivity(false, cursor);
          }}
        />
      </ul>
    </div>
  );
};
