import React from 'react';
import { twMerge } from 'tailwind-merge';
import { GlobalFeedList } from './global-feed-list';
import { TrendingSidebar } from './trending-sidebar';
import { globalEventTypes } from './filter-popdown';

interface Props {
  className?: string;
}

export const GlobalFeed = ({ className }: Props) => {
  const content = (
    <div className="lg:col-span-1 xl:col-span-2">
      <GlobalFeedList types={globalEventTypes} />
    </div>
  );

  const rightSide = (
    <div>
      <TrendingSidebar />
    </div>
  );

  return (
    <div className={twMerge('flex gap-10', className)}>
      <div className="w-2/3">{content}</div>
      <div className="w-1/3">{rightSide}</div>
    </div>
  );
};
