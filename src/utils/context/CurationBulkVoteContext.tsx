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

type CurationBulkVoteType = {
  /**
   * The remaining amount of votes left.
   */
  votes: number;

  /**
   * Set the amount of votes.
   */
  setVotes: Dispatch<SetStateAction<number>>;

  /**
   * Increase the amount of votes by the specified value.
   */
  increaseVotes: (value: number) => void;

  /**
   * Decrease the amount of votes by the specified value.
   */
  decreaseVotes: (value: number) => void;
};

const CurationBulkVoteContext = createContext<CurationBulkVoteType | undefined>(undefined);

export const CurationBulkVoteContextProvider = ({ children }: { children: ReactNode }) => {
  const { result: quota } = useUserCurationQuota();
  const [votes, setVotes] = useState(0); // TODO: store dict of collection id -> amount of votes and calculate total remaining votes based on that instead
  const increaseVotes = useCallback((value: number) => setVotes((state) => state + value), []);
  const decreaseVotes = useCallback((value: number) => setVotes((state) => state - value), []);

  useEffect(() => {
    if (quota?.availableVotes) {
      setVotes(quota.availableVotes);
    }
  }, [quota?.availableVotes]);

  return (
    <CurationBulkVoteContext.Provider
      value={{
        votes,
        setVotes,
        increaseVotes,
        decreaseVotes
      }}
    >
      {children}
    </CurationBulkVoteContext.Provider>
  );
};

export const useCurationBulkVoteContext = () => {
  return useContext(CurationBulkVoteContext) as CurationBulkVoteType;
};
