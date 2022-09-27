import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useRouter } from 'next/router';
import GlobalRewards from 'pages/rewards/global-rewards';

import { Button, PageBox, Spacer } from 'src/components/common';
import { GlobalFeedList } from 'src/components/feed-list/global-feed-list';
import { AllCuratedStart } from 'src/components/start/all-curated-start';
import { StartFooter } from 'src/components/start/start-footer';
import { TrendingStart } from 'src/components/start/trending-start';
import { twMerge } from 'tailwind-merge';

const HomePage = () => {
  const router = useRouter();

  const titleHeader = (title: string, className = '', morePath = '') => {
    return (
      <div className={twMerge('  my-5   flex items-center', className)}>
        <div className="text-3xl my-5 text-gray-600 font-bold">{title}</div>
        <Spacer />
        <Button size="medium" onClick={() => router.push(morePath)}>
          See More
        </Button>
      </div>
    );
  };

  return (
    <PageBox title="Infinity" showTitle={false} footer={<StartFooter />}>
      {titleHeader('Curated Collections', '', '/curated?tab=All+Curated')}
      <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Votes} />

      {titleHeader('Trending', '', '/trending')}
      <TrendingStart />

      {titleHeader('Feed', 'mt-12 mb-5', '/feed')}
      <GlobalFeedList types={[]} compact={true} />

      {/* {titleHeader('Reward Phases', 'mt-12 mb-5', '/rewards')}
      <GlobalRewards /> */}
    </PageBox>
  );
};

export default HomePage;
