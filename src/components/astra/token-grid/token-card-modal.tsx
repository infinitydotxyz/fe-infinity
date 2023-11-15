import { NftSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ResponsiveSalesAndOrdersChart } from 'src/components/charts/sales-and-orders-chart';
import { ScatterChartType } from 'src/components/charts/types';
import { nftToCardDataWithOrderFields } from 'src/hooks/api/useTokenFetcher';
import etherscanLogo from 'src/images/etherscan-logo.png';
import {
  apiGet,
  ellipsisAddress,
  ellipsisString,
  getChainScannerBase,
  getNetworkName,
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
import { BlueCheckInline, ClipboardButton, EZImage, EthSymbol, Modal, NextLink, ShortAddress } from '../../common';
import { AButton } from '../astra-button';
import { ATraitList } from '../astra-trait-list';
import { ErrorOrLoading } from '../error-or-loading';
import useScreenSize from 'src/hooks/useScreenSize';

interface Props {
  data: BasicTokenInfo;
  isNFTSelected?: boolean;
  modalOpen: boolean;
  avatarUrl?: string;
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

const useCollectionInfo = (chainId: string, collectionAddress: string, collectionSlug: string) => {
  let COLLECTION_FLOOR_CREATOR_API_ENDPOINT = `/collections/${chainId}:${collectionAddress}/floorandtokencount`;
  if (collectionSlug) {
    COLLECTION_FLOOR_CREATOR_API_ENDPOINT = `/collections/${collectionSlug}/floorandtokencount`;
  }
  const collectionFloor = useFetch<{ floorPrice: number; tokenCount: number }>(COLLECTION_FLOOR_CREATOR_API_ENDPOINT);

  return {
    floorPrice: collectionFloor.result?.floorPrice,
    tokenCount: collectionFloor.result?.tokenCount
  };
};

export const TokenCardModal = ({ data, modalOpen, isNFTSelected, avatarUrl }: Props): JSX.Element | null => {
  const { token, error, bestAsk, bestBid, askValidFrom, askValidUntil, bidValidFrom, bidValidUntil } =
    useFetchAssetInfo(data.chainId, data.collectionAddress, data.tokenId);

  const collectionFloorAndTokenCount: { floorPrice?: number; tokenCount?: number } = useCollectionInfo(
    data.chainId,
    data.collectionAddress,
    data.collectionSlug ?? ''
  );

  const [salesAndOrdersChartData, setSalesAndOrdersChartData] = useState<NftSaleAndOrder[]>([]);
  const { address: user } = useAccount();
  const chainId = data.chainId;
  const { setCartType } = useCartContext();
  const { isNFTSelectable, toggleNFTSelection } = useAppContext();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(isNFTSelected);
  const { isMobile, isDesktop } = useScreenSize();

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

  // const collectionCreator = data.collectionCreator ?? '';

  const floorPrice = data.collectionFloorPrice ?? collectionFloorAndTokenCount.floorPrice;
  const floorPriceDiff = listingPrice
    ? Number(listingPrice) - Number(floorPrice)
    : offerPrice
    ? Number(offerPrice) - Number(floorPrice)
    : 0;
  const floorPricePercentDiff =
    floorPrice && Number(floorPrice) > 0 ? `${nFormatter((floorPriceDiff / Number(floorPrice)) * 100)}` : 0;

  const isOwner = user && trimLowerCase(user) === trimLowerCase(token?.token?.owner?.toString());
  // const isUserCollectionCreator = user && collectionCreator && trimLowerCase(user) === trimLowerCase(collectionCreator);

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
        className="px-5 py-2.5 font-semibold text-base md:text-sm dark:text-neutral-200 text-white rounded-6 w-full md:w-fit border-0"
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
        {!listingPrice && !offerPrice && !isOwner && <span>{addedToCart ? 'Added to Cart' : 'Add to Cart'}</span>}
      </AButton>
    );
  };

  return (
    <Modal
      isOpen={modalOpen}
      showActionButtons={false}
      modalStyle="!p-0 md:!p-4 mt-19"
      titleClassName="!mb-0 md:mb-5"
      showButton={true}
      onClose={() => {
        if (!isMobile) {
          if (event instanceof PointerEvent) {
            event.stopPropagation();
            event.preventDefault();
          }
          removeViewParams();
        }
      }}
      modalButton={
        <div className="h-fit md:hidden items-center justify-center fixed z-80 bottom-4 w-full left-0 px-3.5 mt-19 md:mt-0">
          <div className="shadow-buttonDropdown w-full flex flex-col space-y-0.75 rounded-4">
            <div className="relative md:flex justify-end w-full">{addToCartBtn()}</div>
            <div className="w-full">
              <AButton
                className="w-full border-0 bg-neutral-200 dark:bg-white py-2.5 !font-semibold text-base dark:text-neutral-200 text-white rounded-4 overflow-hidden leading-5"
                onClick={() => {
                  if (isMobile) {
                    if (event instanceof PointerEvent) {
                      event.stopPropagation();
                      event.preventDefault();
                    }
                    removeViewParams();
                  }
                }}
              >
                Close
              </AButton>
            </div>
          </div>
        </div>
      }
      panelClassName={twMerge(
        'max-w-6xl  rounded-t-20   md:rounded-9 !p-2.5 md:!p-7.5 dark:!bg-dark-bg !bg-zinc-300',
        dropShadow
      )}
    >
      <>
        <div className="flex md:hidden justify-center pb-2.5">
          <div className="w-18.75 h-1.25 bg-neutral-100 rounded-3"></div>
        </div>
        <div className="flex lg:flex-row flex-col gap-5 lg:gap-7.5 text-sm pb-20 md:pb-0">
          <div className="flex-1">
            <div className="flex flex-col gap-10 mr-auto lg:flex-row md:items-start">
              <div className="w-full lg:flex-1 space-y-5">
                <div className=" flex flex-col md:flex-row md:gap-3">
                  <div className="block lg:hidden">
                    <EZImage
                      src={token?.token?.image ?? ''}
                      className="h-96 w-full md:w-40 md:h-40 max-w-full md:rounded-lg rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col  justify-center md:justify-start lg:justify-center truncate w-full">
                    <div className="flex py-5 md:py-0 justify-between truncate w-full mobile-sm:gap-2 mobile-md:gap-2 gap-1 md:gap-0">
                      <div className="flex flex-col w-fit">
                        <div className="md:flex items-center md:mb-2">
                          <div className="flex items-center">
                            <div className="block md:hidden mr-1">
                              <EZImage
                                src={avatarUrl}
                                className="h-5 w-5 rounded-3 cursor-pointer hover:scale-90 duration-100"
                              />
                            </div>
                            <NextLink
                              href={`/chain/${getNetworkName(token.token.chainId)}/collection/${
                                (token.token.collection.slug as string | undefined) || token.token.contract
                              }`}
                              className="block tracking-tight mr-2 !text-22 leading-7 dark:text-gray-800 font-bold
                      text-neutral-700 line-clamp-1 !whitespace-normal "
                            >
                              <div className="line-clamp-1">
                                {token.token.collection.name || ellipsisAddress(token.token.contract) || 'Collection'}
                              </div>
                            </NextLink>
                            <div>
                              <BlueCheckInline />
                            </div>
                          </div>

                          <ShortAddress
                            className="md:ml-2"
                            address={token.token.contract ?? ''}
                            hrefStyle="dark:text-gray-800 text-neutral-700 text-sm font-medium"
                            href={`${getChainScannerBase(chainId)}/address/${token.token.contract}`}
                            tooltip={token.token.contract ?? ''}
                          />
                        </div>
                        <div className="hidden md:flex space-x-2.5 justify-center md:justify-start items-center w-fit">
                          <h3 className="font-body text-35 leading-10 font-bold">
                            {ellipsisString(token.token.tokenId)}
                          </h3>
                          <ClipboardButton textToCopy={token.token.tokenId} className={'h-4 w-4'} />
                        </div>
                      </div>
                      <div className="flex gap-2.5 h-fit">
                        <div className="flex flex-col">
                          {Number(floorPrice) > 0 ? (
                            <div>
                              <div className={twMerge(secondaryTextColor, 'text-sm font-medium dark:!text-gray-800')}>
                                Collection Floor
                              </div>
                              <div className="text-amber-700 font-medium text-right">
                                {nFormatter(parseFloat(String(floorPrice)), 2)} {EthSymbol}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex md:hidden space-x-2 justify-center md:justify-start w-full">
                      <h3 className="font-body text-35 font-bold mb-2">{ellipsisString(token.token.tokenId)}</h3>
                      <ClipboardButton textToCopy={token.token.tokenId} className={'h-4 w-4'} />
                    </div>
                  </div>
                </div>

                {listingPrice || offerPrice ? (
                  <div
                    className={twMerge(
                      secondaryBgColor,
                      borderColor,
                      'rounded-xl  border dark:border-zinc-700 dark:!bg-zinc-700 mt-5 lg:!mt-10 px-0.5 bg-light-borderLight'
                    )}
                  >
                    <div className="flex justify-between  md:grid  md:grid-cols-3 py-2.5 px-5 md:px-6.5">
                      <div className="flex flex-col gap-1 py-2.5">
                        <div className="text-sm text-neutral-700 dark:text-gray-800 font-medium leading-tight">
                          Owner Address
                        </div>
                        {/* <div>{token?.token?.owner}</div> */}
                        <div className="flex items-center space-x-2.5">
                          <ShortAddress
                            className=""
                            address={token?.token?.owner ?? ''}
                            hrefStyle="!text-neutral-700 dark:!text-white !text-base font-semibold"
                            href={`${getChainScannerBase(chainId)}/address/${token?.token?.owner}`}
                            tooltip={token?.token?.owner ?? ''}
                          />{' '}
                          <EZImage src={etherscanLogo.src} className="mr-2 h-3.75 w-3.75 dark:bg-white rounded-lg" />
                        </div>
                      </div>
                      <div className="flex justify-center py-2.5">
                        <div className="flex items-end md:items-start md:justify-center flex-col w-32 gap-1">
                          <div className="text-sm text-neutral-700 dark:text-gray-800 font-medium leading-tight">
                            List Date
                          </div>
                          <div className="dark:text-white text-neutral-700 text-base font-semibold">
                            {listingTime ? listingTimeStr : null}
                            {!listingTime && offerTime ? offerTimeStr : null}
                          </div>
                        </div>
                      </div>
                      <div className={twMerge('hidden text-xs font-medium', secondaryTextColor)}>
                        {listingExpiry ? <span>Expires {listingExpiryStr}</span> : null}
                        {!listingExpiry && offerExpiry ? <span>Expires {offerExpiryStr}</span> : null}
                      </div>
                      <div className="hidden md:relative md:flex justify-end py-2.5">{addToCartBtn()}</div>
                    </div>
                    <div className="hidden md:block h-px w-full dark:bg-dark-bg bg-zinc-300"></div>
                    <div className="flex flex-col-reverse md:grid  grid-cols-3 md:pt-2.5 px-5 md:px-6.5 gap-5 md:gap-0 pb-5 md:pb-2.5">
                      <div className="flex md:flex-col md:py-2.5  justify-between gap-0.5">
                        <div
                          className={twMerge('text-sm text-neutral-700 dark:text-gray-800 font-medium leading-tight')}
                        >
                          Top Bid
                        </div>
                        <div className="text-amber-700 text-17 font-normal font-supply">0</div>
                      </div>

                      <div className="gap-1  flex flex-col   md:mt-0 mt-1  md:items-center md:py-2.5">
                        <div className="md:w-32 flex flex-row md:flex-col justify-between gap-0.5">
                          <div
                            className={twMerge('text-sm text-neutral-700 dark:text-gray-800 font-medium leading-tight')}
                          >
                            Floor difference
                          </div>
                          <div className="!text-amber-700 text-17 font-normal font-supply">
                            {!isNaN(Number(floorPricePercentDiff)) ? floorPricePercentDiff + '%' : '-'}
                          </div>
                        </div>
                      </div>

                      <div className="gap-1  flex md:flex-col  md:items-end md:justify-center justify-between">
                        <div className="md:w-28.5 flex  flex-row md:flex-col justify-between w-full gap-0.5">
                          <div
                            className={twMerge('text-sm text-neutral-700 dark:text-gray-800 font-medium leading-tight')}
                          >
                            Sale Price
                          </div>
                          {offerPrice ? (
                            <div className="!text-amber-700 text-17 font-normal font-supply">
                              <span className="font-body mr-0.5">{EthSymbol}</span>
                              {offerPrice}
                            </div>
                          ) : (
                            <div>-</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="w-full lg:py-2">
                  {salesAndOrdersChartData.length > 0 && (
                    <ResponsiveSalesAndOrdersChart
                      graphType={ScatterChartType.SalesAndOrders}
                      data={salesAndOrdersChartData}
                      className="flex-col items-start !space-x-0"
                      titleStyle="dark:text-white font-bold !text-22 leading-7 text-neutral-700 dark:text-white"
                      subTitileStyle="dark:text-gray-800 text-16 font-semibold leading-5 text-neutral-700 dark:text-white"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="!md:m-0">
            {isDesktop && (
              <EZImage src={token?.token?.image ?? ''} className="md:h-70.5 md:w-70.5 h-40 w-40 max-w-full rounded-9" />
            )}

            <ATraitList
              traits={token.token?.attributes ?? []}
              totalTokenCount={collectionFloorAndTokenCount.tokenCount}
              className="bg-light-borderLight lg:mt-7.5 py-5 px-5 dark:bg-zinc-700 rounded-9"
            />
          </div>
        </div>
      </>
    </Modal>
  );
};
