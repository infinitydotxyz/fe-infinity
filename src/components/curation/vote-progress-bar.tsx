import React from 'react';
import { twMerge } from 'tailwind-merge';
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

  className?: string;
};

export const VoteProgressBar: React.FC<VoteProgressBarProps> = ({ votes, totalVotes, className }) => {
  return (
    <ProgressBar
      max={totalVotes}
      amount={votes}
      units="votes"
      className={twMerge('bg-white max-w-[300px] mr-5', className)}
    />
  );
};
