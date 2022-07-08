import React from 'react';
import { PageBox } from 'src/components/common';
import { CommunityFeed } from 'src/components/feed-list/community-feed';

const FeedPage = () => {
  return (
    <PageBox title="Home">
      <CommunityFeed />
    </PageBox>
  );
};

export default FeedPage;
