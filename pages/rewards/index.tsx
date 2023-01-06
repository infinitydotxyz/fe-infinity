import { useRouter } from 'next/router';
import React from 'react';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab, useToggleTab } from 'src/components/common';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import GlobalRewards from './global-rewards';
import MyRewardsPage from './my-rewards';

enum RewardTabs {
  MyRewards = 'My Rewards',
  GlobalRewards = 'Global Rewards'
}

const tabs = [RewardTabs.MyRewards, RewardTabs.GlobalRewards];

const RewardsPage = () => {
  const router = useRouter();
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || tabs[0]);

  return (
    <APageBox title="Rewards">
      <ToggleTab
        className="font-heading pointer-events-auto"
        options={options}
        selected={selected}
        onChange={onChange}
      />
      <div className={twMerge(textColor, 'flex flex-col h-full w-full overflow-y-auto overflow-x-hidden')}>
        {selected === RewardTabs.MyRewards && <MyRewardsPage />}
        {selected === RewardTabs.GlobalRewards && <GlobalRewards />}
      </div>
    </APageBox>
  );
};

export default RewardsPage;
