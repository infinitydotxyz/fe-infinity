import {
  BlueCheck,
  ErrorOrLoading,
  EZImage,
  Modal,
  NextLink,
  ReadMoreText,
  ShortAddress,
  Spinner,
  toastError,
  toastSuccess,
  ToggleTab,
  useToggleTab
} from '../../common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { apiGet, ellipsisAddress } from 'src/utils';
import { ActivityList } from 'src/components/asset';
import { useFetchAssetInfo } from 'pages/v3/asset/[chainId]/[collection]/[tokenId]';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { ATraitList } from '../astra-trait-list';
import { AButton } from '../astra-button';

interface Props {
  data: Required<ERC721CardData>;
  modalOpen: boolean;
  setModalOpen: (set: boolean) => void;
}

export const TokenCardModal = ({ data, modalOpen, setModalOpen }: Props): JSX.Element => {
  const { options, onChange, selected } = useToggleTab(['Activity', 'Orders'], 'Activity');
  const { isLoading, token, error, collectionAttributes, refreshAssetInfo } = useFetchAssetInfo(
    data.chainId,
    data.address,
    data.tokenId
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (!token || error) {
    console.error(error);
    return <ErrorOrLoading fixed error={!!error} noData message="Something went wrong." />;
  }

  return (
    <Modal isOpen={modalOpen} showActionButtons={false} onClose={() => setModalOpen(false)} panelClassName="max-w-5xl">
      <div className="flex justify-between">
        <div className="flex">
          <div className="flex flex-col gap-10 mr-auto md:flex-row md:items-start">
            <div className="md:flex-1 ">
              <h3 className="font-body text-2xl font-bold leading-normal tracking-wide pb-1">
                {data.name ? data.name : `${data.collectionName} #${data.tokenId}`}
              </h3>
              <div className="flex items-center mb-6">
                <NextLink
                  href={`/collection/${data.collectionSlug || `${data.chainId}:${data.address}`}`}
                  className="font-heading tracking-tight mr-2"
                >
                  <div>{data.collectionName || ellipsisAddress(data.address) || 'Collection'}</div>
                </NextLink>
                {data.hasBlueCheck && <BlueCheck />}
              </div>
              <ShortAddress
                label="Collection address:"
                address={data.address ?? ''}
                href={`https://etherscan.io/address/${data.address}`}
                tooltip={data.address ?? ''}
              />
              <span className="text-base flex items-center mt-2">
                Token ID: <span className="ml-4 font-heading">#{data.tokenId}</span>
              </span>
              <ShortAddress
                className="mt-2"
                label="Owned by:"
                address={token?.owner?.toString() || ''}
                href={`https://infinity.xyz/profile/${token?.owner?.toString() || ''}`}
                tooltip={data.owner || ''}
              />

              {/* {isListingOwner && (
                // Listing owner's action buttons
                <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                  {buyPriceEth && (
                    <>
                      <Button variant="outline" onClick={onClickCancel}>
                        <div className="flex">
                          <span className="mr-4">Cancel</span>
                          <span>
                            <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                          </span>
                        </div>
                      </Button>
                      <Button variant="outline" onClick={onClickLowerPrice}>
                        Lower Price
                      </Button>
                    </>
                  )}
                </div>
              )} */}

              {/* {isNftOwner ? (
                <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                  <Button variant="outline" onClick={onClickSend}>
                    Send
                  </Button>
                  {!isListingOwner && (
                    <Button variant="outline" onClick={onClickList}>
                      List
                    </Button>
                  )}
                  {sellPriceEth && (
                    <Button variant="outline" className="" onClick={onClickAcceptOffer}>
                      <div className="flex">
                        Accept Offer <EthPrice label={`${sellPriceEth}`} className="ml-2" />
                      </div>
                    </Button>
                  )}
                </div>
              ) : (
                // Other users' action buttons
                <div className="flex flex-col md:flex-row gap-4 my-4 md:my-6 lg:mt-10">
                  {buyPriceEth && (
                    <Button variant="primary" onClick={onClickBuy}>
                      <div className="flex">
                        <span className="mr-4">Buy</span>
                        <span>
                          <EthPrice label={buyPriceEth} rowClassName="pt-[1px]" />
                        </span>
                      </div>
                    </Button>
                  )}
                  <Button variant="outline" onClick={onClickMakeOffer}>
                    Make offer
                  </Button>
                </div>
              )} */}

              {data.description && (
                <>
                  <p className="font-body text-black mb-1 mt-6">Description</p>
                  <div>
                    <ReadMoreText text={data.description ?? ''} min={100} ideal={150} max={300} />
                  </div>
                </>
              )}

              {/* TODO: add new activity list here */}
              <div className="min-h-[50vh]">
                <ToggleTab
                  className="flex space-x-2 items-center relative max-w-xl top-[65px] pb-4 lg:pb-0 font-heading"
                  options={options}
                  selected={selected}
                  onChange={onChange}
                />

                {selected === 'Activity' && (
                  <div className="mt-[-22px]">
                    <ActivityList
                      chainId={token?.chainId ?? '1'} // default
                      collectionAddress={token?.collectionAddress ?? ''}
                      token={token}
                    />
                  </div>
                )}

                {selected === 'Orders' && (
                  <div className="mt-4">
                    <OrderbookContainer collectionId={token?.collectionAddress} tokenId={token?.tokenId} />
                  </div>
                )}
              </div>
              {/* -- */}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <EZImage src={data?.image} className="h-60 w-60" />
          <AButton
            primary
            onClick={async () => {
              const { error } = await apiGet(
                `/collections/${data.chainId}:${data.address}/nfts/${data.tokenId}/refresh-metadata`
              );

              if (!error) {
                toastSuccess('Refresh metadata successful');
                refreshAssetInfo();
              } else {
                toastError('Refresh metadata failed');
              }
            }}
            className="mt-2"
          >
            Refresh metadata
          </AButton>
          <ATraitList traits={data.attributes ?? []} collectionTraits={collectionAttributes ?? {}} />
        </div>
      </div>
    </Modal>
  );
};
