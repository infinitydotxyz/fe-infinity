import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';

type VotesMap = { [collectionId: string]: number };

type CurationBulkVoteType = {
  /**
   * Total amount of votes available to spend.
   */
  votesQuota: number;

  /**
   * Set the total amount of votes available to spend.
   */
  setVotesQuota: Dispatch<SetStateAction<number>>;

  /**
   * Spent votes for each collection.
   */
  votes: VotesMap;

  /**
   * Set the spent votes for each collection.
   */
  setVotes: Dispatch<SetStateAction<VotesMap>>;

  /**
   * Increase the spent votes for the collection by the specified value.
   */
  increaseVotes: (collectionId: string, value: number) => void;

  /**
   * Decrease the spent votes for the collection by the specified value.
   */
  decreaseVotes: (collectionId: string, value: number) => void;
};

const CurationBulkVoteContext = createContext<CurationBulkVoteType | undefined>(undefined);

export const CurationBulkVoteContextProvider = ({ children }: { children: ReactNode }) => {
  const { result: quota } = useUserCurationQuota();
  const [votes, setVotes] = useState<VotesMap>({});
  const [votesQuota, setVotesQuota] = useState<number>(0);
  const increaseVotes = useCallback((collectionId: string, value: number) => {
    setVotes((state) => ({ ...state, [collectionId]: (state[collectionId] || 0) - value }));
    setVotesQuota((state) => state + value);
  }, []);
  const decreaseVotes = useCallback((collectionId: string, value: number) => {
    setVotes((state) => ({ ...state, [collectionId]: (state[collectionId] || 0) + value }));
    setVotesQuota((state) => state - value);
  }, []);

  useEffect(() => {
    if (quota?.availableVotes) {
      setVotesQuota(quota.availableVotes);
    }
  }, [quota?.availableVotes]);

  return (
    <CurationBulkVoteContext.Provider
      value={{
        votes,
        setVotes,
        increaseVotes,
        decreaseVotes,
        setVotesQuota,
        votesQuota
      }}
    >
      {children}
    </CurationBulkVoteContext.Provider>
  );
};

export const useCurationBulkVoteContext = () => {
  return useContext(CurationBulkVoteContext) as CurationBulkVoteType;
};
