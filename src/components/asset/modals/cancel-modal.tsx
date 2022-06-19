import { useEffect, useState } from 'react';
import { Collection, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { Checkbox, EthPrice, Modal } from 'src/components/common';
import { apiGet } from 'src/utils';
import { uniqBy } from 'lodash';
import { OrderbookItem } from 'src/components/market/orderbook-list/orderbook-item';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const CancelModal = ({ isOpen, onClose, collection, token }: Props) => {
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [listings, setListings] = useState<SignedOBOrder[]>([]);

  const fetchListings = async () => {
    const { result, error } = await apiGet(`/orders/0x006fa88c8b4c9d60393498fd1b2acf6abe254d72`, {
      query: {
        limit: 50,
        isSellOrder: true,
        collection: token.collectionAddress
      },
      requiresAuth: true
    });
    if (!error) {
      const orders: SignedOBOrder[] = result.data as SignedOBOrder[];
      // todo: this is needed until API supports filtering by both collectionId+tokenID:
      let ordersByTokenId = [];
      for (const order of orders) {
        const found = !!order.signedOrder.nfts.find((nft) => {
          const idx = nft.tokens.findIndex((tk) => tk.tokenId === token.tokenId);
          return idx >= 0;
        });
        if (found) {
          ordersByTokenId.push(order);
        }
      }
      ordersByTokenId = uniqBy(ordersByTokenId, 'nonce'); // dedup orders with the same nonce (group of listed NFTs)
      setListings(ordersByTokenId);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <Modal
      wide={true}
      isOpen={isOpen}
      onClose={onClose}
      okButton="Confirm"
      title="Select listings to cancel"
      onOKButton={() => {
        console.log(collection);
        console.log(token);
        alert('todo: cancel selected listings');
        onClose();
      }}
    >
      <ul className="mt-4 p-2 flex flex-col w-full min-h-[50vh] max-h-[50vh] overflow-y-scroll">
        {listings.map((listing: SignedOBOrder, idx) => {
          return (
            <Checkbox
              key={`${listing.id}_${idx}`}
              className="w-full mb-4"
              boxOnLeft={false}
              checked={selectedListings.includes(listing.id)}
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
                  setSelectedListings([...selectedListings, listing.id]);
                } else {
                  const arr = selectedListings.filter((id) => id !== listing.id);
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
