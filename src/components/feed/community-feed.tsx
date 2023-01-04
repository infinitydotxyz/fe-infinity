import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';
import { globalEventTypes } from '../astra/astra-filter-popdown';
import { FeedList } from './feed-list';

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


  return (
    <div className={twMerge('flex', className)}>
      <div className="w-full px-10 py-10">{content}</div>
    </div>
  );
};
