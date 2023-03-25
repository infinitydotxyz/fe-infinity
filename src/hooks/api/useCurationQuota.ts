import { CurationQuotaDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curation-quota.dto';
import { useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useAccount, useNetwork } from 'wagmi';

export const getCurationQuotaKey = (userId: string) => `/user/${userId}/curatedQuota`;

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
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);
  const { address: user } = useAccount();

  return useCurationQuota(user ? `${chainId}:${user}` : null);
}
