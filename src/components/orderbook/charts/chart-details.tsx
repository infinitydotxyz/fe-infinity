import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { EZImage } from '../../common';
import { OrderbookRowButton } from '../list/orderbook-row-button';
import { OrderDetailViewer } from '../order-detail-viewer';
import { ChartBox } from './chart-box';
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
      <ChartBox noCSSStyles>
        <div className={twMerge('flex items-center justify-center')}>
          <NextPrevArrows
            orders={orders}
            index={index}
            setIndex={setIndex}
            className="flex pointer-events-auto text-sm"
          />
        </div>

        <OrderDetailViewer
          order={order}
          scroll={true}
          collectionAddress={collectionAddress}
          collectionImage={collectionImage}
        />

        <div className="mt-2 flex justify-center">
          <OrderbookRowButton order={order} outlineButtons={false} />
        </div>
      </ChartBox>
    );
  }

  return (
    <ChartBox className={twMerge('flex items-center justify-center')}>
      <div className="text-center">Click on a bar!</div>
    </ChartBox>
  );
};

interface Props2 {
  data?: SalesChartData;
}

export const SalesChartDetails = ({ data }: Props2) => {
  if (data) {
    return (
      <ChartBox noCSSStyles className="px-4 py-4">
        <div className={twMerge(secondaryBgColor, 'flex flex-col')} style={{ aspectRatio: '4 / 5' }}>
          <div className="flex-1 rounded-lg overflow-clip">
            <EZImage src={data?.tokenImage} className="duration-300 hover:scale-110" />
          </div>

          <div className="font-bold truncate ml-1 mt-1">{data?.tokenId}</div>

          <div className={twMerge('flex flex-row space-x-3 m-1')}>
            <div className="flex flex-col">
              <div className="truncate">Sale price</div>
              <div className="truncate">{data?.salePrice}</div>
            </div>
            <div className="flex flex-col">
              <div className="truncate">Date</div>
              <div className="truncate">{new Date(data?.timestamp ?? 0).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </ChartBox>
    );
  }

  return (
    <ChartBox className={twMerge('flex items-center justify-center')}>
      <div className="text-center">Click a dot to see more details</div>
    </ChartBox>
  );
};
