import { BaseToken, Erc721Token, OrdersSnippet } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { ApiResponse } from 'src/utils';
import { fetchCollectionTokens, fetchProfileTokens } from 'src/utils/astra-utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { OBFilters, useOrderbookContext } from '../../utils/context/OrderbookContext';
import { Erc721TokenOffer } from './types';

type ApiNftData = Erc721Token & {
  orderSnippet?: OrdersSnippet;
};

export function useCollectionTokenFetcher(collectionAddress: string | undefined) {
  const { chainId } = useOnboardContext();

  return useTokenFetcher<ApiNftData, Erc721TokenOffer>({
    fetcher: (cursor, filters) => fetchCollectionTokens(collectionAddress || '', chainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOfferFields(data, '', ''),
    execute: collectionAddress !== ''
  });
}

export function useProfileTokenFetcher(userAddress: string | undefined) {
  const { chainId } = useOnboardContext();

  return useTokenFetcher<ApiNftData, Erc721TokenOffer>({
    fetcher: (cursor, filters) => fetchProfileTokens(userAddress || '', chainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOfferFields(data, '', ''),
    execute: userAddress !== ''
  });
}

export function useTokenFetcher<From, To>({
  fetcher,
  mapper,
  execute
}: {
  fetcher: (cursor: string, filters: OBFilters) => Promise<ApiResponse>;
  mapper: (data: From[]) => To[];
  execute: boolean;
}) {
  const { filters } = useOrderbookContext();
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
    filters.traitValues,
    filters.collections
  ]);

  // refetch whenever 'reset' finished updating the state (also fired on mount)
  useEffect(() => {
    if (cursor === '' && data.length === 0) {
      refetch();
    }
  }, [cursor, data]);

  const fetch = async (loadMore: boolean) => {
    if (!isMounted || !execute) {
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

const nftsToCardDataWithOfferFields = (
  tokens: ApiNftData[],
  collectionAddress: string,
  collectionName: string
): Erc721TokenOffer[] => {
  let result: Erc721TokenOffer[] = (tokens || []).map((item: ApiNftData) => {
    const image =
      item?.metadata?.image ||
      item?.image?.url ||
      item?.alchemyCachedImage ||
      item?.image?.originalUrl ||
      item?.zoraImage?.url ||
      '';

    const result: Erc721TokenOffer = {
      id: collectionAddress + '_' + item.tokenId,
      name: item.metadata?.name ?? item.metadata?.title,
      title: item.collectionName ?? collectionName,
      collectionName: item.collectionName ?? collectionName,
      collectionSlug: item.collectionSlug ?? '',
      description: item.metadata?.description ?? '',
      image: image,
      displayType: item.displayType,
      isVideo: isVideoNft(item),
      price: item?.orderSnippet?.listing?.orderItem?.startPriceEth ?? 0,
      chainId: item.chainId,
      tokenAddress: item.collectionAddress ?? collectionAddress,
      address: item.collectionAddress ?? collectionAddress,
      tokenId: item.tokenId,
      rarityRank: item.rarityRank,
      orderSnippet: item.ordersSnippet,
      hasBlueCheck: item.hasBlueCheck ?? false,
      attributes: item.metadata?.attributes ?? []
    };

    return result;
  });

  // remove any with blank images
  result = result.filter((x) => {
    return x.image && x.image.length > 0;
  });

  return result;
};

const isVideoNft = (token: BaseToken) => {
  // could also check image extension?
  return token.zoraImage?.mimeType === 'video/mp4';
};
