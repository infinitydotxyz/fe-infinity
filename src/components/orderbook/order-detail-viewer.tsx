import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { EthSymbol, EZImage } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

export const orderDetailKey = (collectionAddress: string, tokenId: string): string => {
  return `${collectionAddress}:${tokenId}`;
};

interface Props2 {
  order: CollectionOrder;
  scroll?: boolean;
  collectionImage: string;
  collectionAddress: string;
}

export const OrderDetailViewer = ({ order, scroll = false, collectionAddress, collectionImage }: Props2) => {
  const router = useRouter();

  const contents = () => {
    // just show collection if no tokens for coll offers
    if (!order.tokenId) {
      return (
        <div className="items-center">
          <EZImage src={collectionImage} className="w-60 h-60 shrink-0 overflow-clip rounded-lg" />
          <div className="select-none">Collection</div>
        </div>
      );
    } else {
      return (
        <div
          className="cursor-pointer flex flex-col space-y-2 items-center"
          onClick={() => {
            const { pathname, query } = router;
            query['tokenId'] = order.tokenId;
            query['collectionAddress'] = collectionAddress;
            router.replace({ pathname, query }, undefined, { shallow: true });
          }}
        >
          <EZImage src={order.tokenImage} className="w-60 h-60 shrink-0 overflow-clip rounded-lg" />

          <div className="select-none flex truncate">{order.tokenId}</div>

          <div>
            {order.priceEth} {EthSymbol}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={twMerge('flex flex-col text-sm')}>
      <div className={twMerge('mt-4 space-y-3 flex-1', scroll ? 'overflow-y-auto overflow-x-clip' : '')}>
        {contents()}
      </div>
    </div>
  );
};
