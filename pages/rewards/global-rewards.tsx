import React from 'react';
import { TokenomicsConfigDto, TokenomicsPhaseDto } from '@infinityxyz/lib-frontend/types/dto';
import { TradingFeeDestination } from '@infinityxyz/lib-frontend/types/dto/rewards/tokenomics-phase.dto';
import { Spinner } from 'src/components/common';
import { DistributionBar } from 'src/components/common/distribution-bar';
import { InfoBox } from 'src/components/rewards/info-box';
import { RewardsProgressBar } from 'src/components/rewards/progressbar';
import { RewardPhase } from 'src/components/rewards/reward-phase';
import useScreenSize from 'src/hooks/useScreenSize';
import { useFetch } from 'src/utils';

const configByTradingFeeDestination: Record<TradingFeeDestination, { name: string; color: string }> = {
  [TradingFeeDestination.Treasury]: {
    name: 'Treasury',
    color: 'bg-red-300'
  },
  [TradingFeeDestination.Raffle]: { name: 'User Raffle', color: 'bg-green-300' },
  [TradingFeeDestination.CollectionPot]: { name: 'Collection Pot', color: 'bg-blue-300' },
  [TradingFeeDestination.Curators]: { name: 'Curation', color: 'bg-gray-300' }
};

function getPhaseSplitDistributions(phase: TokenomicsPhaseDto) {
  const splitsToDisplay = Object.keys(phase.split).filter(
    (key) => phase.split[key as TradingFeeDestination].percentage > 0
  );

  const configs = splitsToDisplay.map((key) => {
    const item = phase.split[key as TradingFeeDestination];
    const config = configByTradingFeeDestination[key as TradingFeeDestination];
    return {
      percent: item.percentage,
      label: config.name,
      className: config.color
    };
  });
  return configs.sort((a, b) => a.label.localeCompare(b.label));
}

const GlobalRewards: React.FC = () => {
  const { result, isLoading } = useFetch<TokenomicsConfigDto>('/rewards');
  const { isMobile } = useScreenSize();

  return (
    <>
      {isLoading && <Spinner />}
      {result?.phases && result?.phases.length > 0 ? (
        result.phases.map((phase: TokenomicsPhaseDto) => {
          return (
            <InfoBox
              key={phase.id}
              title={phase.name}
              description={
                <InfoBox.Stats title="Trading Fee Distribution">
                  <>
                    <DistributionBar distribution={getPhaseSplitDistributions(phase)} />
                    <div className="w-full py-2">
                      <div className="text-sm mt-1">Progress</div>
                      <div className="text-2xl font-heading font-bold">
                        <RewardsProgressBar
                          amount={
                            phase.progress !== 0 && phase.progress < 1 ? Math.ceil(phase.progress) : phase.progress
                          }
                          max={100}
                        />
                      </div>
                    </div>
                  </>
                </InfoBox.Stats>
              }
            >
              <InfoBox.SideInfo>
                <div className={isMobile ? '' : 'ml-6 flex justify-end mt-14'}>
                  <RewardPhase key={phase.id} phase={phase} />
                </div>
              </InfoBox.SideInfo>
            </InfoBox>
          );
        })
      ) : (
        <div className="flex flex-col mt-10">Unable to load rewards.</div>
      )}
    </>
  );
};

export default GlobalRewards;
