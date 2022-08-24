import React, { useEffect, useState } from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { FaPlay } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { OrderbookRowButton } from '../orderbook-list/orderbook-row-button';
import { blueColorText } from './graph-utils';

const backgroundStyle = 'flex flex-col h-full bg-white bg-opacity-10 border border-[#333] rounded-xl px-8  ';
const contentStyle = backgroundStyle + 'py-6';
const nothingStyle = contentStyle + 'items-center justify-center bg-opacity-5';

interface Props9 {
  orders: SignedOBOrder[];
  startIndex?: number;
}

export const GraphOrderDetails = ({ orders, startIndex = 0 }: Props9) => {
  const [index, setIndex] = useState(startIndex);
  const textColor = blueColorText;

  useEffect(() => {
    setIndex(0);
  }, [orders]);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  if (orders.length > 0) {
    const order = orders[Math.max(0, Math.min(index, orders.length - 1))];

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
        <div className={twMerge(backgroundStyle, 'mb-4 py-3')}>
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
        </div>

        <div className={twMerge(contentStyle)}>
          <div className="mb-2 text-lg font-bold">Order Details</div>
          <OrderDetailPicker order={order} scroll={true} className="text-gray-300" />

          <SimpleTable className="text-gray-300" items={tableItems} />

          <div className="mt-10 flex justify-center">
            <OrderbookRowButton order={order} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge(textColor, nothingStyle)}>
      <div className="text-center">Nothing selected</div>
    </div>
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
