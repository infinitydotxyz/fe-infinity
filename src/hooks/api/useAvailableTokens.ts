import { useFetch } from 'src/utils';
import { CurationQuotaDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curation-quota.dto';
import { useAppContext } from 'src/utils/context/AppContext';

export const getCurationQuotaKey = (userId: string) => `/user/${userId}/curated/quota`;

/**
 * Custom hook to fetch the total 'actual' amount of available votes from the API.
 * The value is calculated from the balance read from the contract and existing database records.
 */
export function useCurationQuota(userId?: string) {
  const { user } = useAppContext();
  const id = userId || user?.address;
  return useFetch<CurationQuotaDto>(id ? getCurationQuotaKey(id) : null);
}
