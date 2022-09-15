import { EthPrice, NextLink, PageBox } from 'src/components/common';
import { formatNumber, nFormatter } from 'src/utils';

const LeaderboardPage = () => {
  // const { isDesktop } = useScreenSize();

  // TODO: fetch real data from BE
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [
    { address: '0x0000000001233', numBuys: 123, numSales: 12, volume: 10255, stakeLevel: 'idk', tickets: 10 },
    { address: '0x0000000001233', numBuys: 123, numSales: 12, volume: 10255, stakeLevel: 'idk', tickets: 10 },
    { address: '0x0000000001233', numBuys: 123, numSales: 12, volume: 10255, stakeLevel: 'idk', tickets: 10 }
  ];

  return (
    <PageBox title="Leaderboard">
      <div className="space-y-4 mt-8">
        {data.map((entry) => {
          return (
            <div
              key={entry.address}
              className="bg-theme-light-200 px-10 h-[110px] rounded-3xl flex items-center font-heading"
            >
              <div className="flex justify-between items-center w-full ml-6">
                <NextLink href={`/user/${entry.address}`} className="truncate">
                  {entry.address}
                </NextLink>

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Sales</div>
                  <div>{formatNumber(entry.numSales)}</div>
                </div>

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Volume</div>
                  <div>
                    <EthPrice label={`${entry.volume ? nFormatter(entry.volume) : '-'}`} />
                  </div>
                </div>

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Buys</div>
                  <div>{entry.numBuys ? formatNumber(entry.numBuys) : '-'}</div>
                </div>

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Stake Level</div>
                  <div>{entry.stakeLevel}</div>
                </div>

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Tickets</div>
                  <div>{formatNumber(entry.tickets)}</div>
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
