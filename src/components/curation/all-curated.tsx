import { Collection } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { result } from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTokenVotes } from 'src/hooks/contract/token/useTokenVotes';
import { apiGet, useFetchInfinite } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { Button, ScrollLoader, Spinner } from '../common';
import { CurationRow, CurationsTable, CurationTable } from './curations-table';
import { PaginatedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto/collections';

export type AllCuratedProps = { orderBy: CuratedCollectionsOrderBy };

export const AllCuratedCollections: React.FC<AllCuratedProps> = ({ orderBy }) => {
  const { user } = useAppContext();

  const query = {
    orderBy,
    orderDirection: 'desc',
    limit: 10
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<PaginatedCollectionsDto>('/collections/curated', {
    query
  });

  /* 
  const fetchUserCurated = async () => {
    // If the user is logged in, fetch the user's curations so we can the amount of votes here as well.
    if (user?.address) {
      const { result, error } = await apiGet(`/user/${user.address}/curated`, {
        query
      });

      if (error) {
        console.error(error);
        reset();
        return;
      }

      setCurations((state) => [...(state || []), ...(result.data.curations || [])]);
    }
  }; */

  return (
    <div>
      {error ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {result && result?.length > 0 && <CurationTable collections={result.map((result) => result.data)} />}

      {!isLoading && result?.length === 0 && (
        // TODO: match design
        <div className="text-center">
          <p className="font-body font-medium">
            <span>No collections have been curated yet</span>
          </p>
          <Button className="mt-2">Curate now</Button>
        </div>
      )}

      <ScrollLoader onFetchMore={() => setSize((size) => size + 1)} />

      {isLoading && <Spinner />}
    </div>
  );
};
