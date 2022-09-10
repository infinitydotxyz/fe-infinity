import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../orderbook-list/orderbook-row-button';
import { textAltColorTW, clamp, textColorTW } from './graph-utils';
import { GraphBox } from './graph-box';
import { NextPrevArrows } from './next-prev-arrows';

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
      },
      {
        title: <div className="">Expiry date</div>,
        value: (
          <div className="font-heading flex flex-col items-end leading-5">
            <div>{new Date(order.endTimeMs).toLocaleDateString()}</div>
            <div>{new Date(order.endTimeMs).toLocaleTimeString()}</div>
          </div>
        )
      }
    ];

    return (
      <GraphBox className={twMerge(textColorTW, 'pt-3 pb-5 flex-1')}>
        <div className={twMerge(textAltColorTW, 'mb-3 flex items-center')}>
          <div className={twMerge(textAltColorTW, 'flex-[2] text-lg font-bold')}>Order details</div>
          <Spacer />
          <NextPrevArrows orders={orders} index={index} setIndex={setIndex} className="flex-[2]" />
        </div>

        <SimpleTable className="" items={tableItems} valueClassName={valueClassName} />

        <div className="my-2 flex justify-center">
          <OrderbookRowButton order={order} outlineButtons={true} />
        </div>

        <OrderDetailPicker order={order} scroll={true} />
      </GraphBox>
    );
  }

  return (
    <GraphBox className={twMerge(textColorTW, 'flex-1 items-center justify-center')}>
      <div className="text-center">Nothing selected</div>
    </GraphBox>
  );
};
