import { useState } from 'react';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import GlobalRewards from './global-rewards';
import MyRewardsPage from './my-rewards';

const RewardsPage = () => {
  const tabs = ['My Rewards', 'Global Rewards'];
  const [selected, setSelected] = useState(tabs[0]);
  return (
    <APageBox title="Rewards">
      <ToggleTab
        className="font-heading pointer-events-auto"
        options={tabs}
        defaultOption={tabs[0]}
        onChange={setSelected}
      />
      <div className={twMerge(textColor, 'flex flex-col h-full w-full overflow-y-auto overflow-x-hidden')}>
        {selected === 'My Rewards' && <MyRewardsPage />}
        {selected === 'Global Rewards' && <GlobalRewards />}
      </div>
    </APageBox>
  );
};

export default RewardsPage;
