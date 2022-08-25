import React from 'react';
import { Button, Spacer } from '../../common';
import { FaPlay } from 'react-icons/fa';

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
