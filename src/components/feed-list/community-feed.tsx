import React from 'react';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedList } from 'src/components/feed-list/feed-list';
import { TwitterSupporterList } from './twitter-supporter-list';
import { TopHolderList } from './top-holder-list';
import { twMerge } from 'tailwind-merge';

interface Props {
  collection: BaseCollection;
  className?: string;
}

export const CommunityFeed = ({ collection, className }: Props) => {
  let content;
  // if (isLoading) {
  //   content = (
  //     <CenteredContent>
  //       <Spinner />
  //     </CenteredContent>
  //   );
  // } else {
  if (collection) {
    content = (
      <div className="lg:col-span-1 xl:col-span-2">
        <FeedList
          types={[
            EventType.NftSale,
            EventType.NftOffer
            // EventType.CoinMarketCapNews
            // EventType.DiscordAnnouncement
            // EventType.NftListing
            // EventType.NftTransfer
            // EventType.TwitterTweet
          ]}
          collectionAddress={collection?.address ?? ''}
        />
      </div>
    );
  }
  // }

  const rightSide = (
    <div>
      <TwitterSupporterList collection={collection} />
      <TopHolderList collection={collection} />
    </div>
  );

  return (
    <div className={twMerge('grid lg:grid-cols-2 xl:grid-cols-3 gap-16', className)}>
      <div className="lg:col-span-1 xl:col-span-2">{content}</div>
      <div className="col-span-1">{collection && rightSide}</div>
    </div>
  );
};
