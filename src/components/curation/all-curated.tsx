import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { ScrollLoader, Spinner } from '../common';
import { CurationTable } from './curations-table';
import { NoResultsBox } from './no-results-box';
import { CuratedTab } from './types';
import { useRouter } from 'next/router';
import { OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { useCuratedCollections } from 'src/hooks/api/useCuratedCollections';

export type AllCuratedProps = { order: { orderBy: CuratedCollectionsOrderBy; direction: OrderDirection } };

export const AllCuratedCollections: React.FC<AllCuratedProps> = ({ order }) => {
  const router = useRouter();

  const { result, error, isLoading, fetchMore } = useCuratedCollections({
    orderBy: order.orderBy,
    orderDirection: order.direction,
    limit: 10
  });

  return (
    <div>
      {error ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {result && result?.length > 0 && <CurationTable curatedCollections={result} />}

      {result && result?.length === 0 && (
        <NoResultsBox tab={CuratedTab.AllCurated} onClick={() => router.push('/trending')} />
      )}

      <ScrollLoader onFetchMore={fetchMore} />

      {isLoading && <Spinner />}
    </div>
  );
};
