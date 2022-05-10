import { BaseToken, CardData, Collection } from '@infinityxyz/lib/types/core';
import { DEFAULT_LIMIT, apiGet, ApiResponse, LARGE_LIMIT } from 'src/utils';
import { Filter } from 'src/utils/context/FilterContext';

export const fetchTokens = async (
  collectionAddress: string,
  chainId: string,
  cursor?: string
): Promise<ApiResponse> => {
  const filterState: Filter = {};

  filterState.orderBy = 'rarityRank'; // set defaults
  filterState.orderDirection = 'asc';

  const response = await apiGet(`/collections/${chainId}:${collectionAddress}/nfts`, {
    query: {
      limit: LARGE_LIMIT,
      cursor,
      ...filterState
    }
  });

  return response;
};

// ======================================================

export const fetchCollections = async (query: string, cursor?: string): Promise<ApiResponse> => {
  const response = await apiGet('/collections/search', {
    query: {
      query,
      limit: DEFAULT_LIMIT,
      cursor
    }
  });

  return response;
};

// ======================================================

export const tokensToCardData = (tokens: BaseToken[], collection: Collection): CardData[] => {
  let cardData = tokens.map((token) => {
    return {
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
  });

  // remove any without tokenAddress (seeing bad NFTs in my profile)
  cardData = cardData.filter((x) => x.tokenAddress);

  return cardData;
};
