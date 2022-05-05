import { BaseCollection, BaseToken, CardData } from '@infinityxyz/lib/types/core';
import React, { useState, useEffect } from 'react';
import { FetchMore, CollectionCard, Card } from 'src/components/common';
import { apiGet, DEFAULT_LIMIT } from 'src/utils';
import { Filter } from 'src/utils/context/FilterContext';

// SNG why type not in the lib?
// CollectionSearchDto
export interface CollectionSearchDto {
  description: string;
  address: string;
  chainId: string;
  profileImage: string;
  hasBlueCheck: boolean;
  bannerImage: string;
  slug: string;
  name: string;
}

// SNG why type not in the lib?
// CollectionSearchArrayDto
export interface CollectionSearchArrayDto {
  data: CollectionSearchDto[];
  cursor: string;
  hasNextPage: boolean;
}

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
  onButtonClick?: (collection: CollectionSearchDto) => void;
}

export const CollectionGrid = ({ query, className, onButtonClick, buttonName }: Props) => {
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 ">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.slug}
            collection={collection}
            buttonName={buttonName}
            onButtonClick={onButtonClick}
          />
        ))}
      </div>

      {hasNextPage && <FetchMore onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};

// =========================================================================

// SNG why type not in the lib?
// NFTArrayDto
export interface NFTArray {
  data: BaseToken[];
  cursor: string;
  hasNextPage: boolean;
}

const fetchTokens = async (collectionAddress: string, chainId: string, cursor: undefined | string) => {
  const filterState: Filter = {};

  filterState.orderBy = 'rarityRank'; // set defaults
  filterState.orderDirection = 'asc';

  const API_ENDPOINT = `/collections/${chainId}:${collectionAddress}/nfts`;
  const response = await apiGet(API_ENDPOINT, {
    query: {
      limit: DEFAULT_LIMIT,
      cursor,
      ...filterState
    }
  });

  return response;
};

// ==============================================================

interface Props2 {
  collection: BaseCollection;
  chainId: string;
  className?: string;
  buttonName?: string;
  onButtonClick?: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, data: CardData) => void;
}

export const TokensGrid = ({ collection, chainId, className, onButtonClick, buttonName }: Props2) => {
  const [tokens, setTokens] = useState<BaseToken[]>([]);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    handleFetch('');
  }, []);

  const handleFetch = async (passedCursor: string) => {
    const response = await fetchTokens(collection.address, chainId, passedCursor);

    if (response.error) {
      setError(response.error);
      setTokens([]);
      setCursor('');
      setHasNextPage(false);
    } else {
      const result = response.result as NFTArray;
      if (passedCursor) {
        setTokens([...tokens, ...result.data]);
      } else {
        setTokens(result.data);
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 ">
        {tokens.map((token) => {
          const data: CardData = {
            id: collection?.address + '_' + token.tokenId,
            name: token.metadata?.name,
            collectionName: collection?.metadata?.name,
            title: collection?.metadata?.name,
            description: token.metadata.description,
            image: token.image.url,
            price: 0,
            chainId: token.chainId,
            tokenAddress: collection?.address,
            tokenId: token.tokenId,
            rarityRank: token.rarityRank,
            orderSnippet: token.ordersSnippet
          };

          return (
            <Card
              key={data.id}
              data={data}
              className=""
              cardActions={[
                {
                  label: buttonName,
                  onClick: (ev) => {
                    if (onButtonClick) {
                      return onButtonClick(ev, data);
                    }
                  }
                }
              ]}
            />
          );
        })}
      </div>

      {hasNextPage && <FetchMore onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};
