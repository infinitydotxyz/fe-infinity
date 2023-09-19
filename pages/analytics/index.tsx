import { useEffect, useState } from 'react';
import { BidStats } from 'src/components/analytics/bid-stats';
import { BuyStats } from 'src/components/analytics/buy-stats';
import { ListingStats } from 'src/components/analytics/listing-stats';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import { useOrderRewardDataSets } from 'src/hooks/api/useOrderRewardDataSets';
import useScreenSize from 'src/hooks/useScreenSize';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

type Tabs = 'Buys' | 'Listings' | 'Bids';
const tabs = ['Buys', 'Listings', 'Bids'] as Tabs[];

const AnalyticsPage = () => {
  const { isDesktop } = useScreenSize();

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
    <APageBox title="Analytics">
      {isDesktop ? (
        <ToggleTab
          className="font-heading pointer-events-auto"
          options={tabs as unknown as string[]}
          defaultOption={tabs[0]}
          onChange={setSelected as unknown as (selection: string) => void}
          border={true}
        />
      ) : (
        <ADropdown
          label={selected}
          innerClassName="w-30"
          items={tabs.map((option) => ({
            label: option,
            onClick: () => setSelected(option as Tabs)
          }))}
        />
      )}
      <div
        className={twMerge(
          textColor,
          'flex flex-col h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide mt-6'
        )}
      >
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
