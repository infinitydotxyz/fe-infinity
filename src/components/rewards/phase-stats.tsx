import { RewardPhaseDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { round } from '@infinityxyz/lib-frontend/utils';
import { NFT_TOTAL_SUPPLY } from 'src/utils';
import { InfoBox } from './info-box';
import { RewardsProgressBar } from './progressbar';

export const getPhaseTradingRewardsPercent = (phase: RewardPhaseDto | null) => {
  return `${round((100 * (phase?.TRADING_FEE?.rewardSupply ?? 0)) / NFT_TOTAL_SUPPLY, 2)}%`;
};

export const RewardPhaseStats = ({ phase }: { phase: RewardPhaseDto }) => {
  return (
    <>
      {phase?.TRADING_FEE && (
        <>
          <InfoBox.Stat
            label="Progress"
            value={
              <RewardsProgressBar
                amount={phase.TRADING_FEE.rewardSupplyUsed ?? 0}
                max={phase?.TRADING_FEE.rewardSupply ?? 0}
              />
            }
          />
          <InfoBox.Stat label="Trading Rewards" value={getPhaseTradingRewardsPercent(phase)} />
          <InfoBox.Stat
            label="$ / $NFT ratio"
            value={`${phase.TRADING_FEE.rewardRateNumerator ?? 0} / ${phase.TRADING_FEE.rewardRateDenominator ?? 0}`}
          />
        </>
      )}
      {phase?.NFT_REWARD && (
        <InfoBox.Stat label="Free Infinity NFT Mint" value={`+${phase.NFT_REWARD.rewardRateDenominator} ETH`} />
      )}
    </>
  );
};
