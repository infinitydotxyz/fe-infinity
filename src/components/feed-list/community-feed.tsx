import React from 'react';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
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
          types={[]}
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
    <div className={twMerge('grid lg:grid-cols-2 xl:grid-cols-3 gap-16 min-h-[50vh]', className)}>
      <div className="lg:col-span-1 xl:col-span-2">{content}</div>
      <div className="col-span-1">{collection && rightSide}</div>
    </div>
  );
};
