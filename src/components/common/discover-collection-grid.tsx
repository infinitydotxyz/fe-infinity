import React, { useState, useEffect } from 'react';
import { CenteredContent, ScrollLoader, Spinner } from 'src/components/common';
import { apiGet, LARGE_LIMIT, GRID_CSS } from 'src/utils';
import { uniqBy } from 'lodash';
import { DiscoverCollectionCard } from './discover-collection-card';
import { DiscoverOrderBy } from 'pages/market';
import { CollectionStatsArrayResponseDto, CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto/stats';
import { useIsMounted } from 'src/hooks/useIsMounted';

const fetchCollectionRankings = async (cursor: undefined | string, orderBy: DiscoverOrderBy) => {
  const API_ENDPOINT = '/collections/rankings'; // ?period=weekly&date=1656023141155&orderBy=twitterFollowersPercentChange&orderDirection=desc&limit=50
  const response = await apiGet(API_ENDPOINT, {
    query: {
      period: 'weekly',
      date: '1656023141155',
      orderBy,
      orderDirection: 'desc',
      limit: LARGE_LIMIT,
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
  const isMounted = useIsMounted();

  useEffect(() => {
    setIsLoading(true);

    handleFetch('');
  }, [orderBy]);

  const handleFetch = async (passedCursor: string) => {
    const { error, result } = await fetchCollectionRankings(passedCursor, orderBy);

    // to test spinner
    // await sleep(2222);

    if (isMounted()) {
      setIsLoading(false);

      if (error) {
        setError(error);
        setCollections([]);
        setCursor('');
        setHasNextPage(false);
      } else {
        const res = result as CollectionStatsArrayResponseDto;
        const resData = (res.data ?? []).filter((item) => item.name !== 'Unknown');
        if (passedCursor) {
          let arr = [...collections, ...resData];
          arr = uniqBy(arr, 'collectionAddress');
          setCollections(arr);
        } else {
          const arr = uniqBy(resData, 'collectionAddress');
          setCollections(arr);
        }
        setCursor(res.cursor);
        setHasNextPage(res.hasNextPage);
      }
    }
  };

  if (error) {
    return (
      <div className={className}>
        <div>Unable to load data.</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      )}

      {!isLoading && (
        <div className={GRID_CSS}>
          {collections.map((collection) => (
            <DiscoverCollectionCard
              key={collection.slug}
              orderBy={orderBy}
              collection={collection}
              routerQuery={routerQuery}
            />
          ))}
        </div>
      )}

      {hasNextPage && <ScrollLoader onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};
