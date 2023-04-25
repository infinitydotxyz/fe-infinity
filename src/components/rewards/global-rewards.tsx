import { TokenomicsConfigDto } from '@infinityxyz/lib-frontend/types/dto';
import { BouncingLogo, CenterFixed, CenteredContent, ExternalLink } from 'src/components/common';
import { ProgressBar } from 'src/components/common/progress-bar';
import { FLOW_TOKEN, useFetch } from 'src/utils';
import { bgColor, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

// type GRAND_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-grand`;
// type PHASE_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-phase`;
// const GRAND_RAFFLE: GRAND_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-grand`;
// const PHASE_RAFFLE: PHASE_RAFFLE_TYPE = `${TradingFeeDestination.Raffle}-phase`;

// const configByTradingFeeDestination: Record<
//   TradingFeeDestination | GRAND_RAFFLE_TYPE | PHASE_RAFFLE_TYPE,
//   { name: string; color: string }
// > = {
//   [TradingFeeDestination.Treasury]: {
//     name: 'Treasury',
//     color: 'bg-red-300'
//   },
//   [GRAND_RAFFLE]: { name: 'User Grand Raffle', color: 'bg-green-300' },
//   [PHASE_RAFFLE]: { name: 'User Phase Raffle', color: 'bg-orange-300' },
//   [TradingFeeDestination.CollectionPot]: { name: 'Collection Pot', color: 'bg-blue-300' },
//   [TradingFeeDestination.Curators]: { name: 'Curation', color: 'bg-red-300' },
//   RAFFLE: {
//     name: 'User Raffle',
//     color: 'bg-green-300'
//   }
// };

export const roundToNearest = (num: number, nearest: number) => {
  return Math.round(num / nearest) * nearest;
};

// function getPhaseSplitDistributions(phase: TokenomicsPhaseDto, phaseTotalFees: number) {
//   const splitsToDisplay = Object.keys(phase.split).filter(
//     (key) => phase.split[key as TradingFeeDestination].percentage > 0
//   );

//   const getValue = (percent: number) => {
//     if (!Number.isFinite(phaseTotalFees) || Number.isNaN(phaseTotalFees)) {
//       return '';
//     }
//     const value = (percent / 100) * phaseTotalFees;
//     return `${nFormatter(value)} USD`;
//   };

//   const configs = splitsToDisplay.flatMap((key) => {
//     const item = phase.split[key as TradingFeeDestination];
//     const config = configByTradingFeeDestination[key as TradingFeeDestination];
//     if (key === TradingFeeDestination.Raffle) {
//       const grandPrize = phase.raffleConfig?.grandPrize;
//       const phasePrize = phase.raffleConfig?.phasePrize;
//       const items: { percent: number; label: string; className: string; value: string }[] = [];
//       if (grandPrize) {
//         const config = configByTradingFeeDestination[GRAND_RAFFLE];
//         const percent = (item.percentage * grandPrize.percentage) / 100;
//         items.push({
//           percent,
//           value: getValue(percent),
//           label: config.name,
//           className: config.color
//         });
//       }
//       if (phasePrize) {
//         const config = configByTradingFeeDestination[PHASE_RAFFLE];
//         const percent = (item.percentage * phasePrize.percentage) / 100;
//         items.push({
//           percent,
//           value: getValue(percent),
//           label: config.name,
//           className: config.color
//         });
//       }

//       return items;
//     }

//     return [
//       {
//         value: getValue(item.percentage),
//         percent: item.percentage,
//         label: config.name,
//         className: config.color
//       }
//     ];
//   });
//   return configs.sort((a, b) => a.label.localeCompare(b.label));
// }

interface Props {
  showCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GlobalRewards = ({ showCount }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { result, isLoading, isError } = useFetch<TokenomicsConfigDto>('/rewards');

  if (isLoading) {
    return (
      <CenteredContent>
        <BouncingLogo />
      </CenteredContent>
    );
  }

  if (isError) {
    return <div className="flex flex-col mt-10">An error occurred while loading rewards</div>;
  }

  return <CenterFixed>Soon</CenterFixed>;

  return (
    <div className={twMerge('space-y-4 mt-6 pb-6 mb-16')}>
      <div className="flex space-x-4 justify-between">
        <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Buy Rewards</div>
          <div>9M ${FLOW_TOKEN.symbol} per day.</div>
          <div>
            All purchases earn rewards. The more you buy, the more you earn. Rewards are distributed proportionally to
            all buyers each day.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName={`bg-[#FA8147]`} />
        </div>

        <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Listing Rewards</div>
          <div>1M ${FLOW_TOKEN.symbol} per day.</div>
          <div>
            Listings close to a collection's floor or to the NFT's last sale price earn more tokens. Rewards are
            distributed each day.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#7d81f6]" />
        </div>

        <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Referral Rewards</div>
          <div>200M ${FLOW_TOKEN.symbol} until supply runs out.</div>
          <div>
            There's a fixed suppky of referral rewards. So the earliest referrers get the highest rewards. See{' '}
            <ExternalLink href="https://docs.flow.so/referrals" className="underline">
              docs
            </ExternalLink>{' '}
            for details.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#4899f1]" />
        </div>

        <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Airdrop</div>
          <div>500M ${FLOW_TOKEN.symbol} total.</div>
          <div>
            Airdrop is based on past trading activity. Earn it by referring 2 people to Flow or by listing 2 supported
            NFTs at or below their market price.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#66d981]" />
        </div>

        {/* <div className={twMerge(secondaryBgColor, 'flex-1 rounded-lg px-10 py-4 space-y-3')}>
          <div className="text-2xl font-medium underline">Creator Rewards</div>
          <div>100k ${FLOW_TOKEN.symbol} per day</div>
          <div>
            Whitelisted collections (currently less than 5) earn rewards for their creators. Ping us on{' '}
            <ExternalLink href="https://discord.gg/flowdotso" className="underline">
              discord
            </ExternalLink>{' '}
            to get whitelisted.
          </div>
          <ProgressBar percentage={25} total={100} className={bgColor} fillerClassName="bg-[#66d981]" />
        </div> */}
      </div>
    </div>
  );

  // const renderTooltip = (props: {
  //   isHovered: boolean;
  //   children?: React.ReactNode;
  //   title?: string;
  //   message?: string;
  // }) => {
  //   return (
  //     <TooltipWrapper
  //       className="w-fit min-w-[200px]"
  //       show={props.isHovered}
  //       tooltip={{
  //         title: props.title ?? '',
  //         content: props.message ?? ''
  //       }}
  //     >
  //       {props.children}
  //     </TooltipWrapper>
  //   );
  // };

  // if (result?.phases && result?.phases.length > 0) {
  //   return (
  //     <div className="space-y-4">
  //       {result.phases.map((phase: TokenomicsPhaseDto, index) => {
  //         if (showCount && index >= showCount) {
  //           return;
  //         }

  //         const phaseTotalFeesUSD =
  //           ((phase.tradingFeeRefund?.rewardSupply ?? 0) * (phase.tradingFeeRefund?.rewardRateDenominator ?? 0)) /
  //           (phase.tradingFeeRefund?.rewardRateNumerator ?? 1);

  //         const state = phase.isActive ? State.Active : phase.progress === 100 ? State.Complete : State.Inactive;
  //         let message = '';
  //         switch (state) {
  //           case State.Active:
  //             message = `${phase.name} is currently active.`;
  //             break;
  //           case State.Inactive:
  //             message = `${phase.name} will become active once the previous phase has completed.`;
  //             break;
  //           case State.Complete:
  //             message = `${phase.name} has been completed.`;
  //             break;
  //         }
  //         return (
  //           <InfoBox
  //             key={phase.id}
  //             title={phase.name}
  //             state={state}
  //             renderTooltip={renderTooltip}
  //             tooltipMessage={message}
  //             tooltipTitle={state}
  //           >
  //             <div className={twMerge('flex align-center justify-center', isMobile ? 'flex-col' : '')}>
  //               <InfoBox.SideInfo>
  //                 <InfoBox.Stats title="Trading Fee Distribution" description={`Trading Fee: 2.5%`}>
  //                   <>
  //                     <DistributionBar distribution={getPhaseSplitDistributions(phase, phaseTotalFeesUSD)} />
  //                     <div className="w-full py-2">
  //                       <div className="text-sm mt-1 mb-2">Progress</div>
  //                       <div className="text-2xl font-heading font-bold">
  //                         <ProgressBar percentage={phase.progress} total={`${nFormatter(phaseTotalFeesUSD)} USD`} />
  //                       </div>
  //                     </div>
  //                   </>
  //                 </InfoBox.Stats>
  //               </InfoBox.SideInfo>
  //               <InfoBox.SideInfo>
  //                 <div className={isMobile ? '' : 'ml-6'}>
  //                   <RewardPhase key={phase.id} phase={phase} />
  //                 </div>
  //               </InfoBox.SideInfo>
  //             </div>
  //           </InfoBox>
  //         );
  //       })}
  //     </div>
  //   );
  // }

  return <div className="flex flex-col mt-10 text-sm">Unable to load rewards</div>;
};

export default GlobalRewards;
