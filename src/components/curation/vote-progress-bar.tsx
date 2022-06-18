import React, { useMemo } from 'react';
import { ProgressBar } from '../common/progress-bar';

export type VoteProgressBarProps = {
  /**
   * Total number of votes on the collection.
   */
  totalVotes: number;

  /**
   * The user's number of votes.
   */
  votes: number;
};

export const VoteProgressBar: React.FC<VoteProgressBarProps> = ({ votes, totalVotes }) => {
  const percentage = useMemo(() => Math.floor((votes / totalVotes) * 100), [votes, totalVotes]);

  return (
    <ProgressBar percentage={percentage}>
      <span className="space-x-2 font-heading">
        {/* TODO: format votes so 1_000_000 becomes 1 M etc. */}
        <span className="font-black">{votes}</span>
        <span className="font-normal">votes</span>
      </span>
    </ProgressBar>
  );
};
