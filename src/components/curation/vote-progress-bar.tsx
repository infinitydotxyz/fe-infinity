import React, { useMemo } from 'react';
import { numberFormatter } from 'src/utils/number-formatter';
import { twMerge } from 'tailwind-merge';

export type VoteProgressBarProps = {
  /**
   * Total number of votes on the collection.
   */
  totalVotes: number;

  /**
   * The user's number of votes.
   */
  votes: number;

  className?: string;
};

export const VoteProgressBar: React.FC<VoteProgressBarProps> = ({ votes, totalVotes, className }) => {
  const percentage = useMemo(() => {
    const p = Math.floor((votes / totalVotes) * 100);

    if (isNaN(p)) {
      return 0;
    } else if (!isFinite(p)) {
      return 100;
    } else {
      return p;
    }
  }, [votes, totalVotes]);

  return (
    <div className={twMerge('bg-white rounded-lg w-full relative', className)}>
      <div
        className={twMerge(
          'bg-[#92DEFF] rounded-lg text-sm font-normal py-6',
          percentage < 100 ? 'rounded-r-none' : ''
        )}
        style={{ maxWidth: `${percentage}%` }}
      ></div>

      <div className="w-full h-full absolute top-3 px-4">
        <div className="flex flex-row justify-between">
          <span className="font-heading">
            <span className="font-black">
              {numberFormatter.format(votes)} / {numberFormatter.format(totalVotes)}
            </span>
            <span className="font-normal ml-2">votes</span>
          </span>
          <span className="font-black">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};
