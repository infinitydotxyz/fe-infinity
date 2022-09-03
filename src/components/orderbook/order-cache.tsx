import LRU from 'lru-cache';
import { ApiResponse } from 'src/utils';

export class OrderCache {
  cache: LRU<string, ApiResponse>;

  constructor() {
    const options = {
      max: 10,

      // how long to live in ms
      ttl: 1000 * 60 * 5,

      // return stale items before removing from cache?
      allowStale: false,
      updateAgeOnGet: false,
      updateAgeOnHas: false

      // async method to use for cache.fetch(), for
      // stale-while-revalidate type of behavior
      // fetchMethod: async (key, staleValue, { options, signal }) => {}
    };

    this.cache = new LRU(options);
  }

  get(key: string): ApiResponse | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: ApiResponse) {
    return this.cache.set(key, value);
  }
}
