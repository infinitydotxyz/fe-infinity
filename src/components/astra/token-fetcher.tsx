import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { ApiResponse } from 'src/utils';
import { NFTArray } from '../../utils/types/collection-types';
import { fetchTokens, fetchUserTokens, tokensToCardData } from './astra-utils';

export interface TokenFetcherResult {
  ferror: boolean;
  fcardData: CardData[];
  fcursor: string;
  fhasNextPage: boolean;
}

export class TokenFetcher {
  error = false;
  cursor = '';
  hasNextPage = false;
  cardData: CardData[] = [];

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
        const result = response.result as NFTArray;

        let newCards = tokensToCardData(result.data);
        if (loadMore) {
          newCards = [...this.cardData, ...newCards];
        }

        this.cardData = newCards;
        this.cursor = result.cursor;
        this.hasNextPage = result.hasNextPage;
      }
    }

    return { fcursor: this.cursor, fhasNextPage: this.hasNextPage, fcardData: this.cardData, ferror: this.error };
  };

  // override this
  protected doFetch = async (): Promise<ApiResponse> => {
    return { status: 0 };
  };
}

// ========================================================================

export class CollectionTokenCache {
  private static instance: CollectionTokenCache;

  private cache: Map<string, TokenFetcher>;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cache = new Map<string, TokenFetcher>();
  }

  fetcher(collection: BaseCollection, chainId: string): TokenFetcher {
    const key = `${collection.address}:${chainId}`;
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

class CollectionTokenFetcher extends TokenFetcher {
  private collection: BaseCollection;
  private chainId: string;

  constructor(collection: BaseCollection, chainId: string) {
    super();

    this.collection = collection;
    this.chainId = chainId;
  }

  // override
  protected doFetch = async (): Promise<ApiResponse> => {
    return await fetchTokens(this.collection.address, this.chainId, this.cursor);
  };
}

// ========================================================================

export class UserTokenCache {
  private static instance: UserTokenCache;
  private cachedFetcher: TokenFetcher | undefined;
  private cachedAddress: string;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cachedFetcher = undefined;
    this.cachedAddress = '';
  }

  fetcher(userAddress: string): TokenFetcher {
    if (userAddress === this.cachedAddress && this.cachedFetcher) {
      return this.cachedFetcher;
    }

    this.cachedFetcher = new UserTokenFetcher(userAddress);
    this.cachedAddress = userAddress;

    return this.cachedFetcher;
  }
}

// ========================================================================

class UserTokenFetcher extends TokenFetcher {
  private userAddress: string;

  constructor(userAddress: string) {
    super();
    this.userAddress = userAddress;
  }

  // override
  protected doFetch = async (): Promise<ApiResponse> => {
    return fetchUserTokens(this.userAddress, this.cursor);
  };
}
