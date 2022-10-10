/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutatorOptions, useSWRConfig } from 'swr';

/**
 * Mutate SWR cache by multiple keys based on a regular expression.
 */
export function useMatchMutate() {
  const { cache, mutate } = useSWRConfig();

  return (matcher: RegExp, data?: any, opts?: boolean | MutatorOptions<any> | undefined) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance');
    }

    const keys = [];

    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        keys.push(key);
      }
    }

    const mutations = keys.map((key) => mutate(key, data, opts));

    return Promise.all(mutations);
  };
}
