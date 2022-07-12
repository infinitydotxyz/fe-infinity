import { Collection, Erc721Metadata, OBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { getCurrentOBOrderPrice } from '@infinityxyz/lib-frontend/utils';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import NotFound404Page from 'pages/not-found-404';
import { useEffect, useState } from 'react';
import { ActivityList, CancelModal, MakeOfferModal, SendNFTModal, TraitList } from 'src/components/asset';
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
  toastSuccess,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { WaitingForTxModal } from 'src/components/market/order-drawer/waiting-for-tx-modal';
import { OrderbookContainer } from 'src/components/market/orderbook-list';
import { getOwnerAddress, MISSING_IMAGE_URL, useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { getOBOrderFromFirestoreOrderItem, takeMultiplOneOrders } from 'src/utils/exchange/orders';
import { fetchUserSignedOBOrder } from 'src/utils/marketUtils';

const useFetchAssetInfo = (chainId: string, collection: string, tokenId: string) => {
  const NFT_API_ENDPOINT = `/collections/${chainId}:${collection}/nfts/${tokenId}`;
  const COL_API_ENDPOINT = `/collections/${chainId}:${collection}`;

  const tokenResponse = useFetch<Token>(NFT_API_ENDPOINT);
  const collectionResponse = useFetch<Collection>(COL_API_ENDPOINT);

  return {
    isLoading: tokenResponse.isLoading,
    error: tokenResponse.error,
    token: tokenResponse.result,
    collection: collectionResponse.result
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

/* notes

  asset page has drawer for purchase?  Placebid, makeOffer, how different

  owner === asset owner


*/

interface Props {
  qchainId: string;
  qcollection: string;
  qtokenId: string;
}

const AssetDetailContent = ({ qchainId, qcollection, qtokenId }: Props) => {
  const { checkSignedIn, user, providerManager, chainId } = useAppContext();
  const { isLoading, error, token, collection } = useFetchAssetInfo(qchainId, qcollection, qtokenId);
  const { options, onChange, selected } = useToggleTab(['Activity', 'Orders'], 'Activity');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showLowerPriceModal, setShowLowerPriceModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [buyPriceEth, setBuyPriceEth] = useState('');
  const [sendTxHash, setSendTxHash] = useState('');

  const isNftOwner = token ? user?.address === getOwnerAddress(token) : false;
  const listingOwner = token?.ordersSnippet?.listing?.orderItem?.makerAddress ?? '';
  const isListingOwner = user?.address === listingOwner;

  useEffect(() => {
    if (token?.ordersSnippet?.listing?.orderItem) {
      const obOrder: OBOrder = getOBOrderFromFirestoreOrderItem(token?.ordersSnippet?.listing?.orderItem);
      const price = getCurrentOBOrderPrice(obOrder);
      setBuyPriceEth(utils.formatEther(price));
    }
  }, [token]);

  if (token?.image?.url) {
    token.image.url = token.image.url.replace('storage.opensea.io', 'openseauserdata.com');
  }

  // if cached url is null, try original url or the blank image
  if (token && !token?.image?.url) {
    token.image = token.image || {};
    token.image.url = token.image?.originalUrl ?? '';
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
    // return (
    //   <PageBox title="Asset - Error" className="w-full h-full grid place-items-center">
    //     <div className="flex flex-col max-w-screen-2xl mt-4">
    //       <main>
    //         <p>Unable to load data.</p>
    //       </main>
    //     </div>
    //   </PageBox>
    // );
    // router.push(`/not-found-404?chainId=${qchainId}&collectionAddress=${qcollection}&tokenId=${qtokenId}`);
    // return null;
  }
  if (!token) {
    return null;
  }

  const tokenMetadata = token.metadata as Erc721Metadata;

  const assetName = tokenMetadata.name
    ? `${tokenMetadata.name} - ${token.collectionName}`
    : tokenMetadata.name || token.collectionName || 'brrrr';

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

  const modals = (
    <>
      {showCancelModal && (
        <CancelModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          collectionAddress={token.collectionAddress ?? ''}
          token={token}
        />
      )}
      {showLowerPriceModal && (
        <LowerPriceModal
          isOpen={showLowerPriceModal}
          onClose={() => setShowLowerPriceModal(false)}
          token={token}
          buyPriceEth={buyPriceEth}
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

      {showMakeOfferModal && (
        <MakeOfferModal
          isOpen={showMakeOfferModal}
          onClose={() => setShowMakeOfferModal(false)}
          token={token}
          buyPriceEth={buyPriceEth}
        />
      )}
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
              href={`/collection/${token.collectionSlug}`}
              className="text-theme-light-800 font-heading tracking-tight mr-2"
            >
              {token.collectionName}
            </NextLink>
            {token.hasBlueCheck && <SVG.blueCheck className="h-5 w-5" />}
          </div>
          <ShortAddress
            label="Contract address:"
            address={token.collectionAddress ?? ''}
            href={`https://etherscan.io/address/${token.collectionAddress}`}
            tooltip={token.collectionAddress ?? ''}
          />
          <span className="text-base flex items-center mt-2">
            Token ID: <span className="ml-4 font-heading">#{token.tokenId}</span>
          </span>

          {isListingOwner ? (
            // Listing owner's action buttons
            <div className="md:-ml-1.5">
              <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                {buyPriceEth && (
                  <Button variant="primary" size="large" onClick={onClickCancel}>
                    <div className="flex">
                      <span className="mr-4">Cancel</span>
                      <span className="font-heading">
                        <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                      </span>
                    </div>
                  </Button>
                )}
                {isNftOwner ? (
                  <Button variant="outline" size="large" onClick={onClickLowerPrice}>
                    Lower Price
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {isNftOwner ? (
            <div className="md:-ml-1.5">
              <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                <Button variant="outline" size="large" onClick={onClickSend}>
                  Send
                </Button>
              </div>
            </div>
          ) : (
            // Other users' action buttons
            <div className="md:-ml-1.5">
              <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                {buyPriceEth && (
                  <Button
                    variant="primary"
                    size="large"
                    onClick={async () => {
                      const signer = providerManager?.getEthersProvider().getSigner();
                      if (signer) {
                        const order = await fetchUserSignedOBOrder(token?.ordersSnippet?.listing?.orderItem?.id);
                        if (order) {
                          await takeMultiplOneOrders(signer, chainId, order.signedOrder);
                          toastSuccess('Sent txn successfully');
                        }
                      } else {
                        throw 'Signer is null';
                      }
                    }}
                  >
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
            </div>
          )}

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

      <TraitList traits={tokenMetadata.attributes ?? []} collectionTraits={collection?.attributes} />

      <div className="relative min-h-[1024px]">
        <ToggleTab
          className="flex space-x-2 items-center relative max-w-xl top-[65px] pb-4 lg:pb-0 font-heading"
          tabWidth="150px"
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
