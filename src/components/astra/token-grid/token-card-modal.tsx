import { ChainId, CollectionAttributes, Erc721Token, Token } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { nftToCardDataWithOrderFields } from 'src/hooks/api/useTokenFetcher';
import { ellipsisAddress, getChainScannerBase, nFormatter, useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { BasicTokenInfo } from 'src/utils/types';
import { borderColor, dropShadow, secondaryBgColor, secondaryTextColor } from 'src/utils/ui-constants';
import { useSWRConfig } from 'swr';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount, useNetwork } from 'wagmi';
import { BlueCheck, EthSymbol, EZImage, Modal, NextLink, ShortAddress, Spacer } from '../../common';
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
  const COLLECTION_ATTRIBUTES_API_ENDPOINT = `/collections/${chainId}:${collection}/attributes`;
  const tokenResponse = useFetch<Token>(NFT_API_ENDPOINT);
  const collectionAttributes = useFetch<CollectionAttributes>(COLLECTION_ATTRIBUTES_API_ENDPOINT);

  return {
    isLoading: tokenResponse.isLoading,
    error: tokenResponse.error,
    token: tokenResponse.result,
    collectionAttributes: collectionAttributes.result,
    refreshAssetInfo: () => {
      mutate(NFT_API_ENDPOINT);
      mutate(COLLECTION_ATTRIBUTES_API_ENDPOINT);
    }
  };
};

export const TokenCardModal = ({ data, modalOpen, isNFTSelected }: Props): JSX.Element | null => {
  const { token, error, collectionAttributes } = useFetchAssetInfo(data.chainId, data.collectionAddress, data.tokenId);
  const { chain } = useNetwork();
  const { address: user } = useAccount();
  const chainId = String(chain?.id ?? 1) as ChainId;
  const { setCartType } = useCartContext();
  const { isNFTSelectable, toggleNFTSelection } = useAppContext();
  const router = useRouter();

  const [addedToCart, setAddedToCart] = useState(isNFTSelected);

  if (error) {
    return <ErrorOrLoading error={!!error} noData message="No Data" />;
  }

  if (!token) {
    return null;
  }

  const listingPrice = nFormatter(token.ordersSnippet?.listing?.orderItem?.startPriceEth);
  const listingExpiry = token.ordersSnippet?.listing?.orderItem?.endTimeMs;
  const listingExpiryStr = listingExpiry ? format(listingExpiry) : '-';
  const listingTime = token.ordersSnippet?.listing?.orderItem?.startTimeMs;
  const listingTimeStr = listingTime ? format(listingTime) : '-';

  const offerPrice = nFormatter(token.ordersSnippet?.offer?.orderItem?.startPriceEth);
  const offerExpiry = token.ordersSnippet?.offer?.orderItem?.endTimeMs;
  const offerExpiryStr = offerExpiry ? format(offerExpiry) : '-';
  const offerTime = token.ordersSnippet?.offer?.orderItem?.startTimeMs;
  const offerTimeStr = offerTime ? format(offerTime) : '-';

  const floorPrice = data.collectionFloorPrice;
  const floorPriceDiff = listingPrice
    ? Number(listingPrice) - Number(floorPrice)
    : offerPrice
    ? Number(offerPrice) - Number(floorPrice)
    : 0;
  const floorPricePercentDiff = floorPrice ? `${nFormatter((floorPriceDiff / Number(floorPrice)) * 100)}%` : 0;

  const markupPrice = listingPrice || offerPrice;
  const markupPriceDiff =
    listingPrice && data.lastSalePriceEth
      ? Number(listingPrice) - Number(data.lastSalePriceEth)
      : offerPrice && data.lastSalePriceEth
      ? Number(offerPrice) - Number(data.lastSalePriceEth)
      : 0;
  const markupPricePercentDiff = markupPrice ? `${nFormatter((markupPriceDiff / Number(markupPrice)) * 100)}%` : 0;

  const isOwner = user && user === token.owner?.toString();

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
          const newCartType = isOwner ? CartType.TokenList : CartType.TokenOffer;
          const cartToken = nftToCardDataWithOrderFields(token as Erc721Token);
          cartToken.cartType = newCartType;
          if (isNFTSelectable(cartToken)) {
            setCartType(newCartType);
            setAddedToCart(!addedToCart);
            toggleNFTSelection(cartToken);
          }
        }}
      >
        {listingPrice && !isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Add to Cart'}</span>}
        {listingPrice && isOwner && <span>{addedToCart ? 'Remove from Cart' : 'Edit in Cart'}</span>}
        {offerPrice && isOwner && <span>{addedToCart ? 'Added to Cart' : 'Sell Now'}</span>}
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
                  href={`/collection/${token.collectionSlug || `${token.chainId}:${token.collectionAddress}`}`}
                  className="font-heading tracking-tight mr-2"
                >
                  <div>{token.collectionName || ellipsisAddress(token.collectionAddress) || 'Collection'}</div>
                </NextLink>
                {token.hasBlueCheck && <BlueCheck />}
                <ShortAddress
                  className="ml-2"
                  address={token.collectionAddress ?? ''}
                  href={`${getChainScannerBase(chainId)}/address/${token.collectionAddress}`}
                  tooltip={token.collectionAddress ?? ''}
                />
              </div>

              <h3 className="font-body text-2xl font-bold mb-2">{token.tokenId}</h3>

              <div className="flex justify-between">
                {data.collectionCreator && (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Creator</div>
                    <div>
                      <ShortAddress
                        address={isOwner ? 'You' : data.collectionCreator || ''}
                        textToCopy={data.collectionCreator || ''}
                        href={`https://flow.so/profile/${data.collectionCreator || ''}`}
                        tooltip={data.collectionCreator || ''}
                      />
                    </div>
                  </div>
                )}

                {token?.owner && (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Owner</div>
                    <div>
                      <ShortAddress
                        address={isOwner ? 'You' : token?.owner?.toString() || ''}
                        textToCopy={token?.owner?.toString() || ''}
                        href={`https://flow.so/profile/${token?.owner?.toString() || ''}`}
                        tooltip={token.owner?.toString() || ''}
                      />
                    </div>
                  </div>
                )}

                {data.mintPriceEth && (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Mint Price</div>
                    <div>
                      {data.mintPriceEth} {EthSymbol}
                    </div>
                  </div>
                )}

                {data.lastSalePriceEth && (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Last Price</div>
                    <div>
                      {data.lastSalePriceEth} {EthSymbol}
                    </div>
                  </div>
                )}

                {data.collectionFloorPrice && (
                  <div>
                    <div className={twMerge('text-xs font-medium mb-1', secondaryTextColor)}>Collection Floor</div>
                    <div>
                      {data.collectionFloorPrice} {EthSymbol}
                    </div>
                  </div>
                )}
              </div>

              {!(listingPrice || offerPrice) && addToCartBtn()}

              {(listingPrice || offerPrice) && (
                <div className={twMerge(secondaryBgColor, borderColor, 'rounded-xl p-8 border')}>
                  <div className="flex flex-row">
                    <div className="space-y-1">
                      <div className="text-lg font-medium">
                        {listingPrice && (
                          <span>
                            On sale for {listingPrice} {EthSymbol}
                          </span>
                        )}
                        {!listingPrice && offerPrice && (
                          <span>
                            Has an offer for {offerPrice} {EthSymbol}
                          </span>
                        )}
                      </div>

                      <div className={twMerge('text-xs font-medium', secondaryTextColor)}>
                        {listingExpiry && <span>Expires {listingExpiryStr}</span>}
                        {!listingExpiry && offerExpiry && <span>Expires {offerExpiryStr}</span>}
                      </div>
                    </div>
                    <Spacer />
                    {addToCartBtn()}
                  </div>

                  <div className="flex flex-row items-center justify-between mt-[26px]">
                    <div className="space-y-1">
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>
                        {listingTime && 'Listed'}
                        {!listingTime && offerTime && 'Offered'}
                      </div>
                      <div>
                        {listingTime && listingTimeStr}
                        {!listingTime && offerTime && offerTimeStr}
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
                      <div>{floorPricePercentDiff ?? '-'}</div>
                    </div>

                    <div className="space-y-1 mr-1.5">
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>Top offer</div>
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
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <EZImage
            src={token?.image?.url ?? token.alchemyCachedImage ?? token.image?.originalUrl ?? ''}
            className="h-80 w-80 rounded-lg"
          />
          <ATraitList
            traits={(token as Erc721Token).metadata.attributes ?? []}
            collectionTraits={collectionAttributes ?? {}}
          />
        </div>
      </div>
    </Modal>
  );
};
