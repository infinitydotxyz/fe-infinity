import React from 'react';
import { useRouter } from 'next/router';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { PageBox } from 'src/components/common';
import { TwitterSupporterList } from 'src/components/collection/twitter-supporter-list';
import { TopHolderList } from 'src/components/collection/top-holder-list';
import { useAppContext } from 'src/utils/context/AppContext';
import { useFetch } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';

const FeedPage = () => {
  const { chainId } = useAppContext();
  const { result: collection, isLoading } = useFetch<BaseCollection>('/collections/goerli-doodles', { chainId });

  const {
    query: { name }
  } = useRouter();

  // name not used lint error fix
  console.log(name);

  let content;
  if (isLoading) {
    content = <div>loading</div>;
  } else {
    if (collection) {
      content = (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-16">
          <div className="lg:col-span-1 xl:col-span-2">
            <div>**** CollectionFeed</div>
            <CollectionFeed
              className="md:w-2/3 sm:w-full"
              forActivity={true}
              types={[
                EventType.NftSale,
                EventType.CoinMarketCapNews,
                EventType.DiscordAnnouncement,
                EventType.NftListing,
                EventType.NftOffer,
                EventType.NftTransfer,
                EventType.TwitterTweet
              ]}
              collectionAddress={collection?.address ?? ''}
            />{' '}
          </div>

          <div>
            <div>**** CommunityRightPanel</div>
            <div className="col-span-1">{collection && <CommunityRightPanel collection={collection} />}</div>
          </div>
        </div>
      );
    }
  }

  return (
    <PageBox title="Home">
      <div className="flex">
        <div className="ml-4 md:w-1/3 sm:w-full">
          <div className="text-3xl mb-6">Trending</div>
          <div>Trending Component</div>
        </div>
      </div>

      <div>**** TwitterSupporterList</div>
      <TwitterSupporterList />
      <div>**** TopHolderList</div>
      <TopHolderList />

      {content}
    </PageBox>
  );
};

export default FeedPage;
