import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';

import { CenteredContent, PageBox } from 'src/components/common';
import { GlobalFeedList } from 'src/components/feed-list/global-feed-list';
import { AllCuratedStart } from 'src/components/start/all-curated-start';
import { TrendingStart } from 'src/components/start/trending-start';
import { twMerge } from 'tailwind-merge';

const StartPage = () => {
  const titleHeader = (title: string, className = '') => {
    return <div className={twMerge('text-3xl my-5 text-gray-600 font-bold', className)}>{title}</div>;
  };

  return (
    <PageBox title="Infinity" showTitle={false}>
      {titleHeader('Curated Collections')}
      <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Votes} />

      {titleHeader('Trending')}
      <TrendingStart />

      {titleHeader('Feed', 'mt-12 mb-5')}
      <GlobalFeedList types={[]} compact={true} />

      {titleHeader('Phase Progression', 'mt-12 mb-5')}
      <CenteredContent>Coming Soon</CenteredContent>
    </PageBox>
  );
};

export default StartPage;
