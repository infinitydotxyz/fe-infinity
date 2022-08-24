import React, { useState } from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, SimpleTable, SimpleTableItem, Spacer } from '../../common';
import { OrderDetailPicker } from '../order-detail-picker';
import { FaPlay } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

interface Props9 {
  orders: SignedOBOrder[];
}

export const GraphOrderDetails = ({ orders }: Props9) => {
  const [index, setIndex] = useState(0);
  const textColor = 'text-[#60ccfe]';

  if (orders.length > 0) {
    const order = orders[index];

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

    const onButtonClick = () => {
      // sdf
    };

    return (
      <div className={twMerge(textColor, 'flex flex-col h-full bg-white bg-opacity-10 rounded-2xl p-8')}>
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
        <div className="text-gray-300 mb-2 text-lg font-bold">Order Details</div>
        <OrderDetailPicker order={order} scroll={true} className="text-gray-300" />

        <SimpleTable className="text-gray-300" items={tableItems} />

        <div className="mt-10">
          <Button variant="white" className="w-full font-heading" onClick={onButtonClick}>
            Buy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        textColor,
        'flex flex-col w-full h-full items-center justify-center  bg-white bg-opacity-10 rounded-2xl  '
      )}
    >
      <div>Nothing selected</div>
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
  const content = numItems > 1 ? `${index + 1} / ${numItems} orders` : '1 order';

  return (
    <div className="flex w-full items-center rounded-lg mb-6">
      <Button disabled={numItems < 2} variant="round" className="transform rotate-180" onClick={onPrev}>
        <FaPlay className="h-6 w-6" />
      </Button>

      <Spacer />
      <div className="  select-none text-md">{content}</div>
      <Spacer />

      <Button disabled={numItems < 2} variant="round" className=" " onClick={onNext}>
        <FaPlay className="h-6 w-6" />
      </Button>
    </div>
  );
};
