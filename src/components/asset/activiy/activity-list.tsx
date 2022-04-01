import React from 'react';
import { ActivityItem } from './activity-item';
import { Filter } from 'src/components/asset';

interface ActivityListPropType {
  className?: string;
}

export const ActivityList: React.FC<ActivityListPropType> = ({ className = '' }: ActivityListPropType) => {
  return (
    <div className={className}>
      <div className="mt-4 md:mt-8">
        <div className="flex items-center justify-between">
          <p className="mt-4 sm:mt-6 sm:mb-4 font-body tracking-base text-black">Activity</p>
          <Filter />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((item) => {
        return <ActivityItem key={item} />;
      })}
    </div>
  );
};
