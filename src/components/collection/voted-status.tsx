import { FunctionComponent, useEffect, useState } from 'react';
import { useFetch } from 'src/utils';
import { Button } from '../common';
import clsx from 'classnames';

interface VotedStatusProps {
  chainId: string;
  collectionAddress: string;
}

interface CollectionVotesDto {
  collectionAddress: string;
  collectionChainId: string;
  votesFor: number;
  votesAgainst: number;
}

enum VOTE_ACTION {
  VOTES_FOR = 'VOTES_FOR',
  VOTES_AGAINST = 'VOTES_AGAINST',
  NO_VOTES = 'NO_VOTES'
}

const VotedStatus: FunctionComponent<VotedStatusProps> = ({ chainId, collectionAddress }) => {
  const { result } = useFetch<CollectionVotesDto>(`/collections/${chainId}:${collectionAddress}/votes`);
  const [userVote, setUserVote] = useState<VOTE_ACTION>(VOTE_ACTION.NO_VOTES);

  const [votesFor, setVotesFor] = useState(0);
  const [votesAgainst, setVotesAgainst] = useState(0);

  const handleVoteFor = () => {
    switch (userVote) {
      case VOTE_ACTION.NO_VOTES:
        console.log('yes');
        setVotesFor(votesFor + 1);
        break;
      case VOTE_ACTION.VOTES_FOR:
        setVotesFor(votesFor - 1);
        break;
      case VOTE_ACTION.VOTES_AGAINST:
        setVotesFor(votesFor + 1);
        setVotesAgainst(votesAgainst - 1);
        break;
    }
    const newStatus = userVote === VOTE_ACTION.VOTES_FOR ? VOTE_ACTION.NO_VOTES : VOTE_ACTION.VOTES_FOR;
    setUserVote(newStatus);
  };

  const handleVoteAgainst = () => {
    switch (userVote) {
      case VOTE_ACTION.NO_VOTES:
        setVotesAgainst(votesAgainst + 1);
        break;
      case VOTE_ACTION.VOTES_AGAINST:
        setVotesAgainst(votesAgainst - 1);
        break;
      case VOTE_ACTION.VOTES_FOR:
        setVotesAgainst(votesAgainst + 1);
        setVotesFor(votesFor - 1);
        break;
    }
    const newStatus = userVote === VOTE_ACTION.VOTES_AGAINST ? VOTE_ACTION.NO_VOTES : VOTE_ACTION.VOTES_AGAINST;
    setUserVote(newStatus);
  };

  useEffect(() => {
    if (result) {
      setVotesFor(result.votesFor);
      setVotesAgainst(result.votesAgainst);
    }
  }, [result]);

  const total = votesAgainst + votesFor;
  const percentage = total !== 0 ? Math.ceil((votesFor * 100) / total) : 0;
  const IsOnlyVoted = votesAgainst === 0;
  const IsOnlyAgainst = votesFor === 0;

  return (
    <>
      <div className="text-4xl mb-6 lg:mb-10">You Voted</div>
      <div className="grid grid-cols-2 gap-10 mb-6">
        <Button
          variant={userVote === VOTE_ACTION.VOTES_FOR ? 'primary' : 'outline'}
          size="plain"
          className="p-3 text-base border rounded-3xl w-full"
          onClick={handleVoteFor}
        >
          Good {userVote === VOTE_ACTION.VOTES_FOR && '✓'}
        </Button>
        <Button
          variant={userVote === VOTE_ACTION.VOTES_AGAINST ? 'primary' : 'outline'}
          size="plain"
          className="p-3 text-base border rounded-3xl w-full"
          onClick={handleVoteAgainst}
        >
          Bad {userVote === VOTE_ACTION.VOTES_AGAINST && '✓'}
        </Button>
      </div>
      <div className="flex">
        {total === 0 || IsOnlyVoted || IsOnlyAgainst ? (
          <div
            style={{ width: '100%', background: `${IsOnlyVoted ? '#92DEFF' : '#F6F6F6'}` }}
            className={clsx('border rounded-3xl py-3 pl-5 font-heading tracking-tight text-center')}
          >
            {total === 0 ? 'No Votes Yet' : IsOnlyVoted ? '100% Good' : '100% Bad'}
          </div>
        ) : (
          <>
            <div
              style={{ width: `${percentage}%`, background: '#92DEFF' }}
              className={clsx('border-l border-t border-b rounded-l-3xl py-3 pl-5 font-heading tracking-tight')}
            >
              <b>{percentage}%</b> Good
            </div>
            <div
              style={{ width: `${100 - percentage}%`, background: '#F6F6F6' }}
              className="border-r border-t border-b rounded-r-3xl py-3 font-heading tracking-tight pr-5 text-right"
            >
              <b>{100 - percentage}%</b> Bad
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { VotedStatus };
