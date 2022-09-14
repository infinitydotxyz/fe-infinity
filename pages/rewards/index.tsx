import { useRouter } from 'next/router';
import React from 'react';
import { PageBox, ToggleTab, useToggleTab } from 'src/components/common';
// import GlobalRewards from './global-rewards';
import MyRewardsPage from './my-rewards';

enum RewardTabs {
  MyRewards = 'My Rewards',
  GlobalRewards = 'Global Rewards'
}

// const tabs = [RewardTabs.MyRewards, RewardTabs.GlobalRewards];
const tabs = [RewardTabs.MyRewards];

const RewardsPage = () => {
  const router = useRouter();
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || tabs[0]);

  return (
    <PageBox title="Rewards" showTitle={false}>
      <ToggleTab
        className="font-heading pointer-events-auto"
        options={options}
        selected={selected}
        onChange={onChange}
      />
      <div className="mt-4">
        {selected === RewardTabs.MyRewards && <MyRewardsPage />}
        {/* {selected === RewardTabs.GlobalRewards && <GlobalRewards />} */}
      </div>
    </PageBox>
  );
};

export default RewardsPage;
