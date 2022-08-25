import React from 'react';
import { Button, Spacer } from '../../common';
import { FaPlay } from 'react-icons/fa';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';
import { blueColorText } from './graph-utils';
import { GraphBox } from './graph-box';

interface Props {
  orders: SignedOBOrder[];
  index: number;
  setIndex: (index: number) => void;
}

export const NextPrevArrows = ({ orders, index, setIndex }: Props) => {
  const textColor = blueColorText;

  return (
    <div className={twMerge(textColor)}>
      <GraphBox className="py-3">
        <NextPrev
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
    </div>
  );
};

// ====================================================================

interface Props4 {
  numItems: number;
  index: number;
  onNext: () => void;
  onPrev: () => void;
}

const NextPrev = ({ index, numItems, onNext, onPrev }: Props4) => {
  const progress = numItems > 1 ? `${index + 1} / ${numItems}` : '1';
  const content = numItems > 1 ? 'Orders' : 'Order';

  return (
    <div className="flex w-full items-center rounded-lg">
      <Button disabled={numItems < 2} variant="round" className="transform rotate-180" onClick={onPrev}>
        <FaPlay className="h-6 w-6" />
      </Button>

      <Spacer />
      <div className="flex select-none font-bold text-lg">
        <div className="mr-3 ">{progress}</div>
        <div className="">{content}</div>
      </div>
      <Spacer />

      <Button disabled={numItems < 2} variant="round" className=" " onClick={onNext}>
        <FaPlay className="h-6 w-6" />
      </Button>
    </div>
  );
};
