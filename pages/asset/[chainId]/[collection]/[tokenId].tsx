import { Collection, Erc721Metadata, OBOrder, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
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
  toastError,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { BuyNFTDrawer } from 'src/components/market/order-drawer/buy-nft-drawer';
import { WaitingForTxModal } from 'src/components/market/order-drawer/waiting-for-tx-modal';
import { OrderbookContainer } from 'src/components/market/orderbook-list';
import { ellipsisAddress, getOwnerAddress, MISSING_IMAGE_URL, useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { getOBOrderFromFirestoreOrderItem } from 'src/utils/exchange/orders';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { fetchUserSignedOBOrder } from 'src/utils/marketUtils';
import { AcceptOfferDrawer } from 'src/components/market/order-drawer/accept-offer-drawer';

const useFetchAssetInfo = (chainId: string, collection: string, tokenId: string, userAddress: string) => {
  const NFT_API_ENDPOINT = `/collections/${chainId}:${collection}/nfts/${tokenId}`;
  const COL_API_ENDPOINT = `/collections/${chainId}:${collection}`;
  const NFT_OFFERS_ENDPOINT = `/orders/${userAddress}?limit=1&minPrice=0.000001&orderByDirection=desc&takerAddress=${userAddress}&collectionAddress=${collection}&tokenId=${tokenId}&isSellOrder=false`;

  const tokenResponse = useFetch<Token>(NFT_API_ENDPOINT);
  const collectionResponse = useFetch<Collection>(COL_API_ENDPOINT);
  const offersResponse = useFetch<{ data: SignedOBOrder[] }>(NFT_OFFERS_ENDPOINT);

  return {
    isLoading: tokenResponse.isLoading,
    error: tokenResponse.error,
    token: tokenResponse.result,
    collection: collectionResponse.result,
    offers: offersResponse.result?.data ?? []
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
  const { checkSignedIn, user } = useAppContext();
  const { setOrderDrawerOpen } = useOrderContext();
  const { isLoading, error, token, collection, offers } = useFetchAssetInfo(
    qchainId,
    qcollection,
    qtokenId,
    user?.address ?? ''
  );
  console.log('offers', offers);
  const { options, onChange, selected } = useToggleTab(['Activity', 'Orders'], 'Activity');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showLowerPriceModal, setShowLowerPriceModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [showBuyDrawer, setShowBuyDrawer] = useState(false);
  const [buyTxHash, setBuyTxHash] = useState('');
  const [buyPriceEth, setBuyPriceEth] = useState('');
  const [sendTxHash, setSendTxHash] = useState('');
  const [signedOBOrder, setSignedOBOrder] = useState<SignedOBOrder | null>(null);
  const [showAcceptOfferDrawer, setShowAcceptOfferDrawer] = useState(false);

  const tokenOwner = getOwnerAddress(token);
  const isNftOwner = token ? user?.address === tokenOwner : false;
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

      {signedOBOrder && (
        <BuyNFTDrawer
          title="Buy NFT"
          submitTitle="Buy"
          orders={[signedOBOrder]}
          open={showBuyDrawer}
          onClose={() => {
            setShowBuyDrawer(false);
            setOrderDrawerOpen(false);
          }}
          onSubmitDone={(hash: string) => {
            setShowBuyDrawer(false);
            setOrderDrawerOpen(false);
            setBuyTxHash(hash);
          }}
        />
      )}
      {buyTxHash && <WaitingForTxModal title={'Buying NFT'} txHash={buyTxHash} onClose={() => setBuyTxHash('')} />}

      {offers && offers.length > 0 ? (
        <AcceptOfferDrawer
          orders={[offers[0]]}
          open={showAcceptOfferDrawer}
          onClose={() => {
            setShowAcceptOfferDrawer(false);
            setOrderDrawerOpen(false);
          }}
          onClickRemove={() => {}}
        />
      ) : null}
    </>
  );

  const fetchSignedOBOrder = async () => {
    try {
      const signedOBOrder = await fetchUserSignedOBOrder(token?.ordersSnippet?.listing?.orderItem?.id);
      setSignedOBOrder(signedOBOrder);
      return signedOBOrder;
    } catch (err) {
      toastError(`Failed to fetch order`);
    }
  };

  const onClickBuy = async () => {
    // - direct buy:
    // const signer = providerManager?.getEthersProvider().getSigner();
    // if (signer) {
    //   const order = await fetchUserSignedOBOrder(token?.ordersSnippet?.listing?.orderItem?.id);
    //   if (order) {
    //     await takeMultipleOneOrders(signer, chainId, [order.signedOrder]);
    //     toastSuccess('Sent txn successfully');
    //   }
    // } else {
    //   throw 'Signer is null';
    // }
    const signedOBOrder = await fetchSignedOBOrder();
    if (signedOBOrder) {
      setShowBuyDrawer(true);
    }
  };

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
              {token.collectionName || ellipsisAddress(token.collectionAddress) || 'Collection'}
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
            href={`https://etherscan.io/address/${tokenOwner}`}
            tooltip={tokenOwner}
          />

          {isListingOwner ? (
            // Listing owner's action buttons
            <div className="md:-ml-1.5">
              <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                {buyPriceEth && (
                  <Button variant="outline" size="large" onClick={onClickCancel}>
                    <div className="flex">
                      <span className="mr-4">Cancel</span>
                      <span className="font-heading">
                        <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                      </span>
                    </div>
                  </Button>
                )}
                {isNftOwner ? (
                  <>
                    <Button variant="outline" size="large" onClick={onClickLowerPrice}>
                      Lower Price
                    </Button>
                    {offers && offers.length > 0 ? (
                      <Button
                        variant="outline"
                        size="large"
                        className=""
                        onClick={() => setShowAcceptOfferDrawer(true)}
                      >
                        <div className="flex">
                          Accept Offer{' '}
                          <EthPrice label={`${offers[0].startPriceEth}`} className="ml-2" rowClassName="" />
                        </div>
                      </Button>
                    ) : null}
                  </>
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
