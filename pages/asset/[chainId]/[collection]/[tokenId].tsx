import { CollectionAttributes, Erc721Metadata, OBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { getCurrentOBOrderPrice } from '@infinityxyz/lib-frontend/utils';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import NotFound404Page from 'pages/not-found-404';
import { useEffect, useState } from 'react';
import { ActivityList, CancelModal, ListNFTModal, MakeOfferModal, SendNFTModal, TraitList } from 'src/components/asset';
import { LowerPriceModal } from 'src/components/asset/modals/lower-price-modal';
import {
  Button,
  CenteredContent,
  EthPrice,
  NextLink,
  PageBox,
  ReadMoreText,
  ShortAddress,
  Spinner,
  SVG,
  toastError,
  toastSuccess,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { WaitingForTxModal } from 'src/components/orderbook/order-drawer/waiting-for-tx-modal';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { apiGet, ellipsisAddress, getOwnerAddress, MISSING_IMAGE_URL, useFetch } from 'src/utils';
import { useDrawerContext } from 'src/utils/context/DrawerContext';
import { getOBOrderFromFirestoreOrderItem } from 'src/utils/exchange/orders';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { fetchUserSignedOBOrder } from 'src/utils/orderbookUtils';
import { useSWRConfig } from 'swr';

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

// ===========================================================

const AssetDetailPage = () => {
  const { query } = useRouter();

  if (typeof query.chainId !== 'string' || typeof query.collection !== 'string' || typeof query.tokenId !== 'string') {
    return (
      <PageBox title="Asset" showTitle={false}>
        <div className="flex flex-col max-w-screen-2xl mt-4"></div>
      </PageBox>
    );
  }
  return <AssetDetailContent qchainId={query.chainId} qcollection={query.collection} qtokenId={query.tokenId} />;
};

// ===========================================================

interface Props {
  qchainId: string;
  qcollection: string;
  qtokenId: string;
}

const AssetDetailContent = ({ qchainId, qcollection, qtokenId }: Props) => {
  const { checkSignedIn, user } = useOnboardContext();

  const { isLoading, error, token, collectionAttributes, refreshAssetInfo } = useFetchAssetInfo(
    qchainId,
    qcollection,
    qtokenId
  );
  const { options, onChange, selected } = useToggleTab(['Activity', 'Orders'], 'Activity');
  const [showListModal, setShowListModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showLowerPriceModal, setShowLowerPriceModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [buyPriceEth, setBuyPriceEth] = useState('');
  const [sellPriceEth, setSellPriceEth] = useState('');
  const [sendTxHash, setSendTxHash] = useState('');
  const { fulfillDrawerParams } = useDrawerContext();

  const tokenOwner = getOwnerAddress(token);
  const isNftOwner = token ? user?.address === tokenOwner : false;

  const listingOwner = token?.ordersSnippet?.listing?.orderItem?.makerAddress ?? '';
  const isListingOwner = user?.address === listingOwner;

  useEffect(() => {
    if (token?.ordersSnippet?.listing?.hasOrder) {
      const obOrder: OBOrder = getOBOrderFromFirestoreOrderItem(token?.ordersSnippet?.listing?.orderItem);
      const price = getCurrentOBOrderPrice(obOrder);
      setBuyPriceEth(utils.formatEther(price));
    }

    if (token?.ordersSnippet?.offer?.hasOrder) {
      const obOrder: OBOrder = getOBOrderFromFirestoreOrderItem(token?.ordersSnippet?.offer?.orderItem);
      const price = getCurrentOBOrderPrice(obOrder);
      setSellPriceEth(utils.formatEther(price));
    }
  }, [token]);

  if (token?.image?.url) {
    token.image.url = token.image.url.replace('storage.opensea.io', 'openseauserdata.com');
  }

  // if cached url is null, try original url or the blank image
  if (token && !token?.image?.url) {
    token.image = token.image || {};
    token.image.url = token.alchemyCachedImage ?? token.image?.originalUrl ?? '';
  }

  const images = [token?.image?.url, token?.alchemyCachedImage, token?.metadata?.image, MISSING_IMAGE_URL].filter(
    (url) => !!url && !url.startsWith('ipfs')
  );
  const imgUrl = images[0];
  if (token && (!imgUrl || imgUrl.startsWith('ipfs'))) {
    if (token.image) {
      token.image.url = MISSING_IMAGE_URL;
    }
  }

  if (isLoading) {
    return (
      <PageBox title="Loading..." showTitle={false}>
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      </PageBox>
    );
  }

  if (error) {
    return <NotFound404Page />;
  }

  if (!token) {
    return null;
  }

  const tokenMetadata = token.metadata as Erc721Metadata;

  const assetName = tokenMetadata.name
    ? `${tokenMetadata.name} - ${token.collectionName}`
    : tokenMetadata.name || token.collectionName || 'brrrr';

  const onClickBuy = async () => {
    try {
      const signedListing = await fetchUserSignedOBOrder(token?.ordersSnippet?.listing?.orderItem?.id);
      if (signedListing) {
        fulfillDrawerParams.addOrder(signedListing);
        fulfillDrawerParams.setShowDrawer(true);
      }
    } catch (err) {
      toastError(`Failed to fetch signed listing`);
    }
  };

  const onClickAcceptOffer = async () => {
    try {
      const signedOffer = await fetchUserSignedOBOrder(token?.ordersSnippet?.offer?.orderItem?.id);
      if (signedOffer) {
        fulfillDrawerParams.addOrder(signedOffer);
        fulfillDrawerParams.setShowDrawer(true);
      }
    } catch (err) {
      toastError(`Failed to fetch signed offer`);
    }
  };

  const onClickMakeOffer = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowMakeOfferModal(true);
  };

  const onClickCancel = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowCancelModal(true);
  };

  const onClickSend = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowSendModal(true);
  };

  const onClickLowerPrice = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowLowerPriceModal(true);
  };

  const onClickList = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowListModal(true);
  };

  const modals = (
    <>
      {showListModal && (
        <ListNFTModal
          isOpen={showListModal}
          onClose={() => setShowListModal(false)}
          token={token}
          onDone={() => refreshAssetInfo()}
        />
      )}
      {showCancelModal && (
        <CancelModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          collectionAddress={token.collectionAddress ?? ''}
          token={token}
          onDone={() => refreshAssetInfo()}
        />
      )}
      {showLowerPriceModal && (
        <LowerPriceModal
          isOpen={showLowerPriceModal}
          onClose={() => setShowLowerPriceModal(false)}
          token={token}
          buyPriceEth={buyPriceEth}
          onDone={() => refreshAssetInfo()}
        />
      )}
      {showSendModal && (
        <SendNFTModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          token={token}
          onSubmit={(hash) => setSendTxHash(hash)}
        />
      )}
      {sendTxHash && <WaitingForTxModal title={'Sending NFTs'} txHash={sendTxHash} onClose={() => setSendTxHash('')} />}

      <MakeOfferModal
        isOpen={showMakeOfferModal}
        onClose={() => {
          return setShowMakeOfferModal(false);
        }}
        token={token}
        buyPriceEth={buyPriceEth}
        onDone={() => refreshAssetInfo()}
      />
    </>
  );

  return (
    <PageBox title={assetName} showTitle={false} className="flex flex-col max-w-screen-2xl mt-4">
      <div className="sm:flex">
        <div className="min-h-12 w-80 mx-auto sm:w-96 md:w-96 lg:w-144 sm:mr-6 md:mr-8 lg:mr-12 mb-4">
          <img className="rounded-3xl w-80 mx-auto sm:w-96 md:w-96 lg:w-144" src={imgUrl} alt={assetName} />
        </div>
        <div className="flex-1">
          <h3 className="text-black font-body text-2xl font-bold leading-normal tracking-wide pb-1">
            {tokenMetadata.name ? tokenMetadata.name : `${token.collectionName} #${token.tokenId}`}
          </h3>
          <div className="flex items-center sm:mb-6">
            <NextLink
              href={`/collection/${token.collectionSlug || `${token.chainId}:${token.collectionAddress}`}`}
              className="text-theme-light-800 font-heading tracking-tight mr-2"
            >
              <div>{token.collectionName || ellipsisAddress(token.collectionAddress) || 'Collection'}</div>
            </NextLink>
            {token.hasBlueCheck && <SVG.blueCheck className="h-5 w-5" />}
          </div>
          <ShortAddress
            label="Collection address:"
            address={token.collectionAddress ?? ''}
            href={`https://etherscan.io/address/${token.collectionAddress}`}
            tooltip={token.collectionAddress ?? ''}
          />
          <span className="text-base flex items-center mt-2">
            Token ID: <span className="ml-4 font-heading">#{token.tokenId}</span>
          </span>
          <ShortAddress
            className="mt-2"
            label="Owned by:"
            address={tokenOwner}
            href={`https://infinity.xyz/profile/${tokenOwner}`}
            tooltip={tokenOwner}
          />

          {isListingOwner && (
            // Listing owner's action buttons
            <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
              {buyPriceEth && (
                <>
                  <Button variant="outline" size="large" onClick={onClickCancel}>
                    <div className="flex">
                      <span className="mr-4">Cancel</span>
                      <span className="font-heading">
                        <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                      </span>
                    </div>
                  </Button>
                  <Button variant="outline" size="large" onClick={onClickLowerPrice}>
                    Lower Price
                  </Button>
                </>
              )}
            </div>
          )}

          {isNftOwner ? (
            <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
              <Button variant="outline" size="large" onClick={onClickSend}>
                Send
              </Button>
              {!isListingOwner && (
                <Button variant="outline" size="large" onClick={onClickList}>
                  List
                </Button>
              )}
              {sellPriceEth && (
                <Button variant="outline" size="large" className="" onClick={onClickAcceptOffer}>
                  <div className="flex">
                    Accept Offer <EthPrice label={`${sellPriceEth}`} className="ml-2" rowClassName="" />
                  </div>
                </Button>
              )}
            </div>
          ) : (
            // Other users' action buttons
            <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
              {buyPriceEth && (
                <Button variant="primary" size="large" onClick={onClickBuy}>
                  <div className="flex">
                    <span className="mr-4">Buy</span>
                    <span className="font-heading">
                      <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                    </span>
                  </div>
                </Button>
              )}
              <Button variant="outline" size="large" onClick={onClickMakeOffer}>
                Make offer
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            <Button
              variant="outline"
              size="large"
              onClick={async () => {
                const { error } = await apiGet(
                  `/collections/${token.chainId}:${token.collectionAddress}/nfts/${token.tokenId}/refresh-metadata`
                );

                if (!error) {
                  toastSuccess('Refresh metadata successful');

                  refreshAssetInfo();
                } else {
                  toastError('Refresh metadata failed');
                }
              }}
            >
              Refresh metadata
            </Button>
          </div>

          {tokenMetadata.description ? (
            <>
              <p className="font-body text-black mb-1 lg:mt-10">Description</p>
              <div>
                <ReadMoreText text={tokenMetadata.description ?? ''} min={100} ideal={150} max={300} />
              </div>
            </>
          ) : null}
        </div>
      </div>
      <TraitList traits={tokenMetadata.attributes ?? []} collectionTraits={collectionAttributes ?? {}} />
      <div className="relative min-h-[50vh]">
        <ToggleTab
          className="flex space-x-2 items-center relative max-w-xl top-[65px] pb-4 lg:pb-0 font-heading"
          options={options}
          selected={selected}
          onChange={onChange}
        />

        {selected === 'Activity' && (
          <div className="mt-[-22px]">
            <ActivityList
              chainId={token.chainId ?? '1'} // default
              collectionAddress={token.collectionAddress ?? ''}
              tokenId={token.tokenId}
            />
          </div>
        )}

        {selected === 'Orders' && (
          <div className="mt-4">
            <OrderbookContainer collectionId={token.collectionAddress} tokenId={token.tokenId} />
          </div>
        )}
      </div>
      {modals}
    </PageBox>
  );
};

export default AssetDetailPage;
