import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { ApiResponse, getCollectionKeyId } from 'src/utils';
import { fetchCollectionTokens, TokenFetcherOptions, fetchProfileTokens } from 'src/utils/astra-utils';
import { ApiNftData, nftsToCardDataWithOfferFields, PagedData, TokenFetcherResult } from '../../gallery/token-fetcher';
import { Erc721TokenOffer } from '../types';

export class TokenFetcherAlt {
  error = false;
  cursor = '';
  collectionName = '';
  hasNextPage = false;
  cardData: Erc721TokenOffer[] = [];

  fetch = async (loadMore: boolean, options: TokenFetcherOptions): Promise<TokenFetcherResult> => {
    const response = await this.doFetch(options);

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

    return { cursor: this.cursor, hasNextPage: this.hasNextPage, cardData: this.cardData, error: this.error };
  };

  // override this
  // eslint-disable-next-line require-await, @typescript-eslint/no-unused-vars
  protected doFetch = async (_: TokenFetcherOptions): Promise<ApiResponse> => {
    return { status: 0 };
  };

  // override this
  protected toCardData = (data: ApiNftData[]): Erc721TokenOffer[] => {
    return nftsToCardDataWithOfferFields(data, '', '');
  };
}

// ========================================================================

export class CollectionTokenCache {
  private static instance: CollectionTokenCache;

  private cache: Map<string, CollectionTokenFetcher>;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cache = new Map<string, CollectionTokenFetcher>();
  }

  refresh = () => {
    this.cache = new Map<string, CollectionTokenFetcher>();
  };

  fetcher(collection: BaseCollection, chainId: string): CollectionTokenFetcher {
    const key = getCollectionKeyId(collection);
    const cached = this.cache.get(key);

    if (cached) {
      return cached;
    }

    const result = new CollectionTokenFetcher(collection, chainId);
    this.cache.set(key, result);

    return result;
  }
}

// ========================================================================

class CollectionTokenFetcher extends TokenFetcherAlt {
  private collection: BaseCollection;
  private chainId: string;

  constructor(collection: BaseCollection, chainId: string) {
    super();

    this.collection = collection;
    this.chainId = chainId;

    // not sure if this is needed now days
    this.collectionName = collection.metadata.name ?? '';
  }

  // override
  // eslint-disable-next-line require-await
  protected doFetch = async (options: TokenFetcherOptions): Promise<ApiResponse> => {
    return fetchCollectionTokens(this.collection.address, this.chainId, { ...options, cursor: this.cursor });
  };
}

// ========================================================================

export class ProfileTokenCache {
  private static instance: ProfileTokenCache;

  private cache: Map<string, ProfileTokenFetcher>;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cache = new Map<string, ProfileTokenFetcher>();
  }

  refresh = () => {
    this.cache = new Map<string, ProfileTokenFetcher>();
  };

  fetcher(userAddress: string, chainId: string): ProfileTokenFetcher {
    const key = trimLowerCase(`${chainId}:${userAddress}`);
    const cached = this.cache.get(key);

    if (cached) {
      return cached;
    }

    const result = new ProfileTokenFetcher(userAddress, chainId);
    this.cache.set(key, result);

    return result;
  }
}

// ========================================================================

class ProfileTokenFetcher extends TokenFetcherAlt {
  private userAddress: string;
  private chainId: string;

  constructor(userAddress: string, chainId: string) {
    super();

    this.userAddress = userAddress;
    this.chainId = chainId;
  }

  // override
  // eslint-disable-next-line require-await
  protected doFetch = async (): Promise<ApiResponse> => {
    return fetchProfileTokens(this.userAddress, this.chainId, this.cursor);
  };
}
