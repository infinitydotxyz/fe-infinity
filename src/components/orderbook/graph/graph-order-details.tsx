import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../orderbook-list/orderbook-row-button';
import { textAltColorTW, clamp, textColorTW } from './graph-utils';
import { GraphBox } from './graph-box';

interface Props9 {
  orders: SignedOBOrder[];
  index: number;
  valueClassName?: string;
}

export const GraphOrderDetails = ({ orders, index, valueClassName = '' }: Props9) => {
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
      <GraphBox className={twMerge(textColorTW, 'py-5  flex-1   ')}>
        <div className={twMerge(textAltColorTW, 'mb-2 text-lg font-bold')}>Order Details</div>
        <OrderDetailPicker order={order} scroll={true} className=" " />

        <Spacer />

        <SimpleTable className="" items={tableItems} valueClassName={valueClassName} />

        <div className="mt-10 flex justify-center">
          <OrderbookRowButton order={order} />
        </div>
      </GraphBox>
    );
  }

  return (
    <GraphBox className={twMerge(textColorTW, 'flex-1 items-center justify-center')}>
      <div className="text-center">Nothing selected</div>
    </GraphBox>
  );
};
