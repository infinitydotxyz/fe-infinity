// export const LeaderboardRow = () => {

import { useEffect, useState } from 'react';
import { apiGet, ellipsisAddress, nFormatter } from 'src/utils';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ScrollLoader } from '../common';
import { useAccount } from 'wagmi';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';

// }
interface LeaderboardQuery {
  orderBy: 'total' | 'referrals';
  limit: number;
}

interface LeaderboardItem {
  user: string;
  referralPoints: number;
  totalPoints: number;
}

const fetch = async ({ orderBy, cursor }: { orderBy: LeaderboardQuery['orderBy']; cursor: string }) => {
  const { result } = await apiGet('/pixl/rewards/leaderboard', {
    query: {
      orderBy,
      limit: 24,
      cursor
    }
  });
  return {
    items: result.data as LeaderboardItem[],
    pagination: {
      hasNextPage: result.hasNextPage as boolean,
      cursor: result.cursor as string
    }
  };
};

const useLeaderboard = () => {
  const [orderBy, setOrderBy] = useState<LeaderboardQuery['orderBy']>('total');
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [pagination, setPagination] = useState<{ hasNextPage: boolean; cursor: string }>({
    hasNextPage: true,
    cursor: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [nonce, setNonce] = useState(0);

  const loadNextPage = () => {
    setNonce((prev) => prev + 1);
  };

  const reset = () => {
    setItems([]);
    setPagination({
      hasNextPage: true,
      cursor: ''
    });
  };

  useEffect(() => {
    reset();
  }, [orderBy]);

  useEffect(() => {
    if (!pagination.hasNextPage) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    fetch({ orderBy, cursor: pagination.cursor })
      .then((result) => {
        if (!isMounted) {
          return;
        }

        setItems((prev) => {
          const users = new Set();
          const updated = [...prev, ...result.items].filter((item) => {
            if (users.has(item.user)) {
              return false;
            }
            users.add(item.user);
            return true;
          });

          return updated;
        });
        setPagination(result.pagination);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        console.error(err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [nonce]);

  return {
    orderBy,
    setOrderBy,
    items,
    isLoading,
    fetchMore: loadNextPage,
    pagination
  };
};

const propertyClassname = 'flex-col flex justify-between md:mt-0 mt-2';

export const Leaderboard = () => {
  const { items, isLoading, fetchMore, pagination } = useLeaderboard();
  const { address } = useAccount();

  return (
    <div className="pb-5 grid grid-flow-row-dense gap-2 grid-cols-1">
      {items.map((data, index) => {
        const isUser = trimLowerCase(data.user) === trimLowerCase(address);
        return (
          <div
            className={twMerge(
              borderColor,
              'rounded-lg border p-2 flex items-center',
              isUser ? '!border-green-600' : ''
            )}
            key={data.user}
          >
            <div className="grid gap-2 justify-between items-center w-full grid-cols-3 md:grid-cols-4 mx-2">
              <div className="hidden md:flex items-center font-bold font-heading">{index + 1}</div>

              <div className={propertyClassname}>
                <div className="text-sm font-bold">User</div>
                <div className="text-sm">{isUser ? 'You' : ellipsisAddress(data.user)}</div>
              </div>

              <div className={propertyClassname}>
                <div className="text-sm font-bold">Total Points</div>
                {Number.isNaN(data.totalPoints) ? (
                  '-'
                ) : (
                  <div className={'text-green-600'}>{nFormatter(data.totalPoints)}</div>
                )}
              </div>

              <div className={propertyClassname}>
                <div className="text-sm font-bold">Referral Points</div>
                {Number.isNaN(data.referralPoints) ? (
                  '-'
                ) : (
                  <div className={'text-green-600'}>{nFormatter(data.referralPoints)}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <ScrollLoader
        onFetchMore={() => {
          if (pagination.hasNextPage && !isLoading) {
            fetchMore();
          }
        }}
      />
    </div>
  );
};
