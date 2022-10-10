import { FavoriteCollectionPhaseDto } from '@infinityxyz/lib-frontend/types/dto';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export function useFavorites() {
  const { chainId } = useOnboardContext();
  return useFetch<FavoriteCollectionPhaseDto[]>(chainId ? `/favorites?chainId=${chainId}` : null);
}
