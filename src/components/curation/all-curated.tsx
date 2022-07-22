import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { useFetchInfinite } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { ScrollLoader, Spinner } from '../common';
import { CurationTable } from './curations-table';
import { CuratedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { NoResultsBox } from './no-results-box';
import { CuratedTab } from './types';
import { useRouter } from 'next/router';

export type AllCuratedProps = { orderBy: CuratedCollectionsOrderBy };

export const AllCuratedCollections: React.FC<AllCuratedProps> = ({ orderBy }) => {
  const { user, chainId } = useAppContext();
  const router = useRouter();

  const query = {
    orderBy,
    orderDirection: 'desc',
    limit: 10
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<CuratedCollectionsDto>(
    `/collections/curated/${user?.address ? `${chainId}:${user.address}` : ''}`,
    {
      query,
      apiParams: { requiresAuth: true }
    }
  );

  // TODO: invalidate cache (or maybe reset size works too) on wallet change/logout

  const fetchMore = () => {
    setSize((size) => size + 1);
  };

  return (
    <div>
      {error ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {result && result[0].data?.length > 0 && (
        <CurationTable curatedCollections={result.map((result) => result.data)} />
      )}

      {result && result[0].data?.length === 0 && (
        <NoResultsBox tab={CuratedTab.AllCurated} onClick={() => router.push('orderbook')} />
      )}

      <ScrollLoader onFetchMore={fetchMore} />

      {isLoading && <Spinner />}
    </div>
  );
};
