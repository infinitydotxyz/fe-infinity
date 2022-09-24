import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';

import { PageBox } from 'src/components/common';
import { AllCuratedStart } from 'src/components/start/all-curated-start';
import { TrendingStart } from 'src/components/start/trending-start';

const StartPage = () => {
  return (
    <PageBox title="Infinity" showTitle={false}>
      <div className="text-2xl my-5 font-bold">Curated Collections</div>
      <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Votes} />

      <div className="text-2xl my-5 font-bold">Trending</div>
      <TrendingStart />

      <div className="text-2xl mt-10 mb-5 font-bold">Feed</div>
    </PageBox>
  );
};

export default StartPage;
