import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { EZImage, SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../list/orderbook-row-button';
import { clamp } from './chart-utils';
import { ChartBox } from './chart-box';
import { NextPrevArrows } from './next-prev-arrows';
import { cardClr, textClr } from 'src/utils/ui-constants';
import { SaleEntry } from './scatter-chart';

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
      },
      {
        title: <div className=""># NFTs</div>,
        value: <div className=" selection: font-heading">{order.numItems}</div>
      }
    ];

    return (
      <ChartBox noCSSStyles className={textClr}>
        <div className={twMerge(textClr, 'mb-3 flex items-center')}>
          <div className={twMerge(textClr, 'flex-[2] text-lg font-bold')}>Order details</div>
          <Spacer />
          <NextPrevArrows orders={orders} index={index} setIndex={setIndex} className="flex-[2] pointer-events-auto" />
        </div>

        <SimpleTable className="space-y-1" items={tableItems} valueClassName={valueClassName} rowClassName="text-md" />

        <div className="my-2 flex justify-center pointer-events-auto">
          <OrderbookRowButton order={order} outlineButtons={false} />
        </div>

        <OrderDetailPicker order={order} scroll={true} className="text-dark-gray-200" />
      </ChartBox>
    );
  }

  return (
    <ChartBox className={twMerge(textClr, 'flex-1 items-center justify-center')}>
      <div className="text-center">Nothing selected</div>
    </ChartBox>
  );
};

interface Props2 {
  data?: SaleEntry;
}

export const SalesChartDetails = ({ data }: Props2) => {
  if (data) {
    return (
      <ChartBox noCSSStyles className={textClr}>
        <div className={twMerge(cardClr, 'rounded-2xl flex flex-col')} style={{ aspectRatio: '4 / 5' }}>
          <div className="relative flex-1">
            <div className="absolute top-0 bottom-0 left-0 right-0 rounded-t-2xl overflow-clip">
              <EZImage src={data?.tokenImage} className="transition-all" />
            </div>
          </div>

          <div className="font-bold truncate ml-1 mt-1">{data?.tokenId}</div>

          <div className={twMerge(textClr, 'flex flex-row space-x-3 m-1')}>
            <div className="flex flex-col">
              <div className="truncate">Sale price</div>
              <div className="truncate">{data?.salePrice}</div>
            </div>
            <div className="flex flex-col">
              <div className="truncate">Sale price</div>
              <div className="truncate">{data?.salePrice}</div>
            </div>
          </div>
        </div>
      </ChartBox>
    );
  }

  return (
    <ChartBox className={twMerge(textClr, 'flex-1 items-center justify-center')}>
      <div className="text-center">Nothing selected</div>
    </ChartBox>
  );
};
