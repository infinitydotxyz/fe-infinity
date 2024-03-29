import { TokenomicsPhaseDto, TradingFeeRefundDto } from '@infinityxyz/lib-frontend/types/dto';
import { INFT_TOKEN } from 'src/utils';
import { numberFormatter } from 'src/utils/number-formatter';
import { InfoBox } from './info-box';
import { getPhaseTradingRewardsPercent, RewardPhaseStats } from './phase-stats';

export const PhaseDescription = ({ phase }: { phase: TokenomicsPhaseDto }) => {
  const getRewardSplit = (reward: TradingFeeRefundDto, fee: number) => {
    const totalReward = (fee * reward.rewardRateNumerator) / reward.rewardRateDenominator;
    const seller = Math.floor(totalReward * reward.sellerPortion);
    let buyer = Math.floor(totalReward * reward.buyerPortion);
    buyer = totalReward === seller + buyer ? buyer : totalReward - seller;

    return { seller, buyer, total: totalReward };
  };
  return (
    <>
      <div className="text-sm">
        {phase.tradingFeeRefund && (
          <p>
            <strong>{`${getPhaseTradingRewardsPercent(phase)}`}</strong> of the total supply (
            <strong>{`${numberFormatter.format(phase.tradingFeeRefund.rewardSupply)} tokens`}</strong>) are given out as
            trading rewards in the form of fee refunds. Every{' '}
            <strong>{`$${phase.tradingFeeRefund.rewardRateDenominator}`}</strong> in fees paid gets{' '}
            <strong>{`${phase.tradingFeeRefund.rewardRateNumerator} $${INFT_TOKEN.symbol}`}</strong> tokens. These are
            split between the seller ({`${phase.tradingFeeRefund.sellerPortion * 100}%`}) and buyer (
            {`${phase.tradingFeeRefund.buyerPortion * 100}%`}). So a trade that has a $10 fee will reward the buyer with{' '}
            {`${getRewardSplit(phase.tradingFeeRefund, 10).buyer}`} ${INFT_TOKEN.symbol} tokens and the seller with{' '}
            {`${getRewardSplit(phase.tradingFeeRefund, 10).seller}`} ${INFT_TOKEN.symbol} tokens.{' '}
          </p>
        )}
      </div>
    </>
  );
};

export const RewardPhase = ({ phase }: { phase: TokenomicsPhaseDto }) => {
  return (
    phase.tradingFeeRefund && (
      <InfoBox.Stats title="Trading Fee Refund (distributed weekly)" description={<PhaseDescription phase={phase} />}>
        <RewardPhaseStats phase={phase} />
      </InfoBox.Stats>
    )
  );
};
