import { BaseToken, ChainId, Erc721Token, OrdersSnippet } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { ApiResponse, SITE_HOST, nFormatter } from 'src/utils';
import { fetchCollectionReservoirOrders, fetchCollectionTokens, fetchProfileTokens } from 'src/utils/astra-utils';
import { CartType } from 'src/utils/context/CartContext';
import { AggregatedOrder, ERC721TokenCartItem, ReservoirUserTopOffer, TokensFilter } from 'src/utils/types';

type ApiNftData = Erc721Token & {
  orderSnippet?: OrdersSnippet;
};

export function useCollectionListingsFetcher(
  collectionAddress: string | undefined,
  collectionChainId: ChainId,
  tokenId?: string
) {
  return useTokenFetcher<AggregatedOrder, ERC721TokenCartItem>({
    fetcher: (cursor) =>
      fetchCollectionReservoirOrders(collectionAddress || '', collectionChainId, tokenId, cursor, 'sell'),
    mapper: (data) => resvOrdersToCardData(data),
    execute: collectionAddress !== '',
    filter: {}
  });
}

export function useCollectionBidsFetcher(
  collectionAddress: string | undefined,
  collectionChainId: ChainId,
  tokenId?: string,
  collBidsOnly?: boolean
) {
  return useTokenFetcher<AggregatedOrder, ERC721TokenCartItem>({
    fetcher: (cursor) =>
      fetchCollectionReservoirOrders(collectionAddress || '', collectionChainId, tokenId, cursor, 'buy', collBidsOnly),
    mapper: (data) => resvOrdersToCardData(data),
    execute: collectionAddress !== '',
    filter: {}
  });
}

export function useCollectionTokenFetcher(
  collectionAddress: string | undefined,
  collectionChainId: ChainId,
  filter: TokensFilter
) {
  return useTokenFetcher<ApiNftData, ERC721TokenCartItem>({
    fetcher: (cursor, filters) =>
      fetchCollectionTokens(collectionAddress || '', collectionChainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOrderFields(data),
    execute: collectionAddress !== '',
    filter
  });
}

export function useProfileTokenFetcher(userAddress: string | undefined, chainId: string, filter: TokensFilter) {
  const fetcher = useTokenFetcher<ApiNftData, ERC721TokenCartItem>({
    fetcher: (cursor, filters) => fetchProfileTokens(userAddress || '', chainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOrderFields(data),
    execute: userAddress !== '',
    filter
  });

  useEffect(() => {
    fetcher.fetch(false);
  }, [userAddress, chainId, filter]);

  return fetcher;
}

function useTokenFetcher<From, To>({
  fetcher,
  mapper,
  execute,
  filter
}: {
  fetcher: (cursor: string, filters: TokensFilter) => Promise<ApiResponse>;
  mapper: (data: From[]) => To[];
  execute: boolean;
  filter: TokensFilter;
}) {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string>();
  const [cursor, setCursor] = useState('');
  const [data, setData] = useState<To[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async (loadMore: boolean) => {
    if (!isMounted || !execute) {
      return;
    }

    let response;
    if (loadMore) {
      response = await fetcher(cursor, filter);
    } else {
      response = await fetcher('', filter); // reset cursor
    }

    if (response.error) {
      setError(response.error);
      console.error(response.error);
    } else {
      const result = response.result;
      const newData = mapper(result.data);
      setCursor(result.cursor);
      setData(
        loadMore
          ? (state) => {
              // eliminate duplicates
              const newState = [...state, ...newData];
              const unique = newState.filter((item, index) => {
                return (
                  newState.findIndex((x) => (x as ERC721TokenCartItem).id === (item as ERC721TokenCartItem).id) ===
                  index
                );
              });
              return unique;
            }
          : newData
      );
      setHasNextPage(result.hasNextPage);
      setError(undefined);
    }

    setIsLoading(false);
  };

  return { error, data, hasNextPage, isLoading, fetch };
}

export const resvUserTopOffersToCardData = (topOffers: ReservoirUserTopOffer[]): ERC721TokenCartItem[] => {
  let result: ERC721TokenCartItem[] = (topOffers || []).map((item: ReservoirUserTopOffer) => {
    return resvUserTopOfferToCardData(item);
  });

  // remove any with blank images
  result = result.filter((x) => {
    return x.image && x.image.length > 0;
  });

  return result;
};

export const resvUserTopOfferToCardData = (item: ReservoirUserTopOffer): ERC721TokenCartItem => {
  const image = item?.token?.image ?? '';

  const result: ERC721TokenCartItem = {
    id: item.id,
    name: item?.token?.name ?? '',
    title: item?.token?.name ?? '',
    chainId: item.chainId,
    lastSalePriceEth: item?.token?.lastSalePrice?.amount.native ?? 0,
    validFrom: item?.validFrom * 1000 ?? 0,
    validUntil: item?.validUntil * 1000 ?? 0,
    collectionName: item?.token?.collection?.name ?? '',
    collectionSlug: '',
    image,
    price: item?.price?.amount?.native ?? 0,
    address: item.token?.contract,
    tokenId: item?.token?.tokenId ?? '',
    cartType: CartType.AcceptOffer,
    source: { ...item.source },
    criteria: { ...item.criteria }
  };

  return result;
};

export const resvOrdersToCardData = (tokens: AggregatedOrder[]): ERC721TokenCartItem[] => {
  let result: ERC721TokenCartItem[] = (tokens || []).map((item: AggregatedOrder) => {
    return resvOrderToCardData(item);
  });

  // remove any with blank images
  result = result.filter((x) => {
    return x.image && x.image.length > 0;
  });

  return result;
};

export const resvOrderToCardData = (item: AggregatedOrder): ERC721TokenCartItem => {
  const image = item?.criteria?.data?.token?.image ?? item?.criteria?.data?.collection?.image ?? '';

  const result: ERC721TokenCartItem = {
    id: item.id,
    name: item?.criteria?.data?.token?.name ?? item?.criteria?.data?.collection?.name ?? '',
    title: item?.criteria?.data?.token?.name ?? item?.criteria?.data?.collection?.name ?? '',
    chainId: item.chainId,
    lastSalePriceEth: item?.lastSalePriceEth ?? 0,
    mintPriceEth: item?.mintPriceEth ?? 0,
    validFrom: item?.validFrom * 1000 ?? 0,
    validUntil: item?.validUntil * 1000 ?? 0,
    orderSide: item?.side ?? '',
    collectionName: item?.criteria?.data?.collection?.name ?? '',
    collectionSlug: '',
    image,
    price: item?.price?.amount?.native ?? 0,
    address: item.contract,
    tokenId: item?.criteria?.data?.token?.tokenId ?? '',
    cartType: CartType.None,
    source: { ...item.source },
    criteria: { ...item.criteria }
  };

  return result;
};

export const nftsToCardDataWithOrderFields = (tokens: ApiNftData[]): ERC721TokenCartItem[] => {
  let result: ERC721TokenCartItem[] = (tokens || []).map((item: ApiNftData) => {
    return nftToCardDataWithOrderFields(item);
  });

  // remove any with blank images
  result = result.filter((x) => {
    return x.image && x.image.length > 0;
  });

  return result;
};

export const nftToCardDataWithOrderFields = (item: ApiNftData): ERC721TokenCartItem => {
  const image =
    item?.image?.url ||
    item?.alchemyCachedImage ||
    item?.metadata?.image ||
    item?.image?.originalUrl ||
    item?.zoraImage?.url ||
    '';

  const mintPriceEth = nFormatter(item?.mintPrice, 2);
  const lastSalePriceEth = nFormatter(item?.lastSalePriceEth, 2);

  const result: ERC721TokenCartItem = {
    id: item.chainId + ':' + item.collectionAddress + ':' + item.tokenId,
    name: item.metadata?.name ?? item.metadata?.title,
    title: item.collectionName ?? '',
    collectionName: item.collectionName ?? '',
    collectionSlug: item.collectionSlug ?? '',
    description: item.metadata?.description ?? '',
    image: image,
    displayType: item.displayType,
    isVideo: isVideoNft(item),
    price: item?.ordersSnippet?.listing?.orderItem?.startPriceEth ?? 0,
    chainId: item.chainId,
    tokenAddress: item.collectionAddress ?? item.collectionAddress,
    address: item.collectionAddress ?? item.collectionAddress,
    tokenId: item.tokenId,
    rarityRank: item.rarityRank,
    orderSnippet: item.ordersSnippet,
    hasBlueCheck: item.hasBlueCheck ?? false,
    attributes: item.metadata?.attributes ?? [],
    cartType: CartType.None,
    lastSalePriceEth,
    lastSaleTimestamp: item.lastSaleTimestamp,
    mintPriceEth,
    source: {
      name: '',
      domain: '',
      id: '',
      url: '',
      icon: SITE_HOST + '/favicon.ico'
    }
  };

  return result;
};

const isVideoNft = (token: BaseToken) => {
  // could also check image extension?
  return token.zoraImage?.mimeType === 'video/mp4';
};
