import { RewardProgram } from '@infinityxyz/lib-frontend/types/core';
import { RewardPhaseDto, TradingFeeRefundDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { numberFormatter } from 'src/utils/number-formatter';
import { InfoBox } from './info-box';
import { getPhaseTradingRewardsPercent, RewardPhaseStats } from './phase-stats';

export const PhaseDescription = ({ phase }: { phase: RewardPhaseDto }) => {
  const fee = phase[RewardProgram.TradingFee];
  const nft = phase[RewardProgram.NftReward];
  const curation = phase[RewardProgram.Curation];

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
        {fee && (
          <>
            <strong>{`${getPhaseTradingRewardsPercent(phase)}`}</strong> of the total supply (
            <strong>{`${numberFormatter.format(fee.rewardSupply)} tokens`}</strong>) are given out as trading rewards in
            the form of in the form of fee refunds. Every <strong>{`${fee.rewardRateNumerator}$`}</strong> in fees paid
            gets <strong>{`${fee.rewardRateDenominator} $NFT`}</strong> tokens. These are split between the seller (
            {`${fee.sellerPortion * 100}%`}) and buyer ({`${fee.buyerPortion * 100}%`}). So a trade that has a 1$ fee
            will reward the buyer with {`${getRewardSplit(fee, 1).buyer}`} $NFT tokens and the seller with{' '}
            {`${getRewardSplit(fee, 1).seller}`} $NFT tokens.{' '}
          </>
        )}
        {nft && (
          <>
            Buyers with greater than <strong>{`${nft.rewardRateDenominator}`} ETH volume</strong> will also get a{' '}
            <strong>free mint</strong> of the Infinity NFT.
          </>
        )}
        {curation && <>{!fee && <>Token emissions go to zero.</>} Curators earn ETH rewards.</>}
      </div>
    </>
  );
};

export const RewardPhase = ({ phase }: { phase: RewardPhaseDto }) => {
  return (
    <InfoBox.Stats title={phase.name} description={<PhaseDescription phase={phase} />}>
      <RewardPhaseStats phase={phase} />
    </InfoBox.Stats>
  );
};
