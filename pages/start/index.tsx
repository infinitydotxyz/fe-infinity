import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';

import { PageBox } from 'src/components/common';
import { AllCuratedStart } from 'src/components/start/all-curated-start';
import { TrendingStart } from 'src/components/start/trending-start';
import { twMerge } from 'tailwind-merge';

const StartPage = () => {
  const titleHeader = (title: string, className = '') => {
    return <div className={twMerge('text-2xl my-5 text-gray-700 font-bold', className)}>{title}</div>;
  };

  return (
    <PageBox title="Infinity" showTitle={false}>
      {titleHeader('Curated Collections')}
      <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Votes} />

      {titleHeader('Trending')}
      <TrendingStart />

      {titleHeader('Feed', 'mt-10 mb-5')}
    </PageBox>
  );
};

export default StartPage;
