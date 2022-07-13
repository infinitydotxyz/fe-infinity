import React, { useState } from 'react';
import { apiGet } from 'src/utils';
import { ActivityItem } from './activity-item';
import { CenteredContent, Spinner } from 'src/components/common';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedFilterDropdown } from 'src/components/feed/feed-filter-dropdown';

interface ActivityListPropType {
  className?: string;
  chainId: string;
  collectionAddress: string;
  tokenId: string;
}
type EventTypeOptions = EventType | '';

export const ActivityList: React.FC<ActivityListPropType> = ({
  className = '',
  chainId,
  collectionAddress,
  tokenId
}: ActivityListPropType) => {
  const [activityTypes, setActivityTypes] = useState<EventTypeOptions[]>([EventType.NftSale]);
  const [activityList, setActivityList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);

  // { query: { eventType: 'sale', limit: 50 } }

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);
    const ACTIVITY_ENDPOINT = `/collections/${chainId}:${collectionAddress}/nfts/${tokenId}/activity`;
    const queryTypes = activityTypes.filter((item) => item !== '');
    const { result, error } = await apiGet(ACTIVITY_ENDPOINT, {
      query: { eventType: queryTypes, limit: 50 }
    });
    setIsLoading(false);
    if (!error) {
      if (result?.data && result?.data.length === 0) {
        setHasNoData(true);
      }
      setActivityList(result?.data || []);
    }
  };

  React.useEffect(() => {
    if (activityTypes.length === 0) {
      setActivityList([]);
    } else {
      getActivityList();
    }
  }, [chainId, collectionAddress, tokenId, activityTypes]);

  const handleChange = (checked: boolean, checkId: string) => {
    const curType = checkId as EventType;
    if (checkId === '') {
      if (checked === true) {
        setActivityTypes(['', EventType.NftSale, EventType.NftOffer, EventType.NftListing]);
      } else {
        setActivityTypes([]);
      }
      return;
    }
    let newTypes = [];
    if (checked) {
      newTypes = [...activityTypes, curType];
    } else {
      const _activityTypes = [...activityTypes];
      const index = activityTypes.indexOf(curType);
      if (index > -1) {
        _activityTypes.splice(index, 1);
      }
      newTypes = _activityTypes;
    }
    setActivityTypes(newTypes);
  };

  return (
    <div className={className}>
      <div className="mt-4 md:mt-8">
        <div className="flex items-center justify-between">
          <p className="mt-4 sm:mt-6 sm:mb-4 font-body tracking-base text-black font-bold">&nbsp;</p>
          <FeedFilterDropdown selectedTypes={activityTypes} onChange={handleChange} autoCheckAll={false} />
        </div>
      </div>

      {isLoading ? (
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      ) : null}

      {activityList.length > 0 ? (
        <div className="mt-6">
          {activityList.map((item, idx) => {
            return <ActivityItem key={item + '_' + idx} item={item} />;
          })}
        </div>
      ) : null}

      {hasNoData ? (
        <div className="bg-gray-100 px-6 sm:px-6 md:px-8 lg:px-16 mt-6 md:pt-11 md:pb-11 rounded-3xl text-center font-heading">
          No Activity
        </div>
      ) : null}
    </div>
  );
};
