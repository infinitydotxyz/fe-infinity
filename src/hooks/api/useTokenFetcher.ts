import { BaseToken, Erc721Token, OrdersSnippet } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { ApiResponse, nFormatter } from 'src/utils';
import { fetchCollectionTokens, fetchProfileTokens } from 'src/utils/astra-utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType } from 'src/utils/context/CartContext';
import { ERC721TokenCartItem, TokensFilter } from 'src/utils/types';
import { useNetwork } from 'wagmi';

type ApiNftData = Erc721Token & {
  orderSnippet?: OrdersSnippet;
};

export function useCollectionTokenFetcher(collectionAddress: string | undefined, filter: TokensFilter) {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  return useTokenFetcher<ApiNftData, ERC721TokenCartItem>({
    fetcher: (cursor, filters) => fetchCollectionTokens(collectionAddress || '', chainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOrderFields(data),
    execute: collectionAddress !== '',
    filter
  });
}

export function useProfileTokenFetcher(userAddress: string | undefined, filter: TokensFilter) {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  return useTokenFetcher<ApiNftData, ERC721TokenCartItem>({
    fetcher: (cursor, filters) => fetchProfileTokens(userAddress || '', chainId, { cursor, ...filters }),
    mapper: (data) => nftsToCardDataWithOrderFields(data),
    execute: userAddress !== '',
    filter
  });
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
      setData(loadMore ? (state) => [...state, ...newData] : newData);
      setHasNextPage(result.hasNextPage);
      setError(undefined);
    }

    setIsLoading(false);
  };

  return { error, data, hasNextPage, isLoading, fetch };
}

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

  const mintPriceEth = nFormatter(item?.mintPrice);
  const lastSalePriceEth = nFormatter(item?.lastSalePriceEth);

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
    price: item?.orderSnippet?.listing?.orderItem?.startPriceEth ?? 0,
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
    mintPriceEth
  };

  return result;
};

const isVideoNft = (token: BaseToken) => {
  // could also check image extension?
  return token.zoraImage?.mimeType === 'video/mp4';
};
