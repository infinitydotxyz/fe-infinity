import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EthSymbol, EZImage } from 'src/components/common';
import { BasicTokenInfo } from 'src/utils/types';
import { borderColor, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { OrderbookRowButton } from './list/orderbook-row-button';

export const orderDetailKey = (collectionAddress: string, tokenId: string): string => {
  return `${collectionAddress}:${tokenId}`;
};

interface Props2 {
  order: CollectionOrder;
  scroll?: boolean;
  collectionImage?: string;
  collectionAddress: string;
}

export const OrderDetailViewer = ({ order, collectionAddress }: Props2) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: order?.tokenId ?? '',
    collectionAddress: collectionAddress ?? '',
    chainId: '1' // todo dont hardcode
  };

  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

  return (
    <div className={twMerge('flex flex-col text-sm mt-4 items-center')}>
      <div
        className={twMerge('cursor-pointer flex flex-col space-y-4 items-center w-62 p-2 rounded-lg', secondaryBgColor)}
        onClick={() => {
          const { pathname, query } = router;
          query['tokenId'] = order.tokenId;
          query['collectionAddress'] = collectionAddress;
          router.replace({ pathname, query }, undefined, { shallow: true });
        }}
      >
        <EZImage src={order.tokenImage} className="w-60 h-60 shrink-0 overflow-clip rounded-lg" />

        <div className={twMerge('flex justify-between border-[0px] rounded-lg w-60', borderColor)}>
          <div className="flex flex-col">
            <div className="flex truncate font-bold">{order.tokenId}</div>
            <div>
              {order.priceEth} {EthSymbol}
            </div>
          </div>
          <OrderbookRowButton order={order} outlineButtons={false} />
        </div>
      </div>
      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
    </div>
  );
};
