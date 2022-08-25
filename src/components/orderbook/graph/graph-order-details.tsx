import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { SimpleTable, SimpleTableItem } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../orderbook-list/orderbook-row-button';
import { blueColorText, clamp } from './graph-utils';
import { GraphBox } from './graph-box';

interface Props9 {
  orders: SignedOBOrder[];
  index: number;
  valueClassName?: string;
}

export const GraphOrderDetails = ({ orders, index, valueClassName = '' }: Props9) => {
  const textColor = blueColorText;

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
        value: <div className="  font-heading">{new Date(order.endTimeMs).toLocaleString()}</div>
      }
    ];

    return (
      <div className={twMerge(textColor)}>
        <GraphBox className="py-6">
          <div className="mb-2 text-lg font-bold">Order Details</div>
          <OrderDetailPicker order={order} scroll={true} className="text-gray-300" />

          <SimpleTable className="text-gray-300" items={tableItems} valueClassName={valueClassName} />

          <div className="mt-10 flex justify-center">
            <OrderbookRowButton order={order} />
          </div>
        </GraphBox>
      </div>
    );
  }

  return (
    <GraphBox className={twMerge(textColor, 'h-full items-center justify-center')}>
      <div className="text-center">Nothing selected</div>
    </GraphBox>
  );
};
