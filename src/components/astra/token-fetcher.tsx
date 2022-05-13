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

        let newCards = tokensToCardData(result.data, this.collectionName());
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

  // override this
  protected collectionName = (): string => {
    return '';
  };
}

// ========================================================================

export class CollectionTokenFetcher extends TokenFetcher {
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

  // override
  protected collectionName = (): string => {
    return this.collection.metadata.name;
  };
}

// ========================================================================

export class UserTokenFetcher extends TokenFetcher {
  private userAddress: string;

  constructor(userAddress: string) {
    super();
    this.userAddress = userAddress;
  }

  // override
  protected doFetch = async (): Promise<ApiResponse> => {
    return fetchUserTokens(this.userAddress, this.cursor);
  };

  // override
  protected collectionName = (): string => {
    return this.userAddress;
  };
}
