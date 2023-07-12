import { NftSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ResponsiveSalesAndOrdersChart } from 'src/components/charts/sales-and-orders-chart';
import { ScatterChartType } from 'src/components/charts/types';
import { nftToCardDataWithOrderFields } from 'src/hooks/api/useTokenFetcher';
import {
  apiGet,
  ellipsisAddress,
  ellipsisString,
  getChainScannerBase,
  nFormatter,
  reservoirTokenToERC721Token,
  useFetch
} from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { BasicTokenInfo, ReservoirTokenV6 } from 'src/utils/types';
import { borderColor, dropShadow, secondaryBgColor, secondaryTextColor } from 'src/utils/ui-constants';
import { useSWRConfig } from 'swr';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount } from 'wagmi';
import { ClipboardButton, EZImage, EthSymbol, Modal, NextLink, ShortAddress, Spacer } from '../../common';
import { AButton } from '../astra-button';
import { ATraitList } from '../astra-trait-list';
import { ErrorOrLoading } from '../error-or-loading';

interface Props {
  data: BasicTokenInfo;
  isNFTSelected?: boolean;
  modalOpen: boolean;
}

const useFetchAssetInfo = (chainId: string, collection: string, tokenId: string) => {
  const { mutate } = useSWRConfig();
  const NFT_API_ENDPOINT = `/collections/${chainId}:${collection}/nfts/${tokenId}`;
  const data = useFetch<ReservoirTokenV6>(NFT_API_ENDPOINT);

  return {
    isLoading: data.isLoading,
    error: data.error,
    token: data.result,
    bestAsk: data.result?.market?.floorAsk?.price?.amount?.native,
    askValidFrom: (data.result?.market?.floorAsk?.validFrom ?? 0) * 1000,
    askValidUntil: (data.result?.market?.floorAsk?.validUntil ?? 0) * 1000,
    bestBid: data.result?.market?.topBid?.price?.amount?.native,
    bidValidFrom: (data.result?.market?.topBid?.validFrom ?? 0) * 1000,
    bidValidUntil: (data.result?.market?.topBid?.validUntil ?? 0) * 1000,
    refreshAssetInfo: () => {
      mutate(NFT_API_ENDPOINT);
    }
  };
};

const useCollectionInfo = (chainId: string, collection: string) => {
  const COLLECTION_FLOOR_CREATOR_API_ENDPOINT = `/collections/${chainId}:${collection}/floorandtokencount`;
  const collectionFloor = useFetch<{ floorPrice: number; tokenCount: number }>(COLLECTION_FLOOR_CREATOR_API_ENDPOINT);

  return {
    floorPrice: collectionFloor.result?.floorPrice,
    tokenCount: collectionFloor.result?.tokenCount
  };
};

export const TokenCardModal = ({ data, modalOpen, isNFTSelected }: Props): JSX.Element | null => {
  const { token, error, bestAsk, bestBid, askValidFrom, askValidUntil, bidValidFrom, bidValidUntil } =
    useFetchAssetInfo(data.chainId, data.collectionAddress, data.tokenId);

  const collectionFloorAndTokenCount: { floorPrice?: number; tokenCount?: number } = useCollectionInfo(
    data.chainId,
    data.collectionAddress
  );

  const [salesAndOrdersChartData, setSalesAndOrdersChartData] = useState<NftSaleAndOrder[]>([]);
  const { address: user } = useAccount();
  const chainId = data.chainId;
  const { setCartType } = useCartContext();
  const { isNFTSelectable, toggleNFTSelection } = useAppContext();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(isNFTSelected);

  const fetchSalesAndOrdersForTimeBucket = async () => {
    const { result, error } = await apiGet(
      `/collections/${chainId}:${data.collectionAddress}/nfts/${data.tokenId}/salesorders`
    );

    if (error) {
      console.error(error);
      return;
    }

    setSalesAndOrdersChartData(result);
  };

  useEffect(() => {
    fetchSalesAndOrdersForTimeBucket();
  }, []);

  if (error) {
    return <ErrorOrLoading error={!!error} noData message="No Data" />;
  }

  if (!token) {
    return null;
  }

  const listingPrice = nFormatter(bestAsk, 2);
  const listingExpiry = askValidUntil;
  const listingExpiryStr = listingExpiry ? format(listingExpiry) : '-';
  const listingTime = askValidFrom;
  const listingTimeStr = listingTime ? format(listingTime) : '-';

  const offerPrice = nFormatter(bestBid, 2);
  const offerExpiry = bidValidUntil;
  const offerExpiryStr = offerExpiry ? format(offerExpiry) : '-';
  const offerTime = bidValidFrom;
  const offerTimeStr = offerTime ? format(offerTime) : '-';

  const collectionCreator = data.collectionCreator ?? '';

  const floorPrice = data.collectionFloorPrice ?? collectionFloorAndTokenCount.floorPrice;
  const floorPriceDiff = listingPrice
    ? Number(listingPrice) - Number(floorPrice)
    : offerPrice
    ? Number(offerPrice) - Number(floorPrice)
    : 0;
  const floorPricePercentDiff =
    floorPrice && Number(floorPrice) > 0 ? `${nFormatter((floorPriceDiff / Number(floorPrice)) * 100)}` : 0;

  const markupPrice = listingPrice || offerPrice;
  const markupPriceDiff =
    listingPrice && data.lastSalePriceEth
      ? Number(listingPrice) - Number(data.lastSalePriceEth)
      : offerPrice && data.lastSalePriceEth
      ? Number(offerPrice) - Number(data.lastSalePriceEth)
      : 0;
  const markupPricePercentDiff = markupPrice ? `${nFormatter((markupPriceDiff / Number(markupPrice)) * 100)}%` : 0;

  const isOwner = user && trimLowerCase(user) === trimLowerCase(token?.token?.owner?.toString());
  const isUserCollectionCreator = user && collectionCreator && trimLowerCase(user) === trimLowerCase(collectionCreator);

  const preCartToken = reservoirTokenToERC721Token(token);
  const cartToken = nftToCardDataWithOrderFields(preCartToken);

  let newCartType = CartType.TokenBuy;
  if (isOwner) {
    if (offerPrice) {
      newCartType = CartType.AcceptOffer;
    } else {
      newCartType = CartType.TokenList;
    }
  } else {
    if (listingPrice) {
      newCartType = CartType.TokenBuy;
    } else {
      newCartType = CartType.TokenBid;
    }
  }
  cartToken.cartType = newCartType;
  setCartType(newCartType);

  let cartTokenPrice = cartToken.price;
  if (isOwner) {
    if (offerPrice) {
      cartTokenPrice = Number(offerPrice);
    } else if (listingPrice) {
      cartTokenPrice = Number(listingPrice);
    }
  } else {
    if (listingPrice) {
      cartTokenPrice = Number(listingPrice);
    } else if (offerPrice) {
      cartTokenPrice = Number(offerPrice);
    }
  }
  cartToken.price = cartTokenPrice;

  const removeViewParams = () => {
    const { pathname, query } = router;
    delete query['tokenId'];
    delete query['collectionAddress'];
    router.replace({ pathname, query }, undefined, { shallow: true });
  };

  const addToCartBtn = () => {
    return (
      <AButton
        className="w-52 p-4"
        primary
        onClick={() => {
          if (isNFTSelectable(cartToken)) {
            setAddedToCart(!addedToCart);
            toggleNFTSelection(cartToken);
          }
        }}
      >
        {listingPrice && offerPrice && isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Sell Now'}</span>}
        {listingPrice && offerPrice && !isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Add to Cart'}</span>}
        {listingPrice && !offerPrice && !isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Add to Cart'}</span>}
        {listingPrice && !offerPrice && isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Edit in Cart'}</span>}
        {!listingPrice && offerPrice && isOwner && <span>{addedToCart ? 'Added to Cart' : 'Sell Now'}</span>}
        {!listingPrice && !offerPrice && isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Sell'}</span>}
        {!listingPrice && offerPrice && !isOwner && <span>{addedToCart ? 'Added to Cart' : 'Bid higher'}</span>}
        {!listingPrice && !offerPrice && !isOwner ? <span>{addedToCart ? 'Added to Cart' : 'Add to Cart'}</span> : null}
      </AButton>
    );
  };

  return (
    <Modal
      isOpen={modalOpen}
      showActionButtons={false}
      onClose={() => {
        if (event instanceof PointerEvent) {
          event.stopPropagation();
          event.preventDefault();
        }
        removeViewParams();
      }}
      panelClassName={twMerge('max-w-6xl rounded-3xl', dropShadow)}
    >
      <div className="flex space-x-4 text-sm">
        <div className="flex-1">
          <div className="flex flex-col gap-10 mr-auto md:flex-row md:items-start">
            <div className="md:flex-1 space-y-4">
              <div className="flex items-center mb-2">
                <NextLink
                  href={`/collection/${token.token.chainId}:${token.token.contract}`}
                  className="font-heading tracking-tight mr-2"
                >
                  <div>{token.token.collection.name || ellipsisAddress(token.token.contract) || 'Collection'}</div>
                </NextLink>
                <ShortAddress
                  className="ml-2"
                  address={token.token.contract ?? ''}
                  href={`${getChainScannerBase(chainId)}/address/${token.token.contract}`}
                  tooltip={token.token.contract ?? ''}
                />
              </div>

              <div className="flex space-x-2">
                <h3 className="font-body text-2xl font-bold mb-2">{ellipsisString(token.token.tokenId)}</h3>
                <ClipboardButton textToCopy={token.token.tokenId} className={'h-4 w-4 mt-2.5'} />
              </div>

              <div className="flex justify-between">
                {collectionCreator ? (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Creator</div>
                    <div>
                      <ShortAddress
                        address={isUserCollectionCreator ? 'You' : collectionCreator || ''}
                        textToCopy={collectionCreator || ''}
                        href={`https://pixelpack.io/profile/${collectionCreator || ''}`}
                        tooltip={collectionCreator || ''}
                      />
                    </div>
                  </div>
                ) : null}

                {token?.token?.owner ? (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Owner</div>
                    <div>
                      <ShortAddress
                        address={isOwner ? 'You' : token?.token?.owner?.toString() || ''}
                        textToCopy={token?.token?.owner?.toString() || ''}
                        href={`https://pixelpack.io/profile/${token?.token?.owner?.toString() || ''}`}
                        tooltip={token.token?.owner?.toString() || ''}
                      />
                    </div>
                  </div>
                ) : null}

                {data.mintPriceEth ? (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Mint Price</div>
                    <div>
                      {nFormatter(parseFloat(String(data.mintPriceEth)), 2)} {EthSymbol}
                    </div>
                  </div>
                ) : null}

                {data.lastSalePriceEth ? (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Last Price</div>
                    <div>
                      {nFormatter(parseFloat(String(data.lastSalePriceEth)), 2)} {EthSymbol}
                    </div>
                  </div>
                ) : null}

                {Number(floorPrice) > 0 ? (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Collection Floor</div>
                    <div>
                      {nFormatter(parseFloat(String(floorPrice)), 2)} {EthSymbol}
                    </div>
                  </div>
                ) : null}
              </div>

              {!(listingPrice || offerPrice) ? addToCartBtn() : null}

              {listingPrice || offerPrice ? (
                <div className={twMerge(secondaryBgColor, borderColor, 'rounded-xl p-[30px] border')}>
                  <div className="flex flex-row">
                    <div className="space-y-1">
                      <div className="text-lg font-medium">
                        {listingPrice ? (
                          <span>
                            On sale for {listingPrice} {EthSymbol}
                          </span>
                        ) : null}
                        {!listingPrice && offerPrice ? (
                          <span>
                            Has an offer for {offerPrice} {EthSymbol}
                          </span>
                        ) : null}
                      </div>

                      <div className={twMerge('text-xs font-medium', secondaryTextColor)}>
                        {listingExpiry ? <span>Expires {listingExpiryStr}</span> : null}
                        {!listingExpiry && offerExpiry ? <span>Expires {offerExpiryStr}</span> : null}
                      </div>
                    </div>
                    <Spacer />
                    {addToCartBtn()}
                  </div>

                  <div className="flex flex-row items-center justify-between mt-[26px]">
                    <div className="space-y-1">
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>
                        {listingTime ? 'Listed' : null}
                        {!listingTime && offerTime ? 'Offered' : null}
                      </div>
                      <div>
                        {listingTime ? listingTimeStr : null}
                        {!listingTime && offerTime ? offerTimeStr : null}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>Markup</div>
                      <div>{markupPricePercentDiff ?? '-'}</div>
                    </div>

                    <div className="space-y-1">
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>
                        Floor difference
                      </div>
                      <div>{Number(floorPricePercentDiff) > 0 ? floorPricePercentDiff + '%' : '-'}</div>
                    </div>

                    <div className="space-y-1 mr-1.5">
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>Top bid</div>
                      {offerPrice ? (
                        <div>
                          {offerPrice} {EthSymbol}
                        </div>
                      ) : (
                        <div>-</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-full py-2">
                {salesAndOrdersChartData.length > 0 && (
                  <ResponsiveSalesAndOrdersChart
                    graphType={ScatterChartType.SalesAndOrders}
                    data={salesAndOrdersChartData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <EZImage src={token?.token?.image ?? ''} className="h-80 w-80 rounded-lg" />
          <ATraitList
            traits={token.token?.attributes ?? []}
            totalTokenCount={collectionFloorAndTokenCount.tokenCount}
          />
        </div>
      </div>
    </Modal>
  );
};
