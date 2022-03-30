import React from 'react';
import { ActivityItem } from './activity-item';

interface ActivityListPropType {
  className?: string;
}

export const ActivityList: React.FC<ActivityListPropType> = ({ className = '' }: ActivityListPropType) => {
  return (
    <div className={className}>
      {[0, 1, 2, 3, 4].map((item) => {
        return <ActivityItem key={item} />;
      })}
    </div>
  );
};
