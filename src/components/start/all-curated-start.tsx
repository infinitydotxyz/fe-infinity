import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { useFetchInfinite } from 'src/utils';
import { CenteredContent, ScrollLoader, Spinner } from '../common';
import { CuratedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { CurationCardScroller } from './curation-card-scroller';

type Props = { orderBy: CuratedCollectionsOrderBy };

export const AllCuratedStart: React.FC<Props> = ({ orderBy }) => {
  const { user, chainId } = useOnboardContext();

  const query = {
    orderBy,
    orderDirection: 'desc',
    limit: 12
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<CuratedCollectionsDto>(
    '/collections/curated/' + (user?.address ? `${chainId}:${user?.address}` : ''),
    {
      query,
      apiParams: { requiresAuth: !!user?.address }
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
        <div>
          <div className="text-2xl mt-4 font-bold">Curated Collections</div>
          <CurationCardScroller curatedCollections={result.map((result) => result.data)} />
        </div>
      )}

      {result && result[0].data?.length === 0 && (
        <CenteredContent>
          <div>Nothing Found</div>
        </CenteredContent>
      )}

      <ScrollLoader onFetchMore={fetchMore} />

      {isLoading && <Spinner />}
    </div>
  );
};
