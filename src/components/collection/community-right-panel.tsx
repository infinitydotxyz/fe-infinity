import { VotedStatus } from './voted-status';
import { TwitterSupporterList } from './twitter-supporter-list';
import { TopHolderList } from './top-holder-list';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';

interface Props {
  collection: BaseCollection;
}

export const CommunityRightPanel = ({ collection }: Props) => {
  return (
    <div>
      <VotedStatus chainId={collection.chainId} collectionAddress={collection.address} />
      <TwitterSupporterList />
      <TopHolderList />
    </div>
  );
};
