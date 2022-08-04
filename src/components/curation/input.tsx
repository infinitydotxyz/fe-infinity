import React, { useState } from 'react';
import { useCurationBulkVoteContext } from 'src/utils/context/CurationBulkVoteContext';
import { NumericInputBox } from '../common/numeric-input';
import { MaxButton } from './max-button';

/**
 * Custom `NumericInputBox` component to vote in bulk on multiple collections.
 */
export const NumericVoteInputBox: React.FC = () => {
  const [value, setValue] = useState(0);
  const { decreaseVotes, increaseVotes, votes: votesLeft, setVotes } = useCurationBulkVoteContext();

  return (
    <div className="flex flex-row space-x-2">
      <MaxButton
        variant="white"
        className="px-3"
        onClick={() => {
          setValue((state) => state + votesLeft);
          setVotes(0);
        }}
      />
      <NumericInputBox
        value={value}
        min={0}
        max={value + votesLeft}
        onIncrement={() => {
          setValue((state) => state + 1);
          decreaseVotes(1);
        }}
        onDecrement={() => {
          setValue((state) => state - 1);
          increaseVotes(1);
        }}
        onChange={(_, nextValue) => {
          const amountChanged = value - nextValue;
          setValue(nextValue);
          setVotes((state) => state + amountChanged);
        }}
      />
    </div>
  );
};
