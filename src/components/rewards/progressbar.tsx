import { round } from '@infinityxyz/lib-frontend/utils';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

export type RewardsProgressBarProps = {
  /**
   * The current value.
   */
  amount: number;

  /**
   * The maximum amount, used to calculate the percentage.
   *
   * E.g. `amount` = 100, `max` = 200 => 50%
   */
  max: number;

  className?: string;
};

export const RewardsProgressBar: React.FC<RewardsProgressBarProps> = ({ amount, max, className }) => {
  const percentage = useMemo(() => (amount <= max ? (amount / max) * 100 : 100), [amount, max]);

  return (
    <div className={twMerge('bg-gray-100 rounded-3xl w-full relative', className)}>
      <div
        className={twMerge(
          'bg-[#92DEFF] rounded-3xl text-sm font-normal py-4',
          percentage < 100 && percentage > 10 ? 'rounded-r-none' : ''
        )}
        style={{ maxWidth: `${percentage}%`, minWidth: percentage > 0 ? '2rem' : '0' }}
      ></div>

      <div className="absolute top-0 left-2 z-10">
        <span className="space-x-2 font-heading">
          <span className="font-black">{round(percentage, 2)}%</span>
        </span>
      </div>
    </div>
  );
};
