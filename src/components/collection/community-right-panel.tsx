import { FunctionComponent } from 'react';
import { VotedStatus } from './voted-status';
import { TwitterSupporterList } from './twitter-supporter-list';

const CommunityRightPanel: FunctionComponent = () => {
  return (
    <div>
      <VotedStatus />
      <TwitterSupporterList />
    </div>
  );
};

export { CommunityRightPanel };
