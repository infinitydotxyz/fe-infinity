import { FunctionComponent, useEffect, useState } from 'react';
import { Button } from '../common';

const VotedStatus: FunctionComponent = () => {
  const [isVoted, setVoted] = useState(true);
  const [percentage, setPercentage] = useState(100);
  const handleVote = () => {
    setVoted(!isVoted);
  };
  useEffect(() => {
    if (isVoted) setPercentage(70);
    else setPercentage(60);
  }, [isVoted]);

  return (
    <>
      <div className="text-5xl mb-6 lg:mb-10">You Voted</div>
      <div className="grid grid-cols-2 gap-10 mb-6">
        <Button
          variant={isVoted ? 'primary' : 'outline'}
          size="plain"
          className="p-3 text-base border rounded-3xl w-full"
          onClick={handleVote}
        >
          Good {isVoted && '✓'}
        </Button>
        <Button
          variant={isVoted ? 'outline' : 'primary'}
          size="plain"
          className="p-3 text-base border rounded-3xl w-full"
          onClick={handleVote}
        >
          Bad {!isVoted && '✓'}
        </Button>
      </div>
      <div className="flex">
        <div
          style={{ width: `${percentage}%`, background: '#92DEFF' }}
          className="border-l border-t border-b rounded-l-3xl py-3 pl-5 font-bold font-body tracking-tight"
        >
          {percentage}% Good
        </div>
        <div
          style={{ width: `${100 - percentage}%`, background: '#F6F6F6' }}
          className="border-r border-t border-b rounded-r-3xl py-3 font-bold font-body tracking-tight pr-5 text-right"
        >
          {100 - percentage}% Bad
        </div>
      </div>
    </>
  );
};

export { VotedStatus };
