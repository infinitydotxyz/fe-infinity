import { useRouter } from 'next/router';
import {
  Button,
  ShortAddress,
  PageBox,
  ReadMoreText,
  SVG,
  NextLink,
  Spinner,
  EthPrice,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { BLANK_IMAGE_URL, useFetch } from 'src/utils';
import { Token, Collection, Erc721Metadata, OBOrder } from '@infinityxyz/lib-frontend/types/core';
import { TraitList, CancelModal, TransferNFTModal, PlaceBidModal, MakeOfferModal } from 'src/components/asset';
import { useEffect, useState } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { getOBOrderFromFirestoreOrderItem } from 'src/utils/exchange/orders';
import { utils } from 'ethers';
import { getCurrentOBOrderPrice } from '@infinityxyz/lib-frontend/utils';
import { LowerPriceModal } from 'src/components/asset/modals/lower-price-modal';
import { OrderbookContainer } from 'src/components/market/orderbook-list';

const useFetchAssetInfo = (chainId: string, collection: string, tokenId: string) => {
  const NFT_API_ENDPOINT = `/collections/${chainId}:${collection}/nfts/${tokenId}`;
  const COL_API_ENDPOINT = `/collections/${chainId}:${collection}`;

  const tokenResponse = useFetch<Token>(NFT_API_ENDPOINT);
  const collectionResponse = useFetch<Collection>(COL_API_ENDPOINT);

  return {
    isLoading: tokenResponse.isLoading || collectionResponse.isLoading,
    error: tokenResponse.error || collectionResponse.error,
    token: tokenResponse.result,
    collection: collectionResponse.result
  };
};

// ===========================================================

const AssetDetailPage = () => {
  const { query } = useRouter();

  if (typeof query.chainId !== 'string' || typeof query.collection !== 'string' || typeof query.tokenId !== 'string') {
    return (
      <PageBox title="Asset">
        <div className="flex flex-col max-w-screen-2xl mt-4">
          <main>
            <p>Error: Invalid page parameters or not signed in.</p>
          </main>
        </div>
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
  const { isLoading, error, token, collection } = useFetchAssetInfo(qchainId, qcollection, qtokenId);
  const { options, onChange, selected } = useToggleTab(['Activity', 'Orders'], 'Activity');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showLowerPriceModal, setShowLowerPriceModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [buyPriceEth, setBuyPriceEth] = useState('');

  const listingOwner = token?.ordersSnippet?.listing?.orderItem?.makerAddress ?? '';
  const isListingOwner = user?.address === listingOwner;

  useEffect(() => {
    if (token?.ordersSnippet?.listing?.orderItem) {
      const obOrder: OBOrder = getOBOrderFromFirestoreOrderItem(token?.ordersSnippet?.listing?.orderItem);
      const price = getCurrentOBOrderPrice(obOrder);
      setBuyPriceEth(utils.formatEther(price));
    }
  }, [token]);

  // todo: hack to handle changed opensea image url
  if (token?.image) {
    console.log(token.image);
    token.image.url = token.image.url.replace('storage.opensea.io', 'openseauserdata.com');
  }

  // if cached url is null, try original url or the blank image
  if (token && !token?.image.url) {
    token.image.url = token.image.originalUrl ?? BLANK_IMAGE_URL;
  }

  if (isLoading) {
    return (
      <PageBox title="Loading..." showTitle={false}>
        <Spinner />
      </PageBox>
    );
  }

  if (error || !token || !collection) {
    console.error(error);
    return (
      <PageBox title="Asset - Error" className="w-full h-full grid place-items-center">
        <div className="flex flex-col max-w-screen-2xl mt-4">
          <main>
            <p>Unable to load data.</p>
          </main>
        </div>
      </PageBox>
    );
  }

  // TODO: Joe to update Erc721Metadata type
  const tokenMetadata = token.metadata as Erc721Metadata;

  const assetName =
    tokenMetadata.name && collection.metadata.name
      ? `${tokenMetadata.name} - ${collection.metadata.name}`
      : tokenMetadata.name || collection.metadata.name || 'brrrr';

  const onClickBuy = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowPlaceBidModal(true);
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

  const onClickTransfer = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowTransferModal(true);
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
          collection={collection}
          token={token}
        />
      )}
      {showLowerPriceModal && (
        <LowerPriceModal
          isOpen={showLowerPriceModal}
          onClose={() => setShowLowerPriceModal(false)}
          collection={collection}
          token={token}
          buyPriceEth={buyPriceEth}
        />
      )}
      {showTransferModal && (
        <TransferNFTModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          collection={collection}
          token={token}
        />
      )}

      {showMakeOfferModal && (
        <MakeOfferModal
          isOpen={showMakeOfferModal}
          onClose={() => setShowMakeOfferModal(false)}
          collection={collection}
          token={token}
        />
      )}
      {showPlaceBidModal && (
        <PlaceBidModal
          isOpen={showPlaceBidModal}
          onClose={() => setShowPlaceBidModal(false)}
          collection={collection}
          token={token}
        />
      )}
    </>
  );

  return (
    <PageBox title={assetName} showTitle={false} className="flex flex-col max-w-screen-2xl mt-4">
      <div className="sm:flex">
        <div className="min-h-12 w-80 mx-auto sm:w-96 md:w-96 lg:w-144 sm:mr-6 md:mr-8 lg:mr-12 mb-4">
          <img
            className="rounded-3xl w-80 mx-auto sm:w-96 md:w-96 lg:w-144"
            src={token.image.url || BLANK_IMAGE_URL}
            alt={assetName}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-black font-body text-2xl font-bold leading-normal tracking-wide pb-1">
            {tokenMetadata.name ? tokenMetadata.name : `${collection.metadata.name} #${token.tokenId}`}
          </h3>
          <div className="flex items-center sm:mb-6">
            <NextLink
              href={`/collection/${collection.slug}`}
              className="text-theme-light-800 font-heading tracking-tight mr-2"
            >
              {collection.metadata.name}
            </NextLink>
            {collection.hasBlueCheck && <SVG.blueCheck className="h-5 w-5" />}
          </div>
          <ShortAddress
            label="Contract address:"
            address={collection.address}
            href={`https://etherscan.io/address/${collection.address}`}
            tooltip={collection.address}
          />
          <span className="text-base flex items-center">
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
                        <EthPrice label={buyPriceEth} />
                      </span>
                    </div>
                  </Button>
                )}
                <Button variant="outline" size="large" onClick={onClickLowerPrice}>
                  Lower Price
                </Button>
                <Button variant="outline" size="large" onClick={onClickTransfer}>
                  Transfer
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
                        <EthPrice label={buyPriceEth} />
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

          <p className="font-body text-black mb-1 lg:mt-10">Description</p>
          <div>
            <ReadMoreText
              text={collection.metadata.description || tokenMetadata.description}
              min={100}
              ideal={120}
              max={200}
            />
          </div>
        </div>
      </div>

      <TraitList traits={tokenMetadata.attributes} collectionTraits={collection.attributes} />

      {/* <ActivityList chainId={collection.chainId} collectionAddress={collection.address} tokenId={token.tokenId} /> */}

      <div className="relative min-h-[1024px]">
        <ToggleTab
          className="flex space-x-2 items-center relative max-w-xl top-[65px] pb-4 lg:pb-0"
          tabWidth="150px"
          options={options}
          selected={selected}
          onChange={onChange}
        />

        {selected === 'Activity' && (
          <div className="mt-4">
            <h3 className="mt-8 mb-4 font-bold font-body">Activity</h3>
            <CollectionFeed collectionAddress={collection.address} tokenId={token.tokenId} forActivity={true} />
          </div>
        )}

        {selected === 'Orders' && (
          <div className="mt-4">
            <OrderbookContainer collectionId={token.collectionAddress} />
          </div>
        )}
      </div>

      {modals}
    </PageBox>
  );
};

export default AssetDetailPage;
