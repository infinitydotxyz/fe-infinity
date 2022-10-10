import React from 'react';
import { TokenomicsConfigDto, TokenomicsPhaseDto } from '@infinityxyz/lib-frontend/types/dto';
import { TradingFeeDestination } from '@infinityxyz/lib-frontend/types/dto/rewards/tokenomics-phase.dto';
import { Spinner, TooltipWrapper } from 'src/components/common';
import { DistributionBar } from 'src/components/common/distribution-bar';
import { InfoBox } from 'src/components/rewards/info-box';
import { RewardPhase } from 'src/components/rewards/reward-phase';
import useScreenSize from 'src/hooks/useScreenSize';
import { useFetch } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { State } from 'src/utils/state';
import { ProgressBar } from 'src/components/common/progress-bar';

type GRAND_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-grand`;
type PHASE_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-phase`;
const GRAND_RAFFLE: GRAND_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-grand`;
const PHASE_RAFFLE: PHASE_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-phase`;

const configByTradingFeeDestination: Record<
  TradingFeeDestination | GRAND_RAFFLE_TYPE | PHASE_RAFFLE_TYPE,
  { name: string; color: string }
> = {
  [TradingFeeDestination.Treasury]: {
    name: 'Treasury',
    color: 'bg-red-300'
  },
  [GRAND_RAFFLE]: { name: 'User Grand Raffle', color: 'bg-green-300' },
  [PHASE_RAFFLE]: { name: 'User Phase Raffle', color: 'bg-orange-300' },
  [TradingFeeDestination.CollectionPot]: { name: 'Collection Pot', color: 'bg-blue-300' },
  [TradingFeeDestination.Curators]: { name: 'Curation', color: 'bg-gray-300' },
  RAFFLE: {
    name: 'User Raffle',
    color: 'bg-green-300'
  }
};

function getPhaseSplitDistributions(phase: TokenomicsPhaseDto) {
  const splitsToDisplay = Object.keys(phase.split).filter(
    (key) => phase.split[key as TradingFeeDestination].percentage > 0
  );

  const configs = splitsToDisplay.flatMap((key) => {
    const item = phase.split[key as TradingFeeDestination];
    const config = configByTradingFeeDestination[key as TradingFeeDestination];
    if (key === TradingFeeDestination.Raffle) {
      const grandPrize = phase.raffleConfig?.grandPrize;
      const phasePrize = phase.raffleConfig?.phasePrize;
      const items: { percent: number; label: string; className: string }[] = [];
      if (grandPrize) {
        const config = configByTradingFeeDestination[GRAND_RAFFLE];
        items.push({
          percent: (item.percentage * grandPrize.percentage) / 100,
          label: config.name,
          className: config.color
        });
      }
      if (phasePrize) {
        const config = configByTradingFeeDestination[PHASE_RAFFLE];
        items.push({
          percent: (item.percentage * phasePrize.percentage) / 100,
          label: config.name,
          className: config.color
        });
      }

      return items;
    }

    return [
      {
        percent: item.percentage,
        label: config.name,
        className: config.color
      }
    ];
  });
  return configs.sort((a, b) => a.label.localeCompare(b.label));
}

const GlobalRewards: React.FC = () => {
  const { result, isLoading } = useFetch<TokenomicsConfigDto>('/rewards');
  const { isMobile } = useScreenSize();

  const renderTooltip = (props: {
    isHovered: boolean;
    children?: React.ReactNode;
    title?: string;
    message?: string;
  }) => {
    return (
      <TooltipWrapper
        className="w-fit min-w-[200px]"
        show={props.isHovered}
        tooltip={{
          title: props.title ?? '',
          content: props.message ?? ''
        }}
      >
        {props.children}
      </TooltipWrapper>
    );
  };

  return (
    <>
      {isLoading && <Spinner />}
      {result?.phases && result?.phases.length > 0
        ? result.phases.map((phase: TokenomicsPhaseDto) => {
            const state = phase.isActive ? State.Active : phase.progress === 100 ? State.Complete : State.Inactive;
            let message = '';
            switch (state) {
              case State.Active:
                message = `${phase.name} is currently active.`;
                break;
              case State.Inactive:
                message = `${phase.name} will become active once the previous phase has completed.`;
                break;
              case State.Complete:
                message = `${phase.name} has been completed.`;
                break;
            }
            return (
              <InfoBox
                key={phase.id}
                title={phase.name}
                state={state}
                renderTooltip={renderTooltip}
                tooltipMessage={message}
                tooltipTitle={state}
              >
                <div className={twMerge('flex align-center justify-center', isMobile ? 'flex-col' : '')}>
                  <InfoBox.SideInfo>
                    <InfoBox.Stats title="Trading Fee Distribution">
                      <>
                        <DistributionBar distribution={getPhaseSplitDistributions(phase)} />
                        <div className="w-full py-2">
                          <div className="text-sm mt-1 mb-2">Progress</div>
                          <div className="text-2xl font-heading font-bold">
                            <ProgressBar percentage={phase.progress} />
                          </div>
                        </div>
                      </>
                    </InfoBox.Stats>
                  </InfoBox.SideInfo>
                  <InfoBox.SideInfo>
                    <div className={isMobile ? '' : 'ml-6'}>
                      <RewardPhase key={phase.id} phase={phase} />
                    </div>
                  </InfoBox.SideInfo>
                </div>
              </InfoBox>
            );
          })
        : !isLoading && <div className="flex flex-col mt-10">Unable to load rewards.</div>}
    </>
  );
};

export default GlobalRewards;
