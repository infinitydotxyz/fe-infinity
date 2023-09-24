import { useEffect, useState } from 'react';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { APageBox } from 'src/components/astra/astra-page-box';
import { Button, ToggleTab } from 'src/components/common';
import GlobalRewards from 'src/components/rewards/global-rewards';
import MyRewards from 'src/components/rewards/my-rewards';
import { useChain } from 'src/hooks/useChain';
import useScreenSize from 'src/hooks/useScreenSize';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const RewardsPage = () => {
  const { selectedChain, switchNetwork } = useChain();
  const tabs = ['My Rewards', 'Glboal Rewards'];
  const [selected, setSelected] = useState(tabs[0]);
  const [supportedChain, setSupportedChain] = useState(false);
  const { isDesktop } = useScreenSize();

  useEffect(() => {
    setSupportedChain(selectedChain === '1');
  }, [selectedChain, setSupportedChain]);


  // prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);


  if (!supportedChain) {
    return (
      <APageBox title="Rewards">
        <div className={twMerge(textColor, 'flex flex-col h-full')}>
          Rewards are only available on Ethereum Mainnet.
          <div className="flex flex-col h-full w-full align-center justify-center">
            <div className="m-auto">
              <Button
                onClick={() => {
                  switchNetwork({ chainId: 1 }).catch((err) => {
                    console.error('Failed to switch network', err);
                  });
                }}
              >
                Switch to Ethereum Mainnet
              </Button>
            </div>
          </div>
        </div>
      </APageBox>
    );
  }
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
