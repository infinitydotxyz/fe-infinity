import { BaseToken, ERC721CardData, Erc721Token, OrdersSnippet } from '@infinityxyz/lib-frontend/types/core';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { Filter } from 'src/utils/context/FilterContext';
import { ApiResponse, apiGet } from 'src/utils/apiUtils';

type ApiNftData = Erc721Token & {
  orderSnippet?: OrdersSnippet;
};

export interface PagedData {
  data: ApiNftData[];
  cursor: string;
  hasNextPage: boolean;
}

export interface TokenFetcherResult {
  error: boolean;
  cardData: ERC721CardData[];
  cursor: string;
  hasNextPage: boolean;
}

// ========================================================================

export class TokenFetcher {
  error = false;
  cursor = '';
  collectionAddress = '';
  collectionName = '';
  hasNextPage = false;
  cardData: ERC721CardData[] = [];

  userAddress: string;
  pageId: string;
  endpoint: string;
  chainId: string;
  filter: Filter;

  constructor(
    userAddress: string,
    pageId: string,
    endpoint: string,
    chainId: string,
    filter: Filter,
    collectionAddress: string,
    collectionName: string
  ) {
    this.userAddress = userAddress;
    this.pageId = pageId;
    this.filter = filter;
    this.chainId = chainId;
    this.endpoint = endpoint;
    this.collectionAddress = collectionAddress;
    this.collectionName = collectionName;
  }

  fetch = async (loadMore: boolean): Promise<TokenFetcherResult> => {
    let callFetch = true;

    // if first load, but we have some cache, don't fetch
    if (!loadMore) {
      if (this.cardData.length > 0) {
        callFetch = false;
      }
    }

    if (callFetch) {
      const response = await this.doFetch();

      if (response.error) {
        this.error = response.error !== null;
        console.error(response.error);
      } else {
        const result = response.result as PagedData;
        let newCards = this.toCardData(result.data);

        if (loadMore) {
          newCards = [...this.cardData, ...newCards];
        }

        this.cardData = newCards;
        this.cursor = result.cursor;
        this.hasNextPage = result.hasNextPage;
      }
    }

    return { cursor: this.cursor, hasNextPage: this.hasNextPage, cardData: this.cardData, error: this.error };
  };

  doFetch = async (): Promise<ApiResponse> => {
    if (this.pageId === 'COLLECTION' && !this.filter.orderBy) {
      this.filter.orderBy = 'tokenIdNumeric'; // set defaults
      this.filter.orderDirection = 'asc';
    }
    if (this.pageId === 'PROFILE') {
      delete this.filter.orderBy;
      delete this.filter.orderDirection;
    }

    const response = await apiGet(this.endpoint, {
      query: {
        chainId: this.chainId,
        limit: ITEMS_PER_PAGE,
        cursor: this.cursor,
        ...this.filter
      }
    });

    return response;
  };

  toCardData = (data: ApiNftData[]): ERC721CardData[] => {
    return nftsToCardData(data, this.collectionAddress, this.collectionName);
  };
}

// ========================================================================

export class TokenFetcherCache {
  private static instance: TokenFetcherCache;
  private cachedFetcher: TokenFetcher | undefined;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cachedFetcher = undefined;
  }

  refresh = () => {
    this.cachedFetcher = undefined;
  };

  fetcher(
    userAddress: string,
    pageId: string,
    filter: Filter,
    chainId: string,
    endpoint: string,
    collectionAddress: string,
    collectionName: string
  ): TokenFetcher {
    if (this.cachedFetcher) {
      if (
        userAddress === this.cachedFetcher.userAddress &&
        pageId === this.cachedFetcher.pageId &&
        filter === this.cachedFetcher.filter &&
        chainId === this.cachedFetcher.chainId &&
        endpoint === this.cachedFetcher.endpoint &&
        collectionAddress === this.cachedFetcher.collectionAddress &&
        collectionName === this.cachedFetcher.collectionName
      ) {
        return this.cachedFetcher;
      }
    }

    this.cachedFetcher = new TokenFetcher(
      userAddress,
      pageId,
      endpoint,
      chainId,
      filter,
      collectionAddress,
      collectionName
    );

    return this.cachedFetcher;
  }
}

// ========================================================================

export const nftsToCardData = (
  tokens: ApiNftData[],
  collectionAddress: string,
  collectionName: string
): ERC721CardData[] => {
  let result: ERC721CardData[] = (tokens || []).map((item: ApiNftData) => {
    const image =
      item?.image?.url || item?.alchemyCachedImage || item?.image?.originalUrl || item?.zoraImage?.url || '';

    const result: ERC721CardData = {
      id: collectionAddress + '_' + item.tokenId,
      name: item.metadata?.name ?? item.metadata?.title,
      title: item.collectionName ?? collectionName,
      collectionName: item.collectionName ?? collectionName,
      collectionSlug: item.collectionSlug ?? '',
      description: item.metadata?.description ?? '',
      image: image,
      isVideo: isVideoNft(item),
      price: item?.orderSnippet?.listing?.orderItem?.startPriceEth ?? 0,
      chainId: item.chainId,
      tokenAddress: item.collectionAddress ?? collectionAddress,
      address: item.collectionAddress ?? collectionAddress,
      tokenId: item.tokenId,
      rarityRank: item.rarityRank,
      orderSnippet: item.ordersSnippet,
      hasBlueCheck: item.hasBlueCheck ?? false,
      attributes: item.metadata?.attributes ?? []
    };

    return result;
  });

  // remove any with blank images
  result = result.filter((x) => {
    return x.image && x.image.length > 0;
  });

  return result;
};

export const isVideoNft = (token: BaseToken) => {
  // could also check image extension?
  return token.zoraImage?.mimeType === 'video/mp4';
};
