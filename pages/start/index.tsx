import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';

import { PageBox } from 'src/components/common';
import { AllCuratedCollections } from 'src/components/curation/all-curated';

const StartPage = () => {
  return (
    <PageBox title="Infinity">
      <AllCuratedCollections orderBy={CuratedCollectionsOrderBy.Votes} />
    </PageBox>
  );
};

export default StartPage;
