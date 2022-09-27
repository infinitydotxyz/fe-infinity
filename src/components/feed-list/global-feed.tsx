import React from 'react';
import { twMerge } from 'tailwind-merge';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { GlobalFeedList } from './global-feed-list';
import { TrendingSidebar } from './trending-sidebar';

interface Props {
  className?: string;
}

export const GlobalFeed = ({ className }: Props) => {
  // if (isLoading) {
  //   content = (
  //     <CenteredContent>
  //       <Spinner />
  //     </CenteredContent>
  //   );
  // } else {
  const content = (
    <div className="lg:col-span-1 xl:col-span-2">
      <GlobalFeedList
        types={[
          EventType.DiscordAnnouncement,
          EventType.TokensStaked,
          EventType.TwitterTweet,
          EventType.UserVote,
          EventType.NftListing,
          EventType.NftOffer
        ]}
      />
    </div>
  );
  // }

  const rightSide = (
    <div>
      <TrendingSidebar />
    </div>
  );

  return (
    <div className={twMerge('grid lg:grid-cols-2 xl:grid-cols-3 gap-16 min-h-[50vh]', className)}>
      <div className="lg:col-span-1 xl:col-span-2">{content}</div>
      <div className="col-span-1">{rightSide}</div>
    </div>
  );
};
