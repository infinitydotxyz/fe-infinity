import { useEffect, useState } from 'react';
import { BidStats } from 'src/components/analytics/bid-stats';
import { BuyStats } from 'src/components/analytics/buy-stats';
import { ListingStats } from 'src/components/analytics/listing-stats';
import { AvFooter } from 'src/components/astra/astra-footer';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import { useOrderRewardDataSets } from 'src/hooks/api/useOrderRewardDataSets';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

type Tabs = 'Buys' | 'Listings' | 'Bids';
const tabs = ['Buys', 'Listings', 'Bids'] as Tabs[];

const AnalyticsPage = () => {
  const [selected, setSelected] = useState<Tabs>(tabs[0]);

  const {
    userAvailable: userOrderStatsAvailable,
    userAggregated: userOrderStats,
    aggregated: orderStats
  } = useOrderRewardDataSets();

  // prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return (
    <APageBox footer={<AvFooter />} title="Analytics">
      <ToggleTab
        className="font-heading pointer-events-auto"
        options={tabs as unknown as string[]}
        defaultOption={tabs[0]}
        onChange={setSelected as unknown as (selection: string) => void}
      />
      <div className={twMerge(textColor, 'flex  flex-col  w-full overflow-x-hidden overflow-auto mt-6 px-5')}>
        {isClient && selected === 'Buys' && <BuyStats />}
        {isClient && selected === 'Listings' && (
          <ListingStats stats={orderStats} userStats={userOrderStats} showUserStats={userOrderStatsAvailable} />
        )}
        {isClient && selected === 'Bids' && (
          <BidStats stats={orderStats} userStats={userOrderStats} showUserStats={userOrderStatsAvailable} />
        )}
      </div>
    </APageBox>
  );
};

export default AnalyticsPage;
