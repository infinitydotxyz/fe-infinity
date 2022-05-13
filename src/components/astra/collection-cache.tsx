import { BaseCollection } from '@infinityxyz/lib/types/core';
import { apiGet } from 'src/utils';
import { CollectionSearchDto } from 'src/utils/types/collection-types';

export class CollectionCache {
  private static instance: CollectionCache;

  private cache: Map<string, BaseCollection>;

  public static shared() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {
    this.cache = new Map<string, BaseCollection>();
  }

  async collection(collection: CollectionSearchDto): Promise<BaseCollection> {
    const key = `${collection.address}:${collection.chainId}`;
    const cached = this.cache.get(key);

    if (cached) {
      return cached;
    }

    const { result } = await apiGet(`/collections/${collection.chainId}:${collection.address}`);

    const baseCollection = result as BaseCollection;
    this.cache.set(key, baseCollection);

    return baseCollection;
  }
}
