import { useEffect, useState } from 'react';
import { Collection, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { Checkbox, Modal } from 'src/components/common';
import { apiGet } from 'src/utils';

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
      setListings(result.data);
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
      <ul className="mt-4 p-2 flex flex-col w-full justify-between min-h-[50vh] max-h-[50vh] overflow-y-scroll">
        {listings.map((listing: SignedOBOrder, idx) => {
          return (
            <Checkbox
              className="w-full mb-4"
              boxOnLeft={false}
              checked={selectedListings.includes(listing.id)}
              labelClassName="w-full"
              label={
                <div className="w-full flex justify-between pr-4">
                  <div className="w-2/3">Listing #{idx + 1}</div>
                  <div className="w-1/3">
                    {listing.nfts.length} NFT{listing.nfts.length > 1 ? 's' : ''}
                  </div>
                  <div className="w-1/3">{listing.startPriceEth} ETH</div>
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
