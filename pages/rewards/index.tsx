import { useEffect, useState } from 'react';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import GlobalRewards from 'src/components/rewards/global-rewards';
import MyRewards from 'src/components/rewards/my-rewards';

const RewardsPage = () => {
  const tabs = ['My Rewards', 'Global Rewards'];
  const [selected, setSelected] = useState(tabs[0]);

  // prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return (
    <APageBox subTitle="Earn points from referrals" title="Rewards" pageHeaderClassName="!py-7.5">
      <ToggleTab
        className="font-heading pointer-events-auto"
        options={tabs}
        defaultOption={tabs[0]}
        onChange={setSelected}
        border={true}
      />
      {isClient && selected === 'My Rewards' && <MyRewards />}
      {isClient && selected === 'Global Rewards' && <GlobalRewards />}
    </APageBox>
  );
};

export default RewardsPage;
