import { CollectionAttributes, Erc721Token, Token } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { nftToCardDataWithOrderFields } from 'src/hooks/api/useTokenFetcher';
import { ellipsisAddress, getChainScannerBase, nFormatter, useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { BasicTokenInfo } from 'src/utils/types';
import { borderColor, dropShadow, secondaryBgColor, secondaryTextColor } from 'src/utils/ui-constants';
import { useSWRConfig } from 'swr';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { BlueCheck, EthSymbol, EZImage, Modal, NextLink, ReadMoreText, ShortAddress, Spacer } from '../../common';
import { AButton } from '../astra-button';
import { ATraitList } from '../astra-trait-list';
import { ErrorOrLoading } from '../error-or-loading';

interface Props {
  data: BasicTokenInfo;
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

export const TokenCardModal = ({ data, modalOpen }: Props): JSX.Element | null => {
  const { token, error, collectionAttributes } = useFetchAssetInfo(data.chainId, data.collectionAddress, data.tokenId);
  const { chainId, user } = useOnboardContext();
  const [addedToCart, setAddedToCart] = useState(false);
  const { setCartType } = useCartContext();
  const { isNFTSelectable, toggleNFTSelection } = useAppContext();
  const router = useRouter();

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
  const priceDiff = listingPrice
    ? Number(listingPrice) - Number(floorPrice)
    : offerPrice
    ? Number(offerPrice) - Number(floorPrice)
    : 0;
  const percentDiff = floorPrice ? `${nFormatter((priceDiff / Number(floorPrice)) * 100)}%` : 0;

  const isOwner = user?.address && user?.address === token.owner?.toString();

  const removeViewParams = () => {
    const { pathname, query } = router;
    delete query['tokenId'];
    delete query['collectionAddress'];
    router.replace({ pathname, query }, undefined, { shallow: true });
  };

  return (
    <Modal
      isOpen={modalOpen}
      showActionButtons={false}
      onClose={() => {
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
              </div>
              <h3 className="font-body text-2xl font-bold mb-2">{token.tokenId}</h3>
              <ShortAddress
                label="Collection address:"
                address={token.collectionAddress ?? ''}
                href={`${getChainScannerBase(chainId)}/address/${token.collectionAddress}`}
                tooltip={token.collectionAddress ?? ''}
              />
              <ShortAddress
                className="mt-2"
                label="Owned by:"
                address={token?.owner?.toString() || ''}
                href={`https://flow.so/profile/${token?.owner?.toString() || ''}`}
                tooltip={token.owner?.toString() || ''}
              />

              {token.metadata.description && (
                <>
                  <div className="mt-2">
                    <ReadMoreText text={token.metadata.description ?? ''} min={100} ideal={150} max={300} />
                  </div>
                </>
              )}

              {(listingPrice || offerPrice) && (
                <div className={twMerge(secondaryBgColor, borderColor, 'rounded-xl p-6 border')}>
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

                    <AButton
                      className="w-52"
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
                      <div className={twMerge('text-xs font-medium ml-[-1px]', secondaryTextColor)}>
                        Floor difference
                      </div>
                      <div>{percentDiff ?? '-'}</div>
                    </div>

                    {listingPrice && (
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
                    )}
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
