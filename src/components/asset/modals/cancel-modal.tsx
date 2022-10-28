import { useEffect, useState } from 'react';
import { SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { Checkbox, EthPrice, Modal, Spinner, toastError, toastInfo, toastSuccess } from 'src/components/common';
import { apiGet, ellipsisAddress, extractErrorMsg } from 'src/utils';
import { OrderbookItem } from 'src/components/orderbook/orderbook-list/orderbook-item';
import { cancelMultipleOrders } from 'src/utils/exchange/orders';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

interface Props {
  isOpen: boolean;
  collectionAddress: string;
  token: Token;
  onClose: () => void;
  onDone: () => void;
}

export const CancelModal = ({ isOpen, onClose, onDone, collectionAddress, token }: Props) => {
  const { getSigner, user, chainId, waitForTransaction } = useOnboardContext();

  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [listings, setListings] = useState<SignedOBOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchListings = async () => {
    setIsLoading(true);
    const { result, error } = await apiGet(`/userOrders/${user?.address}`, {
      query: {
        limit: 50,
        isSellOrder: true,
        collection: collectionAddress,
        tokenId: token.tokenId,
        makerAddress: user?.address
      },
      requiresAuth: true
    });
    setIsLoading(false);
    if (error) {
      setError(error?.message);
    } else {
      const orders: SignedOBOrder[] = result.data as SignedOBOrder[];
      // todo: this is needed until API supports filtering by both collectionId+tokenID:
      const ordersByTokenId = [];
      for (const order of orders) {
        const found = !!order.signedOrder.nfts.find((nft) => {
          const idx = nft.tokens.findIndex((tk) => tk.tokenId === token.tokenId);
          return idx >= 0;
        });
        if (found) {
          ordersByTokenId.push(order);
        }
      }
      // ordersByTokenId = uniqBy(ordersByTokenId, 'nonce'); // dedup orders with the same nonce (group of listed NFTs)
      setListings(ordersByTokenId);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const hasNoData = !error && !isLoading && listings && listings.length === 0;

  const onOKButton = async () => {
    try {
      const signer = getSigner();
      if (signer) {
        setIsSubmitting(true);
        const { hash } = await cancelMultipleOrders(signer, chainId, selectedListings);
        setIsSubmitting(false);
        toastSuccess('Sent txn to chain for execution');
        waitForTransaction(hash, () => {
          toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
          onDone();
        });
      } else {
        console.error('signer is null');
      }
    } catch (err) {
      toastError(extractErrorMsg(err));
    }
    onClose();
  };
  return (
    <Modal
      wide={true}
      isOpen={isOpen}
      onClose={onClose}
      okButton="Confirm"
      title="Select listings to cancel"
      disableOK={isSubmitting}
      onOKButton={onOKButton}
    >
      <ul className={`mt-4 p-2 flex flex-col w-full overflow-y-auto overflow-x-clip  min-h-[35vh]`}>
        {isLoading && <Spinner />}

        {!isLoading && error ? <div className="font-heading">{error}</div> : null}

        {hasNoData ? <div className="font-heading">No listings found.</div> : null}

        {listings.map((listing, idx) => {
          return (
            <Checkbox
              key={`${listing.id}_${idx}`}
              className="w-full mb-4"
              boxOnLeft={false}
              checked={selectedListings.includes(listing.nonce)}
              labelClassName="w-full"
              label={
                <div className="w-full flex items-center justify-between pr-4">
                  {/* <div className="w-2/3">Listing #{idx + 1}</div>
                  <div className="w-1/3">
                    {listing.nfts.length} NFT{listing.nfts.length > 1 ? 's' : ''}
                  </div>
                  <div className="w-1/3">{listing.startPriceEth} ETH</div> */}
                  <OrderbookItem nameItem={true} key={`${listing.id} ${listing.chainId}`} order={listing} />
                  <div className="w-1/6">
                    <EthPrice label={`${listing.startPriceEth}`} />
                  </div>
                </div>
              }
              onChange={(checked) => {
                if (checked) {
                  setSelectedListings([...selectedListings, listing.nonce]);
                } else {
                  const arr = selectedListings.filter((nonce) => nonce !== listing.nonce);
                  setSelectedListings(arr);
                }
              }}
            />
          );
        })}
      </ul>
    </Modal>
  );
};
