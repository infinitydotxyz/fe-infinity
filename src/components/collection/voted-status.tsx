import { FunctionComponent, useEffect, useState } from 'react';
import { apiPost, useFetch } from 'src/utils';
import { Button } from 'src/components/common';
import clsx from 'classnames';
import { useAppContext } from 'src/utils/context/AppContext';

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

interface UserVote {
  votedFor: boolean;
}

enum VOTE_ACTION {
  VOTES_FOR = 'VOTES_FOR',
  VOTES_AGAINST = 'VOTES_AGAINST',
  NO_VOTES = 'NO_VOTES'
}

const VotedStatus: FunctionComponent<VotedStatusProps> = ({ chainId, collectionAddress }) => {
  const { user } = useAppContext();

  const { result } = useFetch<CollectionVotesDto>(`/collections/${chainId}:${collectionAddress}/votes`);

  const API_USER_COLLECTION_ADDR = `/user/${chainId}:${user?.address}/collectionVotes/${chainId}:${collectionAddress}`;

  const { result: userCollectionVote, error: userCollectionVoteError } = useFetch<UserVote>(API_USER_COLLECTION_ADDR);
  const [userVote, setUserVote] = useState<VOTE_ACTION>(VOTE_ACTION.NO_VOTES);

  const [votesFor, setVotesFor] = useState(0);
  const [votesAgainst, setVotesAgainst] = useState(0);

  const handleVoteFor = () => {
    switch (userVote) {
      case VOTE_ACTION.NO_VOTES:
        setVotesFor(votesFor + 1);
        break;
      case VOTE_ACTION.VOTES_FOR:
        return;
      case VOTE_ACTION.VOTES_AGAINST:
        setVotesFor(votesFor + 1);
        setVotesAgainst(votesAgainst - 1);
        break;
    }
    void apiPost(API_USER_COLLECTION_ADDR, { data: { votedFor: true } });
    setUserVote(VOTE_ACTION.VOTES_FOR);
  };

  const handleVoteAgainst = () => {
    switch (userVote) {
      case VOTE_ACTION.NO_VOTES:
        setVotesAgainst(votesAgainst + 1);
        break;
      case VOTE_ACTION.VOTES_AGAINST:
        return;
      case VOTE_ACTION.VOTES_FOR:
        setVotesAgainst(votesAgainst + 1);
        setVotesFor(votesFor - 1);
        break;
    }
    apiPost(API_USER_COLLECTION_ADDR, { data: { votedFor: false } });
    setUserVote(VOTE_ACTION.VOTES_AGAINST);
  };

  useEffect(() => {
    if (result) {
      setVotesFor(result.votesFor);
      setVotesAgainst(result.votesAgainst);
    }
  }, [result]);

  useEffect(() => {
    if (userCollectionVoteError) {
      setUserVote(VOTE_ACTION.NO_VOTES);
    } else if (userCollectionVote) {
      if (userCollectionVote.votedFor) {
        setUserVote(VOTE_ACTION.VOTES_FOR);
      } else {
        setUserVote(VOTE_ACTION.VOTES_AGAINST);
      }
    }
  }, [userCollectionVote, userCollectionVoteError]);

  const total = votesAgainst + votesFor;
  const percentage = total !== 0 ? Math.ceil((votesFor * 100) / total) : 0;
  const IsOnlyVoted = votesAgainst === 0;
  const IsOnlyAgainst = votesFor === 0;

  return (
    <>
      <div className="text-3xl mb-8">
        {!user ? 'VOTED STATUS' : userVote === VOTE_ACTION.NO_VOTES ? 'Not Voted Yet' : 'You Voted'}
      </div>
      {!user && <p className="px-2 py-1 text-theme-light-800">*Please connect your wallet</p>}
      <div className="grid grid-cols-2 gap-10 mb-4">
        <Button
          variant={userVote === VOTE_ACTION.VOTES_FOR ? 'primary' : 'outline'}
          size="plain"
          className="p-2 text-base border rounded-3xl w-full"
          disabled={!user}
          onClick={handleVoteFor}
        >
          Good <span className="w-1 inline-block">{userVote === VOTE_ACTION.VOTES_FOR && '✓'}</span>
        </Button>
        <Button
          variant={userVote === VOTE_ACTION.VOTES_AGAINST ? 'primary' : 'outline'}
          size="plain"
          className="p-2.5 text-base border rounded-3xl w-full"
          disabled={!user}
          onClick={handleVoteAgainst}
        >
          Bad <span className="w-1 inline-block">{userVote === VOTE_ACTION.VOTES_AGAINST && '✓'}</span>
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
