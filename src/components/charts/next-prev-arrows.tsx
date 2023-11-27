import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';

interface Props {
  orders: CollectionOrder[];
  index: number;
  className?: string;
}

export const NextPrevArrows = ({ orders, index, className = '' }: Props) => {
  return (
    <div className={twMerge(className)}>
      <NextPrev numItems={orders.length} index={index} />
    </div>
  );
};

// ====================================================================

interface Props2 {
  numItems: number;
  index: number;
}

const NextPrev = ({ index, numItems }: Props2) => {
  let progress = '0';

  if (numItems > 0) {
    progress = `${index + 1} / ${numItems}`;
  }

  return (
    <div className="flex w-full items-center rounded-lg">
      <div className="flex select-none">
        <div className="text-lg text-neutral-700 dark:text-white font-body font-semibold">{progress}</div>
      </div>
    </div>
  );
};
