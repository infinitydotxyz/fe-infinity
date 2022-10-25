import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { CenteredContent, Spinner } from '../common';
import { CuratedSwiper } from './curated-swiper';
import { OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { useCuratedCollections } from 'src/hooks/api/useCuratedCollections';

interface Props {
  orderBy: CuratedCollectionsOrderBy;
}

export const AllCuratedStart: React.FC<Props> = ({ orderBy }) => {
  const {
    result,
    error: hasError,
    isLoading
  } = useCuratedCollections({
    orderBy,
    orderDirection: OrderDirection.Descending,
    limit: 12
  });

  return (
    <div>
      {hasError ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {result.length > 0 && (
        <div>
          <CuratedSwiper collections={result} />
        </div>
      )}

      {result.length === 0 && (
        <CenteredContent>
          <div>Nothing Found</div>
        </CenteredContent>
      )}

      {isLoading && <Spinner />}
    </div>
  );
};
