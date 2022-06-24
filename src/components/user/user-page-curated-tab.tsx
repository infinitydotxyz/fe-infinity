import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React, { useState } from 'react';
import { Sort } from '../curation/sort';
import { MyCuratedCollections } from '../curation/my-curated';

export const UserPageCuratedTab: React.FC = () => {
  const [orderBy, setOrderBy] = useState(CuratedCollectionsOrderBy.Votes);

  return (
    <div className="min-h-[1024px] mt-[-66px]">
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <Sort onClick={setOrderBy} />
      </div>
      <MyCuratedCollections orderBy={orderBy} />
    </div>
  );
};
