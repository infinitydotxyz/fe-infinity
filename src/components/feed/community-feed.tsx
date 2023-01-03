import React from 'react';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { FeedList } from './feed-list';
import { TwitterSupporterList } from './twitter-supporter-list';
import { TopHolderList } from './top-holder-list';
import { twMerge } from 'tailwind-merge';
import { globalEventTypes } from '../astra/astra-filter-popdown';

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
          types={globalEventTypes}
          collectionAddress={collection?.address ?? ''}
          collectionName={collection?.metadata.name ?? ''}
          collectionSlug={collection?.slug ?? ''}
          collectionProfileImage={collection?.metadata.profileImage ?? ''}
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
    <div className={twMerge('flex gap-10', className)}>
      <div className="w-2/3">{content}</div>
      <div className="w-1/3">{collection && rightSide}</div>
    </div>
  );
};
