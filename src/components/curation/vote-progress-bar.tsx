import React, { useMemo } from 'react';
import { ProgressBar } from '../common/progress-bar';
import { numberFormatter } from 'src/utils/number-formatter';

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
    <ProgressBar percentage={percentage} className={className}>
      <span className="space-x-2 font-heading">
        <span className="font-black">
          {numberFormatter.format(votes)} / {numberFormatter.format(totalVotes)}
        </span>
        <span className="font-normal">votes</span>
      </span>
    </ProgressBar>
  );
};
