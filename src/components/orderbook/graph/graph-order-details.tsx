import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../orderbook-list/orderbook-row-button';
import { clamp } from './graph-utils';
import { GraphBox } from './graph-box';
import { NextPrevArrows } from './next-prev-arrows';
import { textClr } from 'src/utils/ui-constants';

interface Props9 {
  orders: SignedOBOrder[];
  index: number;
  setIndex: (index: number) => void;
  valueClassName?: string;
}

export const GraphOrderDetails = ({ orders, index, setIndex, valueClassName = '' }: Props9) => {
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
      <GraphBox noCSSStyles className={textClr}>
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
      </GraphBox>
    );
  }

  return (
    <GraphBox className={twMerge(textClr, 'flex-1 items-center justify-center')}>
      <div className="text-center">Nothing selected</div>
    </GraphBox>
  );
};
