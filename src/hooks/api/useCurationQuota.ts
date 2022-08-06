import { useFetch } from 'src/utils';
import { CurationQuotaDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curation-quota.dto';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const getCurationQuotaKey = (userId: string) => `/user/${userId}/curated/quota`;

/**
 * Custom hook to fetch the total 'actual' amount of available votes from the API.
 * The value is calculated from the balance read from the contract and existing database records.
 */
export function useCurationQuota(userId: string | null) {
  return useFetch<CurationQuotaDto>(userId ? getCurationQuotaKey(userId) : null);
}

/**
 * Custom hook to fetch the total 'actual' amount of available votes for the current user from the API.
 * See {@link useCurationQuota}.
 */
export function useUserCurationQuota() {
  const { user, chainId } = useOnboardContext();

  return useCurationQuota(user?.address ? `${chainId}:${user.address}` : null);
}
