import { Token } from '@infinityxyz/lib-frontend/types/core/Token';
import React, { useState } from 'react';
import {
  AFilterPopdown,
  FeedFilter,
  filterButtonDefaultOptions,
  shortEventTypes
} from 'src/components/astra/astra-filter-popdown';
import { CenteredContent, Spinner } from 'src/components/common';
import { apiGet } from 'src/utils';
import { ActivityItem, NftEventRec } from './activity-item';

interface Props {
  className?: string;
  chainId: string;
  collectionAddress: string;
  token: Token;
}

export const ActivityList: React.FC<Props> = ({ className = '', chainId, collectionAddress, token }) => {
  const [activityList, setActivityList] = useState<NftEventRec[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [filter, setFilter] = useState<FeedFilter>({ types: shortEventTypes });

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const types = filter.types ?? [];
    if (types.length !== 0) {
      const ACTIVITY_ENDPOINT = `/collections/${chainId}:${collectionAddress}/nfts/${token.tokenId}/activity`;

      const { result, error } = await apiGet(ACTIVITY_ENDPOINT, {
        query: { eventType: filter.types, limit: 50, source: filter.source }
      });
      if (!error) {
        if (result?.data && result?.data.length === 0) {
          setHasNoData(true);
        }
        setActivityList(result?.data || []);
      }
    } else {
      setActivityList([]);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    getActivityList();
  }, [chainId, collectionAddress, token, filter]);

  return (
    <div className={className}>
      <div className="flex items-center justify-end">
        <AFilterPopdown
          alignMenuRight={true}
          options={filterButtonDefaultOptions}
          filter={filter}
          onChange={(f) => {
            setFilter(f);
          }}
        />
      </div>

      {isLoading ? (
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      ) : null}

      {activityList.length > 0 ? (
        <div className="">
          {activityList.map((item, idx) => {
            return <ActivityItem key={item + '_' + idx} item={item} token={token} />;
          })}
        </div>
      ) : null}

      {hasNoData ? (
        <CenteredContent>
          <div className="text-sm">No Activity</div>
        </CenteredContent>
      ) : null}
    </div>
  );
};
