/* eslint-disable prettier/prettier */
import { BaseCollection, CuratedCollection } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React, { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { Button, ScrollLoader } from '../common';
import { CurationsTable } from './curations-table';

export type AllCuratedProps = { orderBy: CuratedCollectionsOrderBy };

export const AllCuratedCollections: React.FC<AllCuratedProps> = ({ orderBy }) => {
  const { user } = useAppContext();
  const [cursor, setCursor] = useState('');
  const [collections, setCollections] = useState<BaseCollection[]>();
  const [curations, setCurations] = useState<CuratedCollection[]>();
  const [error, setError] = useState<string>();
  const [hasNextPage, setHasNextPage] = useState(false);

  const reset = () => {
    setError(error);
    setCollections(undefined);
    setCursor('');
    setHasNextPage(false);
  };

  const fetch = async () => {
    const query = {
      orderBy,
      orderDirection: 'desc',
      limit: 10,
      cursor
    };

    // Query the API to get a list of the most voted.
    const { result, error } = await apiGet(`/collections/curated`, { query });

    // If there's any kind of error, reset the page and put the error in the state.
    if (error) {
      console.error(error);
      reset();
      return;
    }

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

    setCollections((state) => [...(state || []), ...(result.data.collections || [])]);
    setCursor(result.cursor);
    setHasNextPage(result.hasNextPage);
  };

  useEffect(() => {
    if (user?.address != null) {
      void fetch();
    }
  }, [user?.address]);

  return (
    <div>
      {error ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {collections != null && collections.length > 0 && (
        <CurationsTable collections={collections} curations={curations || []} />
      )}

      {collections != null && collections.length === 0 && (
        // TODO: match design
        <div className="text-center">
          <p className="font-body font-medium">
            {collections.length == 0 && <span>No collections have been curated yet</span>}
          </p>
          <Button className="mt-2">Curate now</Button>
        </div>
      )}

      {hasNextPage && <ScrollLoader onFetchMore={fetch} />}
    </div>
  );
};
