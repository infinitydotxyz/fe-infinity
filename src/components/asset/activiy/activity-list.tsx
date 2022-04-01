import React, { useState } from 'react';
import { apiGet } from 'src/utils';
import { ActivityItem } from './activity-item';
import { Filter } from 'src/components/asset';

interface ActivityListPropType {
  className?: string;
  chainId: string;
  collectionAddress: string;
  tokenId: string;
}

export enum ACTIVITY_FILTER_TYPE {
  Sale = 'sale',
  Transfer = 'transfer',
  Offer = 'offer'
}

export const ActivityList: React.FC<ActivityListPropType> = ({
  className = '',
  chainId,
  collectionAddress,
  tokenId
}: ActivityListPropType) => {
  const [filters, setFilters] = useState<ACTIVITY_FILTER_TYPE[]>([ACTIVITY_FILTER_TYPE.Sale]);
  const [activityList, setActivityList] = useState([]);

  // { query: { eventType: 'sale', limit: 50 } }

  const getActivityList = async () => {
    const ACTIVITY_ENDPOINT = `/collections/${chainId}:${collectionAddress}/nfts/${tokenId}/activity`;
    const { result, error } = await apiGet(ACTIVITY_ENDPOINT, {
      query: { eventType: filters, limit: 50 }
    });
    if (!error) {
      setActivityList(result?.data || []);
    }
  };

  React.useEffect(() => {
    if (filters.length === 0) {
      setActivityList([]);
    } else {
      getActivityList();
    }
  }, [chainId, collectionAddress, tokenId, filters]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as ACTIVITY_FILTER_TYPE;
    if (event.target.checked) {
      setFilters([...filters, name]);
    } else {
      const index = filters.indexOf(name);
      const _filters = [...filters];
      if (index > -1) {
        _filters.splice(index, 1);
      }
      setFilters(_filters);
    }
  };

  return (
    <div className={className}>
      <div className="mt-4 md:mt-8">
        <div className="flex items-center justify-between">
          <p className="mt-4 sm:mt-6 sm:mb-4 font-body tracking-base text-black">Activity</p>
          <Filter filters={filters} onChange={handleChange} />
        </div>
      </div>
      {activityList.length > 0 &&
        activityList.map((item) => {
          return <ActivityItem key={item} />;
        })}
      {activityList.length === 0 && (
        <div className=" bg-theme-light-300 px-6 sm:px-6 md:px-8 lg:px-16 -mx-1 my-2 sm:my-4 py-5 md:py-4 md:pt-12 md:pb-14 rounded-3xl text-center">
          No History
        </div>
      )}
    </div>
  );
};
