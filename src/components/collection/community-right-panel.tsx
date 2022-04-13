import { FunctionComponent } from 'react';
import { VotedStatus } from './voted-status';
import { TwitterSupporterList } from './twitter-supporter-list';
import { TopHolderList } from './top-holder-list';

const CommunityRightPanel: FunctionComponent = () => {
  return (
    <div>
      <VotedStatus />
      <TwitterSupporterList />
      <TopHolderList />
    </div>
  );
};

export { CommunityRightPanel };
