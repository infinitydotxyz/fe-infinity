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
