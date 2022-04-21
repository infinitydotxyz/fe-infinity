import { FunctionComponent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, ShortAddress, ReadMoreText } from 'src/components/common';
import { BLANK_IMAGE_URL, useFetch } from 'src/utils';
import { Token, Collection } from '@infinityxyz/lib/types/core';
import { Layout } from 'src/components/common/layout';
import {
  TraitList,
  ActivityList,
  ListModal,
  CancelModal,
  TransferNFTModal,
  PlaceBidModal,
  MakeOfferModal
} from 'src/components/asset';

import BlueCheckSvg from 'src/images/blue-check.svg';
// import {HiOutlineSwitchHorizontal} from 'react-icons';

const useFetchAssertInfo = (chainId: string, collection: string, tokenId: string) => {
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

const AssetDetail: FunctionComponent = () => {
  const { query } = useRouter();

  if (typeof query.chainId !== 'string' || typeof query.collection !== 'string' || typeof query.tokenId !== 'string') {
    return (
      <Layout title="Asset Detail - Error" padded>
        <div className="flex flex-col max-w-screen-2xl mt-4">
          <main>
            <p>Error: Invalid page parameters.</p>
          </main>
        </div>
      </Layout>
    );
  }

  const { isLoading, error, token, collection } = useFetchAssertInfo(query.chainId, query.collection, query.tokenId);

  if (isLoading) {
    return <Layout title="Loading..."></Layout>;
  }

  if (error || !token || !collection) {
    console.error(error);
    return (
      <Layout title="Asset Detail - Error" className="w-full h-full grid place-items-center">
        <div className="flex flex-col max-w-screen-2xl mt-4">
          <main>
            <p>Error: Fetching Data Failed.</p>
          </main>
        </div>
      </Layout>
    );
  }

  const assetName =
    token.metadata.name && collection.metadata.name
      ? `${token.metadata.name} - ${collection.metadata.name}`
      : token.metadata.name || collection.metadata.name || 'No Name';
  return (
    <Layout title={assetName} padded>
      <div className="flex flex-col max-w-screen-2xl mt-4">
        <main>
          <div className="sm:flex">
            <div className="min-h-12 w-80 mx-auto sm:w-96 md:w-96 lg:w-144 sm:mr-6 md:mr-8 lg:mr-12 mb-4">
              <img
                className="rounded-3xl w-80 mx-auto sm:w-96 md:w-96 lg:w-144"
                src={token.image.url || BLANK_IMAGE_URL}
                alt={assetName}
              />
            </div>
            <div className="flex-1">
              {/* <div className="mb-2 md:pb-4 lg:pb-16 text-center sm:text-left">
            <ToggleTab />
          </div> */}
              <h3 className="text-black font-body text-2xl font-bold leading-normal tracking-wide pb-1">
                {token.metadata.name ? token.metadata.name : `${collection.metadata.name} #${token.tokenId}`}
              </h3>
              <div className="flex items-center sm:mb-6">
                <Link href={`/collection/${collection.metadata.name || collection.address}`}>
                  <a
                    href={`/collection/${collection.metadata.name || collection.address}`}
                    className="text-theme-light-800 font-heading tracking-tight mr-2"
                  >
                    {collection.metadata.name}
                  </a>
                </Link>
                {collection.hasBlueCheck && (
                  <div className="mt-1">
                    <Image width={18} height={18} src={BlueCheckSvg.src} alt={'Verified'} />
                  </div>
                )}
              </div>
              <ShortAddress
                label="Contact address:"
                address={collection.address}
                href={`https://etherscan.io/address/${collection.address}`}
                tooltip={collection.address}
              />
              <span className="text-body text-base">
                Token ID:<span className="ml-4">{token.tokenId}</span>
              </span>
              {/* <ShortAddress
                label="Token ID:"
                address={token.tokenId}
                href={`https://etherscan.io/token/${collection.address}?a=${token.tokenId}`}
                tooltip={token.tokenId}
              /> */}
              <div className="md:-ml-1.5">
                <div className="flex flex-col md:flex-row gap-2 my-4 md:my-6 lg:my-10 lg:mb-16">
                  <Button variant="primary" size="large" className="p-4 rounded-full">
                    Buy&nbsp;3.30 ETH
                  </Button>
                  <Button variant="outline" size="large" className="p-4 rounded-full">
                    Make offer
                  </Button>
                  {/* <div className="border w-12 h-12 flex justify-center items-center rounded-full">
                    <img src={TransferSvg.src} alt="Transfer" />
                </div>*/}
                </div>
              </div>
              <p className="font-body text-black mb-1">Description</p>
              <div>
                <ReadMoreText
                  text={collection.metadata.description || token.metadata.description}
                  min={100}
                  ideal={120}
                  max={200}
                />
              </div>
            </div>
          </div>

          <TraitList traits={token.metadata.attributes} collectionTraits={collection.attributes} />
          <ActivityList chainId={collection.chainId} collectionAddress={collection.address} tokenId={token.tokenId} />

          <CancelModal />
          <TransferNFTModal />
          <ListModal />
          <CancelModal />
          <TransferNFTModal />
          <MakeOfferModal />
          <PlaceBidModal />
        </main>
      </div>
    </Layout>
  );
};

export default AssetDetail;
