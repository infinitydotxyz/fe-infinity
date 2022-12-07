import { ApiResponse } from 'src/utils';
import { CollectionInfo, fetchTokens } from 'src/utils/astra-utils';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { ApiNftData, nftsToCardData, PagedData, TokenFetcherResult } from '../../gallery/token-fetcher';

export class TokenFetcherAlt {
  error = false;
  cursor = '';
  collectionName = '';
  hasNextPage = false;
  cardData: ERC721CardData[] = [];

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

  // override this
  // eslint-disable-next-line require-await
  protected doFetch = async (): Promise<ApiResponse> => {
    return { status: 0 };
  };

  // override this
  protected toCardData = (data: ApiNftData[]): ERC721CardData[] => {
    return nftsToCardData(data, '', '');
  };
}

// ========================================================================

export class CollectionTokenCache {
  private static instance: CollectionTokenCache;

  private cache: Map<string, TokenFetcherAlt>;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cache = new Map<string, TokenFetcherAlt>();
  }

  refresh = () => {
    this.cache = new Map<string, TokenFetcherAlt>();
  };

  fetcher(collection: CollectionInfo, chainId: string, showOnlyUnvisible: boolean): TokenFetcherAlt {
    const key = `${collection.address}:${chainId}:${showOnlyUnvisible}`;
    const cached = this.cache.get(key);

    if (cached) {
      return cached;
    }

    const result = new CollectionTokenFetcher(collection, chainId, showOnlyUnvisible);
    this.cache.set(key, result);

    return result;
  }
}

// ========================================================================

class CollectionTokenFetcher extends TokenFetcherAlt {
  private collection: CollectionInfo;
  private chainId: string;
  private showOnlyUnvisible: boolean;

  constructor(collection: CollectionInfo, chainId: string, showOnlyUnvisible: boolean) {
    super();

    this.collection = collection;
    this.chainId = chainId;
    this.showOnlyUnvisible = showOnlyUnvisible;

    // not sure if this is needed now days
    this.collectionName = collection.name ?? '';
  }

  // override
  // eslint-disable-next-line require-await
  protected doFetch = async (): Promise<ApiResponse> => {
    return fetchTokens(this.collection.address, this.chainId, this.cursor);
  };
}
