import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { EZImage, SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../list/orderbook-row-button';
import { clamp } from './chart-utils';
import { ChartBox } from './chart-box';
import { NextPrevArrows } from './next-prev-arrows';
import { secondaryBgColor, secondaryTextColor } from 'src/utils/ui-constants';
import { SalesChartData } from './scatter-chart';

interface Props {
  orders: SignedOBOrder[];
  index: number;
  setIndex: (index: number) => void;
  valueClassName?: string;
}

export const OrdersChartDetails = ({ orders, index, setIndex, valueClassName = '' }: Props) => {
  if (orders.length > 0) {
    const order = orders[clamp(index, 0, orders.length - 1)];
    const tableItems: SimpleTableItem[] = [
      {
        title: <div className="">Type</div>,
        value: <div className=" selection: font-heading">{order.isSellOrder ? 'Listing' : 'Offer'}</div>
      },
      {
        title: <div className="">Price</div>,
        value: <div className="  font-heading">{order.startPriceEth}</div>
      }
    ];

    return (
      <ChartBox noCSSStyles>
        <div className={twMerge('mb-3 flex items-center')}>
          <div className={twMerge('flex-[2] text-lg font-bold')}>Order details</div>
          <Spacer />
          <NextPrevArrows orders={orders} index={index} setIndex={setIndex} className="flex-[2] pointer-events-auto" />
        </div>

        <SimpleTable className="space-y-1" items={tableItems} valueClassName={valueClassName} rowClassName="text-md" />

        <div className="my-2 flex justify-center pointer-events-auto">
          <OrderbookRowButton order={order} outlineButtons={false} />
        </div>

        <OrderDetailPicker order={order} scroll={true} className={secondaryTextColor} />
      </ChartBox>
    );
  }

  return (
    <ChartBox className={twMerge('flex items-center justify-center')}>
      <div className="text-center">Click a bar to drill down the chart and see orders in the clicked bar</div>
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
