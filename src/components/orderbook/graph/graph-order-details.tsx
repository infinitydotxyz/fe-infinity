import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { FaPlay } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../orderbook-list/orderbook-row-button';
import { blueColorText, clamp } from './graph-utils';
import { GraphBox } from './graph-box';

interface Props9 {
  orders: SignedOBOrder[];
  index: number;
  setIndex: (index: number) => void;
}

export const GraphOrderDetails = ({ orders, index, setIndex }: Props9) => {
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
        <GraphBox className="mb-4 py-3">
          <NextPrevArrows
            numItems={orders.length}
            index={index}
            onNext={() => {
              let x = index + 1;

              if (x >= orders.length) {
                x = 0;
              }

              setIndex(x);
            }}
            onPrev={() => {
              let x = index - 1;

              if (x < 0) {
                x = orders.length - 1;
              }

              setIndex(x);
            }}
          />
        </GraphBox>

        <GraphBox className="py-6">
          <div className="mb-2 text-lg font-bold">Order Details</div>
          <OrderDetailPicker order={order} scroll={true} className="text-gray-300" />

          <SimpleTable className="text-gray-300" items={tableItems} />

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

// =================================================================

interface Props4 {
  numItems: number;
  index: number;
  onNext: () => void;
  onPrev: () => void;
}

export const NextPrevArrows = ({ index, numItems, onNext, onPrev }: Props4) => {
  const progress = numItems > 1 ? `${index + 1} / ${numItems}` : '1';
  const content = numItems > 1 ? 'Orders' : 'Order';

  return (
    <div className="flex w-full items-center rounded-lg">
      <Button disabled={numItems < 2} variant="round" className="transform rotate-180" onClick={onPrev}>
        <FaPlay className="h-6 w-6" />
      </Button>

      <Spacer />
      <div className="flex select-none text-md">
        <div className="mr-3 font-bold">{progress}</div>
        <div className=" ">{content}</div>
      </div>
      <Spacer />

      <Button disabled={numItems < 2} variant="round" className=" " onClick={onNext}>
        <FaPlay className="h-6 w-6" />
      </Button>
    </div>
  );
};
