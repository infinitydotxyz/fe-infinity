import { FunctionComponent } from 'react';
import { VotedStatus } from './voted-status';
import { TwitterSupporterList } from './twitter-supporter-list';
import { TopHolderList } from './top-holder-list';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';

interface CommunityRightPanelProps {
  collection: BaseCollection;
}

const CommunityRightPanel: FunctionComponent<CommunityRightPanelProps> = ({ collection }) => {
  return (
    <div>
      <VotedStatus chainId={collection.chainId} collectionAddress={collection.address} />
      <TwitterSupporterList />
      <TopHolderList />
    </div>
  );
};

export { CommunityRightPanel };
