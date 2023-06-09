import { useState } from 'react';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import GlobalRewards from 'src/components/rewards/global-rewards';
import MyRewards from 'src/components/rewards/my-rewards';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const RewardsPage = () => {
  const tabs = ['My Rewards'];
  const [selected, setSelected] = useState(tabs[0]);
  return (
    <APageBox title="Rewards">
      <ToggleTab
        className="font-heading pointer-events-auto"
        options={tabs}
        defaultOption={tabs[0]}
        onChange={setSelected}
      />
      <div
        className={twMerge(textColor, 'flex flex-col h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide')}
      >
        {selected === 'My Rewards' && <MyRewards />}
        {selected === 'Global Rewards' && <GlobalRewards />}
      </div>
    </APageBox>
  );
};

export default RewardsPage;
