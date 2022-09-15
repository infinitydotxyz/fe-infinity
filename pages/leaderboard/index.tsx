import { Phase } from '@infinityxyz/lib-frontend/types/core';
import { EZImage, NextLink, PageBox, Spinner } from 'src/components/common';
import { useRaffleLeaderboard } from 'src/hooks/api/useRaffleLeaderboard';
import { formatNumber, nFormatter } from 'src/utils';

const CURREN_PHASE = Phase.One; // TODO: dynamically get current phase from somewhere?

const LeaderboardPage = () => {
  const { result: raffles, isLoading } = useRaffleLeaderboard(CURREN_PHASE);

  return (
    <PageBox title={`Leaderboard (${CURREN_PHASE})`}>
      <div className="space-y-4 mt-8">
        {isLoading && <Spinner />}
        {!isLoading &&
          raffles.map((raffle) => {
            return (
              <div
                key={raffle.userAddress}
                className="bg-theme-light-200 px-10 h-[110px] rounded-3xl flex items-center font-heading"
              >
                <div className="flex justify-between items-center w-full ml-6">
                  <NextLink href={`/user/${raffle.userAddress}`}>
                    <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={raffle.user.profileImage} />
                  </NextLink>

                  <NextLink href={`/user/${raffle.userAddress}`} className="truncate hidden md:inline-block">
                    {raffle.user.displayName || raffle.user.address || raffle.userAddress}
                  </NextLink>

                  <div className="w-1/9 max-w-[80px] min-w-[80px]">
                    <div className="text-black font-bold font-body flex items-center">Rank</div>
                    <div>{raffle.rank}</div>
                  </div>

                  <div className="w-1/9 max-w-[80px] min-w-[80px]">
                    <div className="text-black font-bold font-body flex items-center">Tickets</div>
                    <div>{formatNumber(raffle.numTickets)}</div>
                  </div>

                  <div className="w-1/9 max-w-[100px] min-w-[80px]">
                    <div className="text-black font-bold font-body flex items-center">Volume</div>
                    <div>{`${raffle.volumeUSDC ? nFormatter(raffle.volumeUSDC) : '-'}`} USDC</div>
                  </div>

                  <div className="w-1/9 max-w-[80px] min-w-[80px]">
                    <div className="text-black font-bold font-body flex items-center">Luckiness</div>
                    <div>{formatNumber(raffle.chanceOfWinning)}%</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </PageBox>
  );
};

export default LeaderboardPage;
