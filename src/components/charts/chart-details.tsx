import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { ellipsisString } from 'src/utils';
import { BasicTokenInfo } from 'src/utils/types';
import { borderColor, secondaryBgColorDarker, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { EthSymbol, EZImage } from '../common';
import { ChartBox } from './chart-box';
import { OrderbookRowButton } from './chart-detail-button';
import { clamp } from './chart-utils';
import { NextPrevArrows } from './next-prev-arrows';
import { SalesChartData } from './sales-chart';

interface Props {
  orders: CollectionOrder[];
  index: number;
  setIndex: (index: number) => void;
  valueClassName?: string;
  collectionAddress: string;
  collectionImage: string;
}

export const OrdersChartDetails = ({ orders, index, setIndex, collectionAddress, collectionImage }: Props) => {
  if (orders.length > 0) {
    const order = orders[clamp(index, 0, orders.length - 1)];

    return (
      <div className={twMerge(borderColor, 'border-[1px] rounded-lg pb-2.5')}>
        <OrderDetailViewer
          order={order}
          scroll={true}
          collectionAddress={collectionAddress}
          collectionImage={collectionImage}
        />

        <div className={twMerge('flex items-center justify-center my-4')}>
          <NextPrevArrows
            orders={orders}
            index={index}
            setIndex={setIndex}
            className="flex pointer-events-auto text-sm font-heading font-bold"
          />
        </div>
      </div>
    );
  }

  return (
    <ChartBox className={twMerge('flex items-center justify-center')}>
      <div className="text-center">Click on a bar!</div>
    </ChartBox>
  );
};

interface Props2 {
  order: CollectionOrder;
  scroll?: boolean;
  collectionImage?: string;
  collectionAddress: string;
}

const OrderDetailViewer = ({ order, collectionAddress }: Props2) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: order?.tokenId ?? '',
    collectionAddress: collectionAddress ?? '',
    chainId: '1' // future-todo dont hardcode
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
        className={twMerge(
          'cursor-pointer flex flex-col space-y-4 items-center w-62 p-2 rounded-lg',
          secondaryBgColorDarker
        )}
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
            <div className="flex truncate font-bold">{ellipsisString(order.tokenId)}</div>
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

interface Props3 {
  data: SalesChartData;
}

export const SalesChartDetails = ({ data }: Props3) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.collectionAddress ?? '',
    chainId: '1' // future-todo dont hardcode
  };

  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

  return (
    <div className={twMerge(borderColor, 'border-[1px] rounded-lg pb-[30px]')}>
      <div className={twMerge('flex justify-center pt-4 font-heading font-bold')}>Most recent sale</div>
      <div className={twMerge('flex flex-col text-sm mt-4 items-center')}>
        <div
          className={twMerge(
            'cursor-pointer flex flex-col space-y-4 items-center w-62 p-2 rounded-lg',
            secondaryBgColorDarker
          )}
          onClick={() => {
            const { pathname, query } = router;
            query['tokenId'] = data.tokenId;
            query['collectionAddress'] = data.collectionAddress;
            router.replace({ pathname, query }, undefined, { shallow: true });
          }}
        >
          <EZImage src={data.tokenImage} className="w-60 h-60 shrink-0 overflow-clip rounded-lg" />

          <div className={twMerge('flex justify-between border-[0px] rounded-lg w-60', borderColor)}>
            <div className="flex flex-col">
              <div className="flex truncate font-bold">{ellipsisString(data.tokenId)}</div>
              <div>
                {data.salePrice} {EthSymbol}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Date</div>
              <div className="truncate">{format(data?.timestamp ?? 0)}</div>
            </div>
          </div>
        </div>
        {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
      </div>
    </div>
  );
};
