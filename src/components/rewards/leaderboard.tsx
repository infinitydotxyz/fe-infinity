// export const LeaderboardRow = () => {

import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useEffect, useState } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { apiGet, ellipsisAddress, getChainScannerBase, nFormatter } from 'src/utils';
import { borderColor, brandBorderColor, hoverColorBrandText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount, useNetwork } from 'wagmi';
import { ClipboardButton, ScrollLoader } from '../common';
import { useAppContext } from 'src/utils/context/AppContext';

export interface LeaderboardQuery {
  orderBy: 'total' | 'referrals' | 'buys';
  limit: number;
}

interface LeaderboardItem {
  user: string;
  referralPoints: number;
  totalPoints: number;
  buyPoints: number;
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

const useLeaderboard = (orderBy: LeaderboardQuery['orderBy']) => {
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

    loadNextPage();
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
    items,
    isLoading,
    fetchMore: loadNextPage,
    pagination
  };
};

const propertyClassname = 'flex-col flex justify-between md:mt-0 mt-2';

export const Leaderboard = ({ orderBy }: { orderBy: LeaderboardQuery['orderBy'] }) => {
  const { items, isLoading, fetchMore, pagination } = useLeaderboard(orderBy);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id || selectedChain);

  return (
    <div className="pb-5 grid grid-flow-row-dense gap-2 grid-cols-1 w-full">
      {items.map((data, index) => {
        const isUser = trimLowerCase(data.user) === trimLowerCase(address);
        return (
          <div
            className={twMerge(
              borderColor,
              'rounded-lg border-2 p-2 flex items-center',
              isUser ? brandBorderColor : ''
            )}
            key={data.user}
          >
            <div className="hidden md:flex items-center font-bold font-heading">{index + 1}</div>
            <div className="ml-10 grid gap-2 justify-between items-center w-full grid-cols-2 md:grid-cols-4 mx-2">
              <div className={propertyClassname}>
                <div className="text-sm font-bold">Address</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm">{isUser ? 'You' : ellipsisAddress(data.user)}</div>
                  <ClipboardButton className={twMerge(hoverColorBrandText)} textToCopy={data.user} />
                  <HiOutlineExternalLink
                    className={twMerge(hoverColorBrandText, 'text-md cursor-pointer')}
                    onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + data.user)}
                  />
                </div>
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

              <div className={propertyClassname}>
                <div className="text-sm font-bold">Buy Points</div>
                {Number.isNaN(data.buyPoints) ? (
                  '-'
                ) : (
                  <div className={'text-green-600'}>{nFormatter(data.buyPoints)}</div>
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
