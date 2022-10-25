import React from 'react';
import { ScrollLoader, Spinner } from 'src/components/common';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { CurationTable } from 'src/components/curation/curations-table';
import { NoResultsBox } from './no-results-box';
import { CuratedTab } from './types';
import { useRouter } from 'next/router';
import { OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { useUserCuratedCollections } from 'src/hooks/api/useUserCuratedCollections';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export type MyCuratedCollectionsProps = { order: { orderBy: CuratedCollectionsOrderBy; direction: OrderDirection } };

export const MyCuratedCollections: React.FC<MyCuratedCollectionsProps> = ({ order }) => {
  const router = useRouter();
  const { user } = useOnboardContext();
  const { result, error, fetchMore, isLoading } = useUserCuratedCollections(
    {
      orderBy: order.orderBy,
      orderDirection: order.direction,
      limit: 10
    },
    user?.address ?? ''
  );

  const isSignedIn = !!user?.address;

  return (
    <div>
      {!isSignedIn && <div className="flex flex-col mt-10">Please connect your wallet.</div>}

      {error && <div className="flex flex-col mt-10">Unable to load curated collections.</div>}

      {result && result?.length > 0 && <CurationTable curatedCollections={result?.map((result) => result)} />}

      {result && result?.length === 0 && (
        <NoResultsBox
          tab={CuratedTab.MyCurated}
          onClick={() => router.replace(`curated?tab=${CuratedTab.AllCurated}`)}
        />
      )}

      <ScrollLoader onFetchMore={fetchMore} />

      {isSignedIn && isLoading && <Spinner />}
    </div>
  );
};
