import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { FaPlay } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { Button, Spacer } from '../common';

interface Props {
  orders: CollectionOrder[];
  index: number;
  setIndex: (index: number) => void;
  className?: string;
}

export const NextPrevArrows = ({ orders, index, setIndex, className = '' }: Props) => {
  return (
    <div className={twMerge(className)}>
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
        <FaPlay className="h-3 w-3" />
      </Button>

      <Spacer />
      <div className="flex select-none">
        <div className="">{progress}</div>
      </div>
      <Spacer />

      <Button disabled={numItems < 2} variant="round" className=" " onClick={onNext}>
        <FaPlay className="h-3 w-3" />
      </Button>
    </div>
  );
};
