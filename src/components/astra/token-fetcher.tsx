import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { NFTArray } from '../../utils/types/collection-types';
import { fetchTokens, fetchUserTokens, tokensToCardData } from './astra-utils';

export interface TokenFetcherResult {
  ferror: boolean;
  fcardData: CardData[];
  fcursor: string;
  fhasNextPage: boolean;
}

export interface TokenFetcher {
  handleFetch(passedCursor: string): Promise<TokenFetcherResult>;
}

// ========================================================================

export class CollectionTokenFetcher implements TokenFetcher {
  private collection: BaseCollection;
  private chainId: string;

  constructor(collection: BaseCollection, chainId: string) {
    this.collection = collection;
    this.chainId = chainId;
  }

  handleFetch = async (passedCursor: string): Promise<TokenFetcherResult> => {
    let ferror = false;
    let fcursor = '';
    let fhasNextPage = false;
    let fcardData: CardData[] = [];

    const response = await fetchTokens(this.collection.address, this.chainId, passedCursor);

    if (response.error) {
      ferror = response.error !== null;
      console.error(response.error);
    } else {
      const result = response.result as NFTArray;

      fcardData = tokensToCardData(result.data, this.collection.metadata.name);
      fcursor = result.cursor;
      fhasNextPage = result.hasNextPage;
    }

    return { fcursor, fhasNextPage, fcardData, ferror };
  };
}

// ========================================================================

export class UserTokenFetcher implements TokenFetcher {
  private userAddress: string;

  constructor(userAddress: string) {
    this.userAddress = userAddress;
  }

  handleFetch = async (passedCursor: string): Promise<TokenFetcherResult> => {
    let ferror = false;
    let fcursor = '';
    let fhasNextPage = false;
    let fcardData: CardData[] = [];

    const response = await fetchUserTokens(this.userAddress, passedCursor);

    if (response.error) {
      ferror = response.error !== null;
      console.error(response.error);
    } else {
      const result = response.result as NFTArray;

      fcardData = tokensToCardData(result.data, 'Users Name');
      fcursor = result.cursor;
      fhasNextPage = result.hasNextPage;
    }

    return { fcursor, fhasNextPage, fcardData, ferror };
  };
}
