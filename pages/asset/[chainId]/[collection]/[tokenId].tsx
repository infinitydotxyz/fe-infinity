import { useRouter } from 'next/router';
import {
  Button,
  ShortAddress,
  PageBox,
  ReadMoreText,
  SVG,
  NextLink,
  ClipboardButton,
  Spinner
} from 'src/components/common';
import { BLANK_IMAGE_URL, useFetch } from 'src/utils';
import { Token, Collection, Erc721Metadata } from '@infinityxyz/lib/types/core';
import {
  TraitList,
  ActivityList,
  ListNFTModal,
  CancelModal,
  TransferNFTModal,
  PlaceBidModal,
  MakeOfferModal
} from 'src/components/asset';
import { useState } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';

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
      <PageBox title="Asset - Error">
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
  const { checkSignedIn } = useAppContext();
  const { isLoading, error, token, collection } = useFetchAssetInfo(qchainId, qcollection, qtokenId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showListNFTModal, setShowListNFTModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);

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

  // const debugLog = (obj: object) => {
  //   console.log('############################################');
  //   console.log(JSON.stringify(obj, null, '  '));
  // };

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const cpy: any = Object.assign({}, collection);
  // cpy['attributes'] = 'fuck that';

  // debugLog(cpy);
  // debugLog(token);

  // TODO: Joe to update Erc721Metadata type
  const tokenMetadata = token.metadata as Erc721Metadata;

  const assetName =
    tokenMetadata.name && collection.metadata.name
      ? `${tokenMetadata.name} - ${collection.metadata.name}`
      : tokenMetadata.name || collection.metadata.name || 'No Name';

  const onClickButton1 = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowPlaceBidModal(true);
  };

  const onClickButton2 = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowMakeOfferModal(true);
  };

  const modals = (
    <>
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        collection={collection}
        token={token}
      />
      <ListNFTModal
        isOpen={showListNFTModal}
        onClose={() => setShowListNFTModal(false)}
        collection={collection}
        token={token}
      />
      <TransferNFTModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        collection={collection}
        token={token}
      />
      <MakeOfferModal
        isOpen={showMakeOfferModal}
        onClose={() => setShowMakeOfferModal(false)}
        collection={collection}
        token={token}
      />
      <PlaceBidModal
        isOpen={showPlaceBidModal}
        onClose={() => setShowPlaceBidModal(false)}
        collection={collection}
        token={token}
      />
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
            Token ID: <span className="ml-4 font-heading underline">#{token.tokenId}</span>
            <ClipboardButton textToCopy={token.tokenId} />
          </span>

          <div className="md:-ml-1.5">
            <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:my-10 lg:mb-16">
              <Button variant="primary" size="large" onClick={onClickButton1}>
                <span className="mr-4">Buy</span>
                <span className="font-heading">3.30 ETH</span>
              </Button>
              <Button variant="outline" size="large" onClick={onClickButton2}>
                Make offer
              </Button>
            </div>
          </div>
          <p className="font-body text-black mb-1">Description</p>
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
      <ActivityList chainId={collection.chainId} collectionAddress={collection.address} tokenId={token.tokenId} />

      {modals}
    </PageBox>
  );
};

export default AssetDetailPage;
