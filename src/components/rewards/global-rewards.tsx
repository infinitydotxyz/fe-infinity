import { twMerge } from 'tailwind-merge';
import { Leaderboard, LeaderboardQuery } from './leaderboard';
import { ADropdown } from '../astra/astra-dropdown';
import { useState } from 'react';

interface Props {
  showCount?: number;
}

const OrderByValueToName: Record<LeaderboardQuery['orderBy'], string> = {
  total: 'Total',
  referrals: 'Referral Points',
  buys: 'Buy Points'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GlobalRewards = ({ showCount }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [orderBy, setOrderBy] = useState<LeaderboardQuery['orderBy']>('total');

  // const { result, isLoading, isError } = useFetch<TokenomicsConfigDto>('/pixl/rewards/leaderboard');

  // if (isLoading) {
  //   return (
  //     <CenteredContent>
  //       <BouncingLogo />
  //     </CenteredContent>
  //   );
  // }

  // if (isError) {
  //   return <div className="flex flex-col mt-10">An error occurred while loading rewards</div>;
  // }
  //

  const [orderBy, setOrderBy] = useState<LeaderboardQuery['orderBy']>('total');

  return (
    <div className={twMerge('space-y-4 mt-6 pb-6 mb-16')}>
      <div>
        <div className="text-2xl font-medium">Leaderboard</div>
        <ADropdown
          label={OrderByValueToName[orderBy]}
          innerClassName="w-30"
          items={Object.keys(OrderByValueToName).map((option) => ({
            label: OrderByValueToName[option as LeaderboardQuery['orderBy']],
            onClick: () => setOrderBy(option as LeaderboardQuery['orderBy'])
          }))}
        />
      </div>
      <div className="flex space-x-4 justify-between">
        <Leaderboard orderBy={orderBy} />
        {/* <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Buy Rewards</div>
          <div>9M ${FLOW_TOKEN.symbol} per day.</div>
          <div>
            All NFT purchases earn rewards. The more you buy, the more you earn. Rewards are distributed proportionally
            to all buyers each day.
          </div>
          {/* <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName={`bg-[#FA8147]`} /> */}
      </div>

      {/* <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Listing Rewards</div>
          <div>1M ${FLOW_TOKEN.symbol} per day.</div>
          <div>
            Listings close to a collection's floor or to the NFT's last sale price earn more tokens. Rewards are
            distributed each day.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#7d81f6]" />
        </div> */}

      {/* <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Referral Rewards</div>
          <div>200M ${FLOW_TOKEN.symbol} until supply runs out.</div>
          <div>
            There's a fixed supply of referral rewards. Will be discontinued once the product is made public. See{' '}
            <ExternalLink href="https://docs.pixl.so/referrals" className="underline">
              docs
            </ExternalLink>{' '}
            for details.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#4899f1]" />
        </div>

        <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Airdrop</div>
          <div>800M ${FLOW_TOKEN.symbol} total.</div>
          <div>
            Airdrop is based on past trading activity. Cumulative buy volumes more than 9000 USDC in the last 6 months
            on OS and Blur are eligible. Earn it by referring 2 friends to Pixl via your referral link.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#66d981]" />
        </div> */}

      {/* <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Creator Rewards</div>
          <div>100k ${FLOW_TOKEN.symbol} per day</div>
          <div>
            Whitelisted collections (currently less than 5) earn rewards for their creators. Ping us on{' '}
            <ExternalLink href="https://discord.gg/pixlso" className="underline">
              discord
            </ExternalLink>{' '}
            to get whitelisted.
          </div>
        </div> */}
      {/* </div> */}
      {/* <CenteredContent>Leaderboards coming soon.</CenteredContent> */}
    </div>
  );
};

export default GlobalRewards;
