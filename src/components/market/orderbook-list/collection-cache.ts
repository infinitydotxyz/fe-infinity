import { BaseCollection, BaseToken } from '@infinityxyz/lib/types/core';
import { BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtils';
import mitt from 'mitt';

class _CollectionCache {
  cCache = new Map<string, BaseCollection>();
  tCache = new Map<string, BaseToken>();
  fetchingKeySet = new Set<string>();
  emitter = mitt();

  getCollection = (chainId: BigNumberish, collectionAddress: string): BaseCollection | undefined => {
    const key = `${chainId.toString()}-${collectionAddress}`;

    const collection = this.cCache.get(key);

    if (collection) {
      return collection;
    }

    // get it async
    if (!this.fetchingKeySet.has(key)) {
      this.fetchingKeySet.add(key);

      this.getCollectionAsync(chainId, collectionAddress);
    }
  };

  getCollectionAsync = async (chainId: BigNumberish, collectionAddress: string): Promise<BaseCollection> => {
    const key = `${chainId.toString()}-${collectionAddress}`;

    let collection = this.cCache.get(key);

    if (!collection) {
      const { result } = await apiGet(`/collections/${chainId}:${collectionAddress}`);
      collection = result as BaseCollection;

      this.cCache.set(key, collection);
      this.emitter.emit('updated');
    }

    return collection;
  };

  getToken = (chainId: BigNumberish, collectionAddress: string, tokenId: string): BaseToken | undefined => {
    const key = `${chainId.toString()}-${collectionAddress}-${tokenId}`;

    const token = this.tCache.get(key);

    if (token) {
      return token;
    }

    // get it async
    if (!this.fetchingKeySet.has(key)) {
      this.fetchingKeySet.add(key);

      this.getTokenAsync(chainId, collectionAddress, tokenId);
    }
  };

  getTokenAsync = async (chainId: BigNumberish, collectionAddress: string, tokenId: string): Promise<BaseToken> => {
    const key = `${chainId.toString()}-${collectionAddress}-${tokenId}`;

    let token = this.tCache.get(key);

    if (!token) {
      const { result } = await apiGet(`/collections/${chainId}:${collectionAddress}/nfts/${tokenId}`);
      token = result as BaseToken;

      this.tCache.set(key, token);
      this.emitter.emit('updated');
    }

    return token;
  };
}

export const CollectionCache = new _CollectionCache();

// ================================================

export function useCollectionCache() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    CollectionCache.emitter.on('updated', onCacheUpdate);

    return () => {
      CollectionCache.emitter.off('updated', onCacheUpdate);
    };
  }, []);

  const onCacheUpdate = () => {
    const t = Math.random();
    setTrigger(t);
  };

  const nameForTokenId = (chainId: BigNumberish, collectionAddress: string, tokenId: string): string => {
    CollectionCache.getToken(chainId, collectionAddress, tokenId);

    return tokenId;
  };

  const imageForTokenId = (chainId: BigNumberish, collectionAddress: string, tokenId: string): string => {
    const token = CollectionCache.getToken(chainId, collectionAddress, tokenId);

    if (token) {
      return token.metadata.title ?? token.metadata.name;
    }

    return tokenId;
  };

  const nameForCollection = (chainId: BigNumberish, collectionAddress: string): string => {
    const collection = CollectionCache.getCollection(chainId, collectionAddress);

    if (collection) {
      return collection.metadata.name;
    }

    return collectionAddress;
  };

  return {
    nameForTokenId,
    imageForTokenId,
    nameForCollection
  };
}
