import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import React from 'react';
import { Button, EZImage, Modal, SimpleTable, SimpleTableItem } from 'src/components/common';

interface Props {
  order: SignedOBOrder;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal = ({ order, isOpen, onClose }: Props) => {
  const tableItems: SimpleTableItem[] = [
    {
      title: <div className="">Type</div>,
      value: <div className="text-black font-heading">{order.isSellOrder ? 'Listing' : 'Order'}</div>
    },
    {
      title: <div className="">Price</div>,
      value: <div className="text-black font-heading">{order.startPriceEth}</div>
    },
    {
      title: <div className=""># NFTs</div>,
      value: <div className="text-black font-heading">{order.numItems}</div>
    },
    {
      title: <div className="">Expiry date</div>,
      value: <div className="text-black font-heading">{new Date(order.endTimeMs).toLocaleString()}</div>
    }
  ];

  return (
    <Modal wide={false} isOpen={isOpen} onClose={onClose} title="Order details" showActionButtons={false}>
      <div className="text-gray-500">You can purchase any one of these NFTs for the min sale price</div>

      <div className="my-8">
        {(order?.nfts || []).map((nft, idx) => {
          return (
            <div key={`${nft.collectionAddress}_${idx}`} className=" space-y-4">
              {nft.tokens.map((token) => {
                return (
                  <div key={nft.collectionAddress + '_' + token.tokenId} className="flex items-center">
                    <EZImage src={nft.collectionImage} className="w-16 h-16 overflow-clip rounded-3xl" />
                    <div className="ml-4">
                      <div>Collection: {nft.collectionName}</div>
                      <div className="flex text-gray-500">{token.tokenName}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <SimpleTable className="text-gray-500" items={tableItems} />

      <div className="mt-10">
        <Button variant="primary" className="w-full font-heading" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};
