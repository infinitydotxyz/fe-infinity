import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { useFetchInfinite } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { Button, ScrollLoader, Spinner } from '../common';
import { CurationTable } from './curations-table';
import { PaginatedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { CuratedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';

export type AllCuratedProps = { orderBy: CuratedCollectionsOrderBy };

export const AllCuratedCollections: React.FC<AllCuratedProps> = ({ orderBy }) => {
  const { user } = useAppContext();

  const query = {
    orderBy,
    orderDirection: 'desc',
    limit: 10
  };

  const {
    result: collectionsArray,
    error: collectionsError,
    isLoading: isLoadingCollections,
    setSize: setCollectionsSize
  } = useFetchInfinite<PaginatedCollectionsDto>('/collections/curated', {
    query
  });

  const { result: curationsArray, setSize: setCurationsSize } = useFetchInfinite<CuratedCollectionsDto>(
    user?.address ? `/user/${user.address}/curated` : null,
    {
      query
    }
  );

  const fetchMore = () => {
    setCollectionsSize((size) => size + 1);
    setCurationsSize((size) => size + 1);
  };

  return (
    <div>
      {collectionsError ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {collectionsArray && collectionsArray?.length > 0 && (
        <CurationTable
          collections={collectionsArray.map((result) => result.data)}
          curations={curationsArray?.map((result) => result.data)}
        />
      )}

      {!isLoadingCollections && collectionsArray?.length === 0 && (
        // TODO: match design
        <div className="text-center">
          <p className="font-body font-medium">
            <span>No collections have been curated yet</span>
          </p>
          <Button className="mt-2">Curate now</Button>
        </div>
      )}

      <ScrollLoader onFetchMore={fetchMore} />

      {isLoadingCollections && <Spinner />}
    </div>
  );
};
