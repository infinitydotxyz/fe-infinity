import React, { useState, useEffect } from 'react';
import { CollectionCard, ScrollLoader } from 'src/components/common';
import { apiGet, DEFAULT_LIMIT } from 'src/utils';
import { CollectionSearchDto, CollectionSearchArrayDto } from '@infinityxyz/lib-frontend/types/dto/collections';

const fetchCollections = async (query: string, cursor: undefined | string) => {
  const API_ENDPOINT = '/collections/search';
  const response = await apiGet(API_ENDPOINT, {
    query: {
      query,
      limit: DEFAULT_LIMIT,
      cursor
    }
  });

  return response;
};

interface Props {
  query: string;
  className?: string;
  buttonName?: string;
  listMode?: boolean;
  routerQuery?: string;
  onButtonClick?: (collection: CollectionSearchDto) => void;
}

export const CollectionGrid = ({
  listMode = false,
  query,
  className,
  onButtonClick,
  buttonName,
  routerQuery
}: Props) => {
  const [collections, setCollections] = useState<CollectionSearchDto[]>([]);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    handleFetch('');
  }, [query]);

  const handleFetch = async (passedCursor: string) => {
    const response = await fetchCollections(query, passedCursor);

    if (response.error) {
      setError(response.error);
      setCollections([]);
      setCursor('');
      setHasNextPage(false);
    } else {
      const result = response.result as CollectionSearchArrayDto;
      if (passedCursor) {
        setCollections([...collections, ...result.data]);
      } else {
        setCollections(result.data);
      }
      setCursor(result.cursor);
      setHasNextPage(result.hasNextPage);
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

  if (listMode) {
    return (
      <div className={className}>
        <div className="flex flex-col space-y-2">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.slug}
              collection={collection}
              buttonName={buttonName}
              routerQuery={routerQuery}
              onButtonClick={onButtonClick}
            />
          ))}
        </div>

        {hasNextPage && <ScrollLoader onFetchMore={() => handleFetch(cursor)} />}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.slug}
            collection={collection}
            buttonName={buttonName}
            routerQuery={routerQuery}
            onButtonClick={onButtonClick}
          />
        ))}
      </div>
      {hasNextPage && <ScrollLoader onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};
