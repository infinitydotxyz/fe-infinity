import { useFetch } from 'src/utils';

export const getCurationQuotaKey = (userId: string) => `/user/${userId}/curated/quota`;

/**
 * Custom hook to fetch the total 'actual' amount of available votes from the API.
 * The value is calculated from the balance read from the contract and existing database records.
 */
export function useCurationQuota(userId?: string) {
  return useFetch<{ availableVotes: number }>(userId ? getCurationQuotaKey(userId) : null);
}
