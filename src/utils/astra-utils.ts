import axios from 'axios';
import { trimText } from 'src/components/common';
import { SORT_FILTERS, TokensFilter } from 'src/utils/types';
import { ApiResponse } from './api-utils';
import { API_BASE, LARGE_LIMIT } from './constants';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { ReservoirClient, createClient } from '@reservoir0x/reservoir-sdk';

export type TokenFetcherOptions = { cursor?: string } & TokensFilter;

let reservoirClient: ReservoirClient;

const BASE_URL = {
  Ethereum: {
    chainId: 1,
    api: 'https://api.reservoir.tools',
    ws: 'wss://ws.reservoir.tools'
  },
  Goerli: {
    chainId: 5,
    api: 'https://api-goerli.reservoir.tools',
    ws: 'wss://ws-goerli.reservoir.tools'
  },
  Sepolia: {
    chainId: 6,
    api: 'https://api-sepolia.reservoir.tools',
    ws: 'wss://ws-sepolia.reservoir.tools'
  },
  Polygon: {
    chainId: 137,
    api: 'https://api-polygon.reservoir.tools',
    ws: 'wss://ws-polygon.reservoir.tools'
  },
  Mumbai: {
    chainId: 80001,
    api: 'https://api-mumbai.reservoir.tools',
    ws: 'wss://ws-mumbai.reservoir.tools'
  },
  BNB: {
    chainId: 56,
    api: 'https://api-bsc.reservoir.tools',
    ws: 'wss://ws-bsc.reservoir.tools'
  },
  Arbitrum: {
    chainId: 42161,
    api: 'https://api-arbitrum.reservoir.tools',
    ws: 'wss://ws-arbitrum.reservoir.tools'
  },
  Optimism: {
    chainId: 10,
    api: 'https://api-optimism.reservoir.tools',
    ws: 'wss://ws-optimism.reservoir.tools'
  },
  ArbitrumNova: {
    chainId: 42170,
    api: 'https://api-arbitrum-nova.reservoir.tools',
    ws: 'wss://ws-arbitrum-nova.reservoir.tools'
  },
  Base: {
    chainId: 8453,
    api: 'https://api-base.reservoir.tools',
    ws: 'wss://ws-base.reservoir.tools'
  },
  BaseGoerli: {
    chainId: 84531,
    api: 'https://api-base-goerli.reservoir.tools',
    ws: 'wss://ws-base-goerli.reservoir.tools'
  },
  Zora: {
    chainId: 7777777,
    api: 'https://api-zora.reservoir.tools',
    ws: 'wss://ws-zora.reservoir.tools'
  },
  ZoraGoerli: {
    chainId: 999,
    api: 'https://api-zora-testnet.reservoir.tools',
    ws: 'wss://ws-zora-testnet.reservoir.tools'
  },
  ScrollAlpha: {
    chainId: 534353,
    api: 'https://api-scroll-alpha.reservoir.tools',
    ws: 'wss://ws-scroll-alpha.reservoir.tools'
  },
  Linea: {
    chainId: 59144,
    api: 'https://api-linea.reservoir.tools',
    ws: 'wss://ws-linea.reservoir.tools'
  }
};

export const chainIdToNetwork: Record<number, keyof typeof BASE_URL> = Object.fromEntries(
  (Object.entries(BASE_URL) as [keyof typeof BASE_URL, (typeof BASE_URL)[keyof typeof BASE_URL]][]).map(
    ([name, value]) => [value.chainId, name]
  )
);

export const getClientUrl = (chainId: string) => {
  const network = chainIdToNetwork[parseInt(chainId, 10)];
  const baseUrl = BASE_URL[network];
  if (!baseUrl) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  return {
    api: new URL(baseUrl.api),
    ws: new URL(baseUrl.ws)
  };
};

export const getReservoirClient = (chainId: string): ReservoirClient => {
  if (reservoirClient) {
    return reservoirClient;
  }

  const baseUrl = getClientUrl(chainId).api;
  if (!baseUrl) {
    throw new Error(`Unsupported chain ${chainId}`);
  }

  reservoirClient = createClient({
    chains: [
      {
        id: Number(chainId),
        baseApiUrl: baseUrl.origin,
        active: true
      }
    ],
    source: 'pixl.so',
    normalizeRoyalties: false
  });
  return reservoirClient;
};

export const fetchCollectionReservoirOrders = async (
  collection: string,
  chainId: string,
  tokenId?: string,
  continuation?: string,
  side?: 'buy' | 'sell',
  collBidsOnly?: boolean
): Promise<ApiResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    collection,
    chainId,
    side
  };
  if (tokenId) {
    query.tokenId = tokenId;
  }
  if (continuation) {
    query.continuation = continuation;
  }
  if (collBidsOnly) {
    query.collBidsOnly = true;
  }

  const response = await httpGet(`/v2/orders`, query);
  return response;
};

export const fetchCollectionTokens = async (
  collectionAddress: string,
  collectionChainId: ChainId,
  { cursor, sort = SORT_FILTERS.lowestPrice, ...options }: TokenFetcherOptions = {}
): Promise<ApiResponse> => {
  const filters = {
    orderBy: '',
    orderDirection: ''
  };

  switch (sort) {
    case SORT_FILTERS.highestPrice:
    case SORT_FILTERS.lowestPrice:
      filters.orderBy = 'price';
      filters.orderDirection = sort === SORT_FILTERS.highestPrice ? 'desc' : 'asc';
      break;
    case SORT_FILTERS.tokenIdNumeric:
      filters.orderBy = sort;
      filters.orderDirection = 'asc';
      break;
  }

  const query = {
    limit: LARGE_LIMIT,
    cursor,
    chainId: collectionChainId,
    ...options,
    ...filters
  };

  const response = await httpGet(`/collections/${collectionChainId}:${collectionAddress}/nfts`, query);
  return response;
};

export const fetchProfileTokens = async (
  userAddress: string,
  chainId: string,
  { cursor, ...options }: TokenFetcherOptions = {}
): Promise<ApiResponse> => {
  const query = {
    ...options,
    limit: LARGE_LIMIT,
    cursor,
    chainId
  };

  const response = await httpGet(`/user/${userAddress}/nfts`, query);
  return response;
};

export const getCollection = async (collectionAddress: string): Promise<CollectionInfo | undefined> => {
  const chainId = '1';
  const response = await httpGet(`/collection/${chainId}/${collectionAddress}`, {});

  if (response.result) {
    return response.result as CollectionInfo;
  }
};

export const numberWithCommas = (x: number | string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const truncateStr = (str: string, max = 400) => {
  const textArray = trimText(str, max - 2, max - 1, max);

  if (textArray[1].length > 0) {
    return `${textArray[0]}\u{02026}`;
  }

  return textArray[0];
};

export interface CollectionInfo {
  address: string;
  chainId: string;
  tokenStandard: string;
  hasBlueCheck?: boolean;
  numNfts?: number;
  numOwners?: number;
  slug: string;
  name: string;
  symbol: string;
  description: string;
  profileImage: string;
  bannerImage: string;
  cardDisplaytype?: string;
  twitter?: string;
  discord?: string;
  external?: string;
}

// CollectionSearchArrayDto

export interface CollectionInfoArrayDto {
  data: CollectionInfo[];
  cursor: string;
  hasNextPage: boolean;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const httpGet = async (path: string, params?: object): Promise<ApiResponse> => {
  try {
    // const headers = await authHeaders(path);
    const response = await axios.get(`${API_BASE}${path}`, { params });

    return { status: response.status, error: '', result: response.data };
  } catch (error) {
    return httpErrorResponse(error);
  }
};

// ===================================================================

export const httpPost = async (path: string, body: object): Promise<ApiResponse> => {
  try {
    // const headers = await authHeaders(path);
    const response = await axios.post(`${API_BASE}${path}`, body);

    return { status: response.status, error: '', result: response.data };
  } catch (error) {
    return httpErrorResponse(error);
  }
};

// ===================================================================

// export const authHeaders = async (path: string): Promise<AxiosRequestHeaders> => {
//   const userEndpointRegex = /\/(u|user)\//;
//   const publicUserEndpoint = /\/p\/u\//;
//   const requiresAuth = userEndpointRegex.test(path) && !publicUserEndpoint.test(path);

//   let authHeaders = {};
//   if (requiresAuth) {
//     authHeaders = await OnboardAuthProvider.getAuthHeaders();
//   }

//   return authHeaders;
// };

// ===================================================================

export const httpErrorResponse = (error: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err: any = error;
  let status = 551;
  let message = '';

  if (err.response) {
    message = err.response.data;
    status = err.response.status;
    console.error(err.response.headers);
  } else if (err.request) {
    console.error(err.request);
    message = 'request error';
  } else {
    message = err.message;
  }
  console.error(err.config);

  // make sure error: is never undefined since if (error) fails in that case
  return { status: status, error: message ?? 'Unknown Error' };
};
