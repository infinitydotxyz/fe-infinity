import React from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { twMerge } from 'tailwind-merge';
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
          EventType.NftSale,
          EventType.NftOffer,
          EventType.CoinMarketCapNews,
          EventType.DiscordAnnouncement,
          EventType.NftListing,
          EventType.NftTransfer,
          EventType.TwitterTweet
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
