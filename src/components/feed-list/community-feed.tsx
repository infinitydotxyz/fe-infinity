import React from 'react';
import { CenteredContent, Spinner } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { useFetch } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedList } from 'src/components/feed-list/feed-list';

export const CommunityFeed = () => {
  const { chainId } = useAppContext();
  const { result: collection, isLoading } = useFetch<BaseCollection>('/collections/boredapeyachtclub', { chainId });

  let content;
  if (isLoading) {
    content = (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  } else {
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
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-16">
      <div className="lg:col-span-1 xl:col-span-2">{content}</div>
      <div className="col-span-1">{collection && <CommunityRightPanel />}</div>
    </div>
  );
};
