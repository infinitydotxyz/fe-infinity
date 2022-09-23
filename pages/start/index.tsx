import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';

import { PageBox } from 'src/components/common';
import { AllCuratedStart } from 'src/components/start/all-curated-start';

const StartPage = () => {
  return (
    <PageBox title="Infinity" showTitle={false}>
      <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Votes} />
    </PageBox>
  );
};

export default StartPage;
