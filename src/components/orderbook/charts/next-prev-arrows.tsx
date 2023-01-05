import React from 'react';
import { Button, Spacer } from '../../common';
import { FaPlay } from 'react-icons/fa';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';
import { textClr } from 'src/utils/ui-constants';

interface Props {
  orders: SignedOBOrder[];
  index: number;
  setIndex: (index: number) => void;
  className?: string;
}

export const NextPrevArrows = ({ orders, index, setIndex, className = '' }: Props) => {
  return (
    <div className={twMerge(textClr, className)}>
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
    </div>
  );
};

// ====================================================================

interface Props2 {
  numItems: number;
  index: number;
  onNext: () => void;
  onPrev: () => void;
}

const NextPrev = ({ index, numItems, onNext, onPrev }: Props2) => {
  let progress = '0';

  if (numItems > 0) {
    progress = `${index + 1} / ${numItems}`;
  }

  return (
    <div className="flex w-full items-center rounded-lg">
      <Button disabled={numItems < 2} variant="round" className="transform rotate-180" onClick={onPrev}>
        <FaPlay className="h-5 w-5" />
      </Button>

      <Spacer />
      <div className="flex select-none">
        <div className="">{progress}</div>
      </div>
      <Spacer />

      <Button disabled={numItems < 2} variant="round" className=" " onClick={onNext}>
        <FaPlay className="h-5 w-5" />
      </Button>
    </div>
  );
};
