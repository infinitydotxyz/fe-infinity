import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Button, PageBox, ShortAddress, ReadMoreText } from 'src/components/common';
import { apiGet } from 'src/utils';
import { Token, Collection } from '@infinityxyz/lib/types/core';
import {
  TraitList,
  ActivityList,
  ToggleSwitchButton,
  ListModal,
  CancelModal,
  TransferNFTModal,
  PlaceBidModal,
  MakeOfferModal
} from 'src/components/asset';

import BlueCheckSvg from 'src/images/blue-check.svg';
// import TransferSvg from 'src/images/transfer.svg';

import { NextPageContext } from 'next';

interface AssetDetailProps {
  token: Token;
  collection: Collection;
}

const AssetDetail: FunctionComponent<AssetDetailProps> = ({ token, collection }) => {
  if (!token) {
    return (
      <PageBox title={'Asset Detail - Error'} hideTitle>
        <h1>Sorry! Failed to fetch the nft info</h1>
      </PageBox>
    );
  }

  console.log({ token, collection });
  return (
    <PageBox title={`${token?.metadata?.name} - ${collection?.metadata?.name}`} hideTitle>
      <div className="pb-4 sm:flex">
        <div className="min-h-12 w-80 mx-auto sm:w-96 md:w-96 lg:w-144 sm:mr-6 md:mr-8 lg:mr-12 mb-4">
          <img
            className="rounded-3xl w-full"
            src={token.image.url || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
            alt={`${token.metadata.name} - ${collection.metadata.name}`}
          />
        </div>
        <div className="flex-1">
          <div className="mb-2 md:pb-4 lg:pb-16 text-center sm:text-left">
            <ToggleSwitchButton />
          </div>
          <h3 className="text-black font-body text-2xl font-bold leading-9 tracking-wide pb-1">
            {token.metadata.name}
          </h3>
          <div className="flex items-center sm:mb-6">
            <Link href={`${window.origin}/collection/${collection?.address}`}>
              <a
                href={`${window.origin}/collection/${collection?.address}`}
                className="text-theme-light-800 font-heading tracking-tight mr-2"
              >
                {collection.metadata.name}
              </a>
            </Link>
            <img className="w-4 h-4 -mt-0.5" src={BlueCheckSvg.src} alt={'Verified'} />
          </div>
          <ShortAddress
            label="Contact address:"
            address={collection.address}
            href={`${window.origin}/collection/${collection.address}`}
            tooltip={collection.address}
          />
          <ShortAddress
            label="Token ID:"
            address={token.tokenId}
            href={`${window.origin}/asset/${token.chainId}/${collection.address}/${token.tokenId}`}
            tooltip="#3460"
          />
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
              readMoreText="Read more"
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
    </PageBox>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const NFT_API_ENDPOINT = `/collections/${query.chainId}:${query.collection}/nfts/${query.tokenId}`;
  const COL_API_ENDPOINT = `/collections/${query.chainId}:${query.collection}`;

  const response = await Promise.all([apiGet(NFT_API_ENDPOINT), apiGet(COL_API_ENDPOINT)]);

  if (response[0].error || response[0].error) {
    return {
      props: {
        token: null,
        collection: null
      }
    };
  }
  return {
    props: {
      token: response[0].result as Token,
      collection: response[1].result as Collection
    }
  };
}

export default AssetDetail;
