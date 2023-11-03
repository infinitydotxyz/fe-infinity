import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { useAppContext } from 'src/utils/context/AppContext';
import { BasicTokenInfo, ERC721TokenCartItem } from 'src/utils/types';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { Button } from '../common';
import { ChartBox } from './chart-box';
import { clamp } from './chart-utils';
import { NextPrevArrows } from './next-prev-arrows';
import { SalesChartData } from './sales-chart';
import { ArrowSmallIcon } from 'src/icons';
import { GridCard } from '../common/card';
import { CartType } from 'src/utils/context/CartContext';

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
          'border border-gray-300 dark:border-neutral-200 rounded-lg pb-2.5 flex-1 h-full flex flex-col justify-between items-center'
        )}
      >
        <div className="w-full" />
        <div className="flex w-full justify-between items-center">
          <Button
            disabled={orders.length < 2}
            variant="round"
            className="pl-7.5"
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
            className="transform rotate-180 pr-7.5"
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
      <div className="w-56.25">
        <GridCard
          data={{
            ...order,
            image: order.tokenImage,
            price: order.priceEth,
            cartType: CartType.TokenList,
            title: collectionName ?? order.maker
          }}
          selected={false}
          collectionFloorPrice={order.priceEth}
          collectionCreator={collectionName}
          isSelectable={(data: ERC721TokenCartItem) => !!data}
          onClick={() => {
            const { pathname, query } = router;
            query['tokenId'] = order.tokenId;
            query['collectionAddress'] = collectionAddress;
            router.replace({ pathname, query }, undefined, { shallow: true });
          }}
        />
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
      <div className="h-18 text-22 font-bold font-body flex items-center justify-center text-neutral-700 dark:text-white">
        Most Recent Sale
      </div>
      <div
        className={twMerge(
          'border border-gray-300 dark:border-neutral-200 rounded-lg pb-7.5 flex-1 h-full justify-center items-center flex'
        )}
      >
        <div className="w-56.25">
          <GridCard
            data={{
              ...data,
              image: data.tokenImage,
              price: data.salePrice,
              cartType: CartType.TokenList,
              title: data.collectionSlug
            }}
            selected={false}
            collectionFloorPrice={data.salePrice}
            collectionCreator={data.collectionName}
            isSelectable={(data: ERC721TokenCartItem) => !!data}
            onClick={() => {
              const { pathname, query } = router;
              query['tokenId'] = data.tokenId;
              query['collectionAddress'] = data.collectionAddress;
              router.replace({ pathname, query }, undefined, { shallow: true });
            }}
          />
        </div>
        {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
      </div>
    </div>
  );
};
