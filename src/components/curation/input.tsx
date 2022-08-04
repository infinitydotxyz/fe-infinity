import React from 'react';
import { useCurationBulkVoteContext } from 'src/utils/context/CurationBulkVoteContext';
import { NumericInputBox } from '../common/numeric-input';
import { MaxButton } from './max-button';

/**
 * Custom `NumericInputBox` component to vote in bulk on multiple collections.
 */
export const NumericVoteInputBox: React.FC<{ collectionId: string }> = ({ collectionId }) => {
  const { decreaseVotes, increaseVotes, votesQuota, setVotesQuota, setVotes, votes } = useCurationBulkVoteContext();
  const value = votes[collectionId] || 0;

  return (
    <div className="flex flex-row space-x-2">
      <MaxButton
        variant="white"
        className="px-3"
        onClick={() => {
          decreaseVotes(collectionId, votesQuota);
        }}
      />
      <NumericInputBox
        value={value}
        min={0}
        max={value + votesQuota}
        onIncrement={() => {
          decreaseVotes(collectionId, 1);
        }}
        onDecrement={() => {
          increaseVotes(collectionId, 1);
        }}
        onChange={(_, nextValue) => {
          const amountChanged = value - nextValue;
          setVotesQuota((state) => state + amountChanged);
          setVotes((state) => ({ ...state, [collectionId]: (state[collectionId] || 0) - amountChanged }));
        }}
      />
    </div>
  );
};
