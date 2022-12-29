import { useEffect, useState } from 'react';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { ApiResponse } from 'src/utils';
import { fetchCollectionTokens } from 'src/utils/astra-utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { ApiNftData, nftsToCardDataWithOfferFields } from '../gallery/token-fetcher';
import { OBFilters, useOrderbook } from '../orderbook/OrderbookContext';
import { Erc721TokenOffer } from './types';

export function useCollectionTokenFetcher(collectionAddress: string | undefined) {
  const { chainId } = useOnboardContext();

  return useTokenFetcher<ApiNftData, Erc721TokenOffer>({
    fetcher: (cursor, filters) => fetchCollectionTokens(collectionAddress || '', chainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOfferFields(data, '', '')
  });
}

export function useTokenFetcher<From, To>({
  fetcher,
  mapper
}: {
  fetcher: (cursor: string, filters: OBFilters) => Promise<ApiResponse>;
  mapper: (data: From[]) => To[];
}) {
  const { filters } = useOrderbook();
  const isMounted = useIsMounted();
  const [error, setError] = useState<string>();
  const [cursor, setCursor] = useState('');
  const [data, setData] = useState<To[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const reset = () => {
    setCursor('');
    setData([]);
  };

  const refetch = () => fetch(false);

  // reset whenever these filters change
  useEffect(reset, [
    filters.sort,
    filters.orderType,
    filters.minPrice,
    filters.maxPrice,
    filters.traitTypes,
    filters.traitValues
  ]);

  // refetch whenever 'reset' finished updating the state (also fired on mount)
  useEffect(() => {
    if (cursor === '' && data.length === 0) {
      refetch();
    }
  }, [cursor, data]);

  const fetch = async (loadMore: boolean) => {
    if (!isMounted) {
      return;
    }

    const response = await fetcher(cursor, filters);

    if (response.error) {
      setError(response.error);
      console.error(response.error);
    } else {
      const result = response.result;
      const newData = mapper(result.data);

      setData(loadMore ? (state) => [...state, ...newData] : newData);
      setCursor(result.cursor);
      setHasNextPage(result.hasNextPage);
      setError(undefined);
    }

    setIsLoading(false);
  };

  return { error, cursor, data, hasNextPage, isLoading, fetch };
}
