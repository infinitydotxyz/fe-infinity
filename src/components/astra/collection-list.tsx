import React, { useState, useEffect } from 'react';
import { FetchMore } from 'src/components/common';
import { apiGet, DEFAULT_LIMIT } from 'src/utils';
import { CollectionSearchArrayDto, CollectionSearchDto } from '../../utils/types/collection-types';
import { BaseCollection } from '@infinityxyz/lib/types/core';
import { CollectionListItem } from './collection-list-item';

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
  selectedCollection?: BaseCollection;
  className?: string;
  onClick: (collection: CollectionSearchDto) => void;
}

export const CollectionList = ({ query, className, onClick, selectedCollection }: Props) => {
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

  return (
    <div className={className}>
      <div className="flex flex-col space-y-4 ">
        {collections.map((collection) => (
          <CollectionListItem
            key={collection.slug}
            collection={collection}
            onClick={onClick}
            selected={collection.address === selectedCollection?.address}
          />
        ))}
      </div>

      {hasNextPage && <FetchMore onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};
