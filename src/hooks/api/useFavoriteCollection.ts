import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const getKey = (userId: string) => `/collections/favorites/${userId}`;

export function useUserFavoriteCollection() {
  const { user, chainId } = useOnboardContext();

  return useFetch<{ collectionAddress: string; collectionChainId: string } | null>(
    user && chainId ? getKey(`${chainId}:${user.address}`) : null,
    {
      apiParams: { requiresAuth: true }
    }
  );
}
