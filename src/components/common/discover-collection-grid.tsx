import React, { useState, useEffect } from 'react';
import { ScrollLoader, Spinner } from 'src/components/common';
import { apiGet, DEFAULT_LIMIT } from 'src/utils';
import { uniqBy } from 'lodash';
import { DiscoverCollectionCard } from './discover-collection-card';
import { DiscoverOrderBy } from 'pages/marketplace';
import { CollectionStatsArrayResponseDto, CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto/stats';

const fetchCollectionRankings = async (cursor: undefined | string, orderBy: DiscoverOrderBy) => {
  const API_ENDPOINT = '/collections/rankings'; // ?period=weekly&date=1656023141155&orderBy=twitterFollowersPercentChange&orderDirection=desc&limit=50
  const response = await apiGet(API_ENDPOINT, {
    query: {
      period: 'weekly',
      date: '1656023141155',
      orderBy,
      orderDirection: 'desc',
      limit: DEFAULT_LIMIT,
      cursor
    }
  });

  return response;
};

interface Props {
  query?: string;
  orderBy: DiscoverOrderBy;
  className?: string;
  routerQuery?: string;
}

export const DiscoverCollectionGrid = ({ className, orderBy, routerQuery }: Props) => {
  const [collections, setCollections] = useState<CollectionStatsDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    handleFetch('');
  }, [orderBy]);

  const handleFetch = async (passedCursor: string) => {
    setIsLoading(true);
    const { error, result } = await fetchCollectionRankings(passedCursor, orderBy);
    setIsLoading(false);

    if (error) {
      setError(error);
      setCollections([]);
      setCursor('');
      setHasNextPage(false);
    } else {
      const res = result as CollectionStatsArrayResponseDto;
      if (passedCursor) {
        let arr = [...collections, ...res.data];
        arr = uniqBy(arr, 'collectionAddress');
        setCollections(arr);
      } else {
        const arr = uniqBy(res.data, 'collectionAddress');
        setCollections(arr);
      }
      setCursor(res.cursor);
      setHasNextPage(res.hasNextPage);
    }
  };

  if (error) {
    console.error(error);
    return (
      <div className={className}>
        <div>Unable to load data.</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {collections.map((collection) => (
          <DiscoverCollectionCard
            key={collection.slug}
            orderBy={orderBy}
            collection={collection}
            routerQuery={routerQuery}
          />
        ))}
        {isLoading && <Spinner />}
      </div>
      {hasNextPage && <ScrollLoader onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};
