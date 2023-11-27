import { Leaderboard, LeaderboardQuery } from './leaderboard';
import { ADropdown } from '../astra/astra-dropdown';
import { useState } from 'react';

interface Props {
  showCount?: number;
}

const OrderByValueToName: Record<LeaderboardQuery['orderBy'], string> = {
  total: 'Total',
  referrals: 'Referral points',
  buys: 'Buy points',
  listings: 'Listing points'
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
    <div className="space-y-4 mt-5 md:mt-6 px-5 pb-6 mb-16">
      <div className="flex space-x-2.5 justify-between md:justify-start align-center md:space-x-2.5">
        <div className="text-22 font-semibold dark:text-white ">Leaderboard</div>
        <ADropdown
          label={OrderByValueToName[orderBy]}
          innerClassName="w-24"
          menuParentButtonClassName="px-2.5 py-1 rounded border-gray-300 dark:border-neutral-200"
          items={Object.keys(OrderByValueToName).map((option) => ({
            label: OrderByValueToName[option as LeaderboardQuery['orderBy']],
            onClick: () => setOrderBy(option as LeaderboardQuery['orderBy'])
          }))}
        />
      </div>
      <div className="flex space-x-4 justify-between mt-5">
        <Leaderboard orderBy={orderBy} />
      </div>
    </div>
  );
};

export default GlobalRewards;
