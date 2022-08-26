import { useRouter } from 'next/router';
import React from 'react';
import { PageBox, ToggleTab, useToggleTab } from 'src/components/common';
import { isProd } from 'src/utils'; // todo: adi remove isProd once curation is ready
import GlobalRewards from './global-rewards';
import MyRewardsPage from './my-rewards';
import { RewardTabs } from './types';

const tabs = [RewardTabs.MyRewards, RewardTabs.GlobalRewards];

const RewardsPage = () => {
  const router = useRouter();
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || tabs[0]);

  return (
    !isProd() && (
      <PageBox title="Rewards" showTitle={false}>
        <ToggleTab
          className="font-heading pointer-events-auto"
          options={options}
          selected={selected}
          onChange={onChange}
        />
        <div className="mt-2">
          {selected === RewardTabs.MyRewards && <MyRewardsPage />}
          {selected === RewardTabs.GlobalRewards && <GlobalRewards />}
        </div>
      </PageBox>
    )
  );
};

export default RewardsPage;
