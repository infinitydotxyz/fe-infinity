import { useFetch } from 'src/utils';

const getKey = (userId: string) => `/collections/favorites/${userId}`;

export function useCurrentFavoriteCollection(userId: string | undefined) {
  return useFetch<{ collection: string; chainId: string } | null>(userId ? getKey(userId) : null, {
    apiParams: { requiresAuth: true }
  });
}
