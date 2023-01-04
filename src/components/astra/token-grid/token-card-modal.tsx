import { CollectionAttributes, ERC721CardData, Token } from '@infinityxyz/lib-frontend/types/core';
import { ActivityList } from 'src/components/asset';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { ellipsisAddress, useFetch } from 'src/utils';
import { useSWRConfig } from 'swr';
import {
  BlueCheck,
  ErrorOrLoading,
  EZImage,
  Modal,
  NextLink,
  ReadMoreText,
  ShortAddress,
  Spinner,
  ToggleTab,
  useToggleTab
} from '../../common';
import { ATraitList } from '../astra-trait-list';

interface Props {
  data: Required<ERC721CardData>;
  modalOpen: boolean;
  setModalOpen: (set: boolean) => void;
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

export const TokenCardModal = ({ data, modalOpen, setModalOpen }: Props): JSX.Element => {
  const { options, onChange, selected } = useToggleTab(['Activity', 'Orders'], 'Activity');
  const { isLoading, token, error, collectionAttributes } = useFetchAssetInfo(data.chainId, data.address, data.tokenId);

  if (isLoading) {
    return <Spinner />;
  }

  if (!token || error) {
    console.error(error);
    return <ErrorOrLoading fixed error={!!error} noData message="Something went wrong." />;
  }

  return (
    <Modal isOpen={modalOpen} showActionButtons={false} onClose={() => setModalOpen(false)} panelClassName="max-w-6xl">
      <div className="flex justify-between">
        <div className="flex">
          <div className="flex flex-col gap-10 mr-auto md:flex-row md:items-start">
            <div className="md:flex-1 ">
              <div className="flex items-center mb-2">
                <NextLink
                  href={`/collection/${data.collectionSlug || `${data.chainId}:${data.address}`}`}
                  className="font-heading tracking-tight mr-2"
                >
                  <div>{data.collectionName || ellipsisAddress(data.address) || 'Collection'}</div>
                </NextLink>
                {data.hasBlueCheck && <BlueCheck />}
              </div>
              <h3 className="font-body text-2xl font-bold mb-2">{data.tokenId}</h3>
              <ShortAddress
                label="Collection address:"
                address={data.address ?? ''}
                href={`https://etherscan.io/address/${data.address}`}
                tooltip={data.address ?? ''}
              />
              <ShortAddress
                className="mt-2"
                label="Owned by:"
                address={token?.owner?.toString() || ''}
                href={`https://infinity.xyz/profile/${token?.owner?.toString() || ''}`}
                tooltip={data.owner || ''}
              />

              {data.description && (
                <>
                  <p className="font-body mb-1 mt-4">Description</p>
                  <div>
                    <ReadMoreText text={data.description ?? ''} min={100} ideal={150} max={300} />
                  </div>
                </>
              )}

              <div className="min-h-[50vh] mt-10">
                <ToggleTab
                  className="flex space-x-2 items-center relative max-w-xl font-heading"
                  options={options}
                  selected={selected}
                  onChange={onChange}
                />

                {selected === 'Activity' && (
                  <ActivityList
                    chainId={token?.chainId ?? '1'} // default
                    collectionAddress={token?.collectionAddress ?? ''}
                    token={token}
                  />
                )}

                {selected === 'Orders' && (
                  <div className="">
                    <OrderbookContainer collectionId={token?.collectionAddress} tokenId={token?.tokenId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <EZImage src={data?.image} className="h-80 w-80" />
          <ATraitList traits={data.attributes ?? []} collectionTraits={collectionAttributes ?? {}} />
        </div>
      </div>
    </Modal>
  );
};
