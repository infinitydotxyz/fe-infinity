import { useEffect, useState } from 'react';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { APageBox } from 'src/components/astra/astra-page-box';
import { ToggleTab } from 'src/components/common';
import GlobalRewards from 'src/components/rewards/global-rewards';
import MyRewards from 'src/components/rewards/my-rewards';
import useScreenSize from 'src/hooks/useScreenSize';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const RewardsPage = () => {
  const tabs = ['My Rewards', 'Global Rewards'];
  const { isDesktop } = useScreenSize();
  const [selected, setSelected] = useState(tabs[0]);

  // prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return (
    <APageBox title="Rewards">
      {isDesktop ? (
        <ToggleTab
          className="font-heading pointer-events-auto"
          options={tabs}
          defaultOption={tabs[0]}
          onChange={setSelected}
          border={true}
        />
      ) : (
        <ADropdown
          label={selected}
          innerClassName="w-30"
          items={tabs.map((option) => ({
            label: option,
            onClick: () => setSelected(option)
          }))}
        />
      )}
      <div
        className={twMerge(textColor, 'flex flex-col h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide')}
      >
        {isClient && selected === 'My Rewards' && <MyRewards />}
        {isClient && selected === 'Global Rewards' && <GlobalRewards />}
      </div>
    </APageBox>
  );
};

export default RewardsPage;
