import { useEffect, useState } from 'react';
import { AvFooter } from 'src/components/astra/astra-footer';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import MyRewards from 'src/components/rewards/my-rewards';

const RewardsPage = () => {
  const tabs = ['My Rewards'];
  const [selected, setSelected] = useState(tabs[0]);

  // prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return (
    <APageBox subTitle="Earn points from referrals" footer={<AvFooter />} title="Rewards" pageHeaderClassName="!py-7.5">
      <div>
        <ToggleTab
          className="font-heading pointer-events-auto"
          options={tabs}
          defaultOption={tabs[0]}
          onChange={setSelected}
          border={true}
        />
      </div>
      <div className="overflow-auto">
        {isClient && selected === 'My Rewards' && <MyRewards />}
        {/* {isClient && selected === 'Global Rewards' && <GlobalRewards />} */}
      </div>
    </APageBox>
  );
};

export default RewardsPage;
