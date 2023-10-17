import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { ellipsisString } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { BasicTokenInfo } from 'src/utils/types';
import { borderColor, secondaryBgColorDarker, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useNetwork } from 'wagmi';
import { Button, EthSymbol, EZImage } from '../common';
import { ChartBox } from './chart-box';
import { OrderbookRowButton } from './chart-detail-button';
import { clamp } from './chart-utils';
import { NextPrevArrows } from './next-prev-arrows';
import { SalesChartData } from './sales-chart';
import { ArrowSmallIcon } from 'src/icons';

interface Props {
  orders: CollectionOrder[];
  index: number;
  setIndex: (index: number) => void;
  valueClassName?: string;
  collectionAddress: string;
  collectionSlug: string;
  collectionImage: string;
  collectionName?: string;
}

export const OrdersChartDetails = ({
  orders,
  index,
  setIndex,
  collectionAddress,
  collectionSlug,
  collectionImage,
  collectionName
}: Props) => {
  if (orders.length > 0) {
    const order = orders[clamp(index, 0, orders.length - 1)];

    return (
      <div
        className={twMerge(
          borderColor,
          'border-[1px] rounded-lg pb-2.5 flex-1 h-full flex flex-col justify-between items-center'
        )}
      >
        <div className="w-full" />
        <div className="flex justify-between items-center">
          <Button
            disabled={orders.length < 2}
            variant="round"
            className=""
            onClick={() => {
              let x = index - 1;

              if (x < 0) {
                x = orders.length - 1;
              }

              setIndex(x);
            }}
          >
            <ArrowSmallIcon className="h-5 w-5.5" />
          </Button>
          <OrderDetailViewer
            order={order}
            scroll={true}
            collectionAddress={collectionAddress}
            collectionSlug={collectionSlug}
            collectionImage={collectionImage}
            collectionName={collectionName}
          />
          <Button
            disabled={orders.length < 2}
            variant="round"
            className="transform rotate-180"
            onClick={() => {
              let x = index + 1;

              if (x >= orders.length) {
                x = 0;
              }

              setIndex(x);
            }}
          >
            <ArrowSmallIcon className="h-5 w-5.5" />
          </Button>
        </div>

        <div className={twMerge('flex items-center justify-center my-4')}>
          <NextPrevArrows
            orders={orders}
            index={index}
            className="flex pointer-events-auto text-sm font-heading font-bold z-50"
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
  collectionSlug: string;
  collectionName?: string;
}

const OrderDetailViewer = ({ order, collectionAddress, collectionName, collectionSlug }: Props2) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: order?.tokenId ?? '',
    collectionAddress: collectionAddress ?? '',
    collectionSlug: collectionSlug ?? '',
    chainId
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
          <OrderbookRowButton
            order={order}
            outlineButtons={false}
            collectionName={collectionName}
            collectionAddress={collectionAddress}
          />
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
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.collectionAddress ?? '',
    collectionSlug: data?.collectionSlug ?? '',
    chainId
  };

  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="h-18 text-22 font-bold font-body flex items-center justify-center text-white">
        Most Recent Sale
      </div>
      <div
        className={twMerge(
          borderColor,
          'border-[1px] rounded-lg pb-[30px] flex-1 h-full justify-center items-center flex'
        )}
      >
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
    </div>
  );
};
