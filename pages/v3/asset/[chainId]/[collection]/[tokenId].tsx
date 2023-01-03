import { ChainId, CollectionAttributes, Erc721Metadata, OBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { getCurrentOBOrderPrice } from '@infinityxyz/lib-frontend/utils';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import NotFound404Page from 'pages/v3/not-found-404';
import { useEffect, useState } from 'react';
import { ActivityList, CancelModal, ListNFTModal, MakeOfferModal, SendNFTModal, TraitList } from 'src/components/asset';
import { LowerPriceModal } from 'src/components/asset/modals/lower-price-modal';
import { AButton, AOutlineButton } from 'src/components/astra';
import { APageBox } from 'src/components/astra/astra-page-box';
import {
  BlueCheck,
  CenteredContent,
  ErrorOrLoading,
  EthPrice,
  EZImage,
  NextLink,
  ReadMoreText,
  ShortAddress,
  Spinner,
  toastError,
  toastSuccess,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { isVideoNft } from 'src/components/gallery/token-fetcher';
import { WaitingForTxModal } from 'src/components/orderbook/waiting-for-tx-modal';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { useSaveReferral } from 'src/hooks/api/useSaveReferral';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, ellipsisAddress, getOwnerAddress, MISSING_IMAGE_URL, useFetch } from 'src/utils';
import { getOBOrderFromFirestoreOrderItem } from 'src/utils/exchange/orders';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useSWRConfig } from 'swr';

export const useFetchAssetInfo = (chainId: string, collection: string, tokenId: string) => {
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
      <APageBox title="Asset" showTitle={false}>
        <div className="flex flex-col max-w-screen-2xl mt-4"></div>
      </APageBox>
    );
  }
  return <AssetDetailContent chainId={query.chainId} collectionAddress={query.collection} tokenId={query.tokenId} />;
};

// ===========================================================

interface Props {
  chainId: string;
  collectionAddress: string;
  tokenId: string;
}

const AssetDetailContent = ({ chainId, collectionAddress, tokenId }: Props) => {
  /**
   * handle saving referrals for this page
   */
  useSaveReferral(collectionAddress, chainId as ChainId, tokenId);

  const { checkSignedIn, user } = useOnboardContext();

  const { isLoading, error, token, collectionAttributes, refreshAssetInfo } = useFetchAssetInfo(
    chainId,
    collectionAddress,
    tokenId
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

  if (isLoading) {
    return (
      <APageBox title="Loading..." showTitle={false}>
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      </APageBox>
    );
  }

  if (error) {
    return <NotFound404Page />;
  }

  if (!token || !token.metadata) {
    // the BE might have to index an NFT, so the first load will fail
    return <ErrorOrLoading fixed={true} error={false} noData={true} message="Not found. Try refreshing the browser." />;
  }

  const tokenMetadata = token.metadata as Erc721Metadata;

  const assetName = tokenMetadata.name
    ? `${tokenMetadata.name} - ${token.collectionName}`
    : tokenMetadata.name || token.collectionName || 'brrrr';

  const onClickBuy = async () => {
    try {
      // const signedListing = await fetchUserSignedOBOrder(token?.ordersSnippet?.listing?.orderItem?.id);
      // if (signedListing) {
      //   fulfillDrawerParams.addOrder(signedListing);
      //   fulfillDrawerParams.setShowDrawer(true);
      // }
    } catch (err) {
      toastError(`Failed to fetch signed listing`);
    }
  };

  const onClickAcceptOffer = async () => {
    try {
      // const signedOffer = await fetchUserSignedOBOrder(token?.ordersSnippet?.offer?.orderItem?.id);
      // if (signedOffer) {
      //   fulfillDrawerParams.addOrder(signedOffer);
      //   fulfillDrawerParams.setShowDrawer(true);
      // }
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
    <APageBox title={assetName} showTitle={false} className=" mt-6 overflow-y-auto overflow-x-clip">
      <div className="flex flex-col gap-10 mr-auto max-w-[1100px] md:flex-row md:items-start ">
        <ResponsiveImage token={token} />
        <div className="md:flex-1 ">
          <h3 className=" font-body text-2xl font-bold leading-normal tracking-wide pb-1">
            {tokenMetadata.name ? tokenMetadata.name : `${token.collectionName} #${token.tokenId}`}
          </h3>
          <div className="flex items-center mb-6">
            <NextLink
              href={`/v3/collection/${token.collectionSlug || `${token.chainId}:${token.collectionAddress}`}`}
              className="  font-heading tracking-tight mr-2"
            >
              <div>{token.collectionName || ellipsisAddress(token.collectionAddress) || 'Collection'}</div>
            </NextLink>
            {token.hasBlueCheck && <BlueCheck />}
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
                  <AOutlineButton onClick={onClickCancel}>
                    <div className="flex">
                      <span className="mr-4">Cancel</span>
                      <span>
                        <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                      </span>
                    </div>
                  </AOutlineButton>
                  <AOutlineButton onClick={onClickLowerPrice}>Lower Price</AOutlineButton>
                </>
              )}
            </div>
          )}

          {isNftOwner ? (
            <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
              <AOutlineButton onClick={onClickSend}>Send</AOutlineButton>
              {!isListingOwner && <AOutlineButton onClick={onClickList}>List</AOutlineButton>}
              {sellPriceEth && (
                <AOutlineButton className="" onClick={onClickAcceptOffer}>
                  <div className="flex">
                    Accept Offer <EthPrice label={`${sellPriceEth}`} className="ml-2" />
                  </div>
                </AOutlineButton>
              )}
            </div>
          ) : (
            // Other users' action buttons
            <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
              {buyPriceEth && (
                <AButton primary onClick={onClickBuy}>
                  <div className="flex">
                    <span className="mr-4">Buy</span>
                    <span>
                      <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                    </span>
                  </div>
                </AButton>
              )}
              <AOutlineButton onClick={onClickMakeOffer}>Make offer</AOutlineButton>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            <AOutlineButton
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
            </AOutlineButton>
          </div>

          {tokenMetadata.description ? (
            <>
              <p className="font-body mb-1 mt-6">Description</p>
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
              token={token}
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
    </APageBox>
  );
};

export default AssetDetailPage;

// ================================================================================

interface Props2 {
  token: Token;
}

const ResponsiveImage = ({ token }: Props2) => {
  const { innerWidth } = useScreenSize();

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

  // we want to show the entire nft at the correct aspect ratio
  // below is used on the cards
  // const { isCover, padding } = displayTypeToProps(token?.displayType);
  // const imageClass = twMerge('rounded-3xl overflow-clip w-80 mx-auto sm:w-96 md:w-96 lg:w-144', padding);

  const imageClass = '';
  let image = <EZImage src={imgUrl} className={imageClass} cover={false} center={false} />;

  if (isVideoNft(token)) {
    image = <video loop controls src={imgUrl} className={imageClass}></video>;
  }

  const height = Math.min(innerWidth ?? 500, 500);

  return (
    <div className=" md:flex-1" style={{ height: height, width: height }}>
      {image}
    </div>
  );
};
