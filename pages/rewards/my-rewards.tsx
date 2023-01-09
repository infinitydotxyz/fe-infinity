import { DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { UserCumulativeRewardsDto } from '@infinityxyz/lib-frontend/types/dto';
import { round } from '@infinityxyz/lib-frontend/utils';
import React, { useState } from 'react';
import { Button, Spacer, toastInfo, toastSuccess } from 'src/components/common';
import { StakeTokensModal } from 'src/components/rewards/stake-tokens-modal';
import { UnstakeTokensModal } from 'src/components/rewards/unstake-tokens-modal';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useUserRewards } from 'src/hooks/api/useUserRewards';
import { useClaim } from 'src/hooks/contract/cm-distributor/claim';
import { ellipsisAddress, nFormatter } from 'src/utils';
import { TOKEN } from 'src/utils/constants';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { bgColor, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface RewardsSectionProps {
  title: string;
  subTitle?: string;
  sideInfo?: React.ReactNode;
  children?: React.ReactNode;
}

const RewardsSection = (props: RewardsSectionProps) => {
  return (
    <div className={twMerge(secondaryBgColor, 'flex-col px-10 rounded-2xl w-full')}>
      <div className="flex w-full">
        <div className="w-1/2">
          <div className="text-4xl font-body font-medium">{props.title}</div>
          {props.subTitle && <div className="w-1/2 mt-5">{props.subTitle}</div>}
        </div>
        {props?.sideInfo && <div className="w-1/2">{props.sideInfo}</div>}
      </div>
      {props.children && <div className="flex w-full mt-5">{props.children}</div>}
    </div>
  );
};

const MyRewardsPage = () => {
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);
  const { result: quota, mutate: mutateQuota } = useUserCurationQuota();
  const { result: userRewards } = useUserRewards();
  const { claim } = useClaim();
  const { waitForTransaction } = useOnboardContext();

  const onClaim = async (type: DistributionType, props?: UserCumulativeRewardsDto) => {
    if (!props || !props.claimableWei || props.claimableWei === '0') {
      throw new Error('Nothing to claim');
    }

    const { hash } = await claim({
      type,
      account: props.account,
      cumulativeAmount: props.cumulativeAmount,
      merkleRoot: props.merkleRoot,
      merkleProof: props.merkleProof,
      contractAddress: props.contractAddress
    });
    toastSuccess('Sent txn to chain for execution');
    waitForTransaction(hash, () => {
      toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
    });
  };

  return (
    <div className="space-y-10 mt-4">
      <RewardsSection title="Claim">
        <div className="flex flex-col md:!flex-row mt-4 w-full">
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-2xl grow')}>
            <div>ETH Earned</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.curation.totalRewardsEth ?? 0, 2))}
                </div>
                <div className="text-sm mt-1">Total</div>
              </div>
              <Spacer />

              <div className="lg:w-1/4 ">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.curation.claim.claimableEth ?? 0, 2))}
                </div>
                <div className="text-sm mt-1">Claimable</div>
              </div>
              <Spacer />

              <div className="lg:w-1/4">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.curation.claim.claimedEth ?? 0, 2))}
                </div>
                <div className="text-sm mt-1">Claimed</div>
              </div>
              <Spacer />
            </div>
            <div className="w-full flex mt-4 items-center flex-wrap">
              <Button
                size="large"
                onClick={() => {
                  onClaim(DistributionType.ETH, userRewards?.totals?.curation?.claim);
                }}
                disabled={
                  !userRewards?.totals?.curation?.claim || userRewards?.totals?.curation?.claim?.claimableWei === '0'
                }
              >
                Claim ETH
              </Button>
            </div>
          </div>

          <Spacer />

          <div className={twMerge(bgColor, 'py-4 px-6 rounded-2xl grow mt-4 md:mt-0')}>
            <div>${TOKEN.symbol} earned</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.tradingRefund.rewards ?? 0), 2)}
                </div>
                <div className="text-sm mt-1"></div>
                <div className="text-sm mt-1">Total</div>
              </div>

              <Spacer />

              <div className="lg:w-1/4">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.tradingRefund.claim.claimableEth ?? 0, 2))}
                </div>
                <div className="text-sm mt-1">Claimable</div>
              </div>
              <Spacer />

              <div className="lg:w-1/4">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.tradingRefund.claim.claimedEth ?? 0, 2))}
                </div>
                <div className="text-sm mt-1">Claimed</div>
              </div>
              <Spacer />
            </div>
            <div className="w-full flex mt-4 items-center flex-wrap">
              <Button
                size="large"
                onClick={() => {
                  onClaim(DistributionType.INFT, userRewards?.totals?.tradingRefund?.claim);
                }}
                disabled={
                  !userRewards?.totals?.tradingRefund?.claim ||
                  userRewards?.totals?.tradingRefund?.claim?.claimableWei === '0'
                }
              >
                {`Claim $${TOKEN.symbol}`}
              </Button>
            </div>
          </div>
        </div>
      </RewardsSection>

      {/* Token Balance */}
      <RewardsSection
        title="Token Balance"
        subTitle={`Stake ${TOKEN.symbol} tokens to gain curation power. The longer you lock, the more curation power you'll earn.`}
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-2xl')}>
            <div>${TOKEN.symbol} tokens</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(round(quota?.tokenBalance || 0, 2))}</div>
                <div className="text-sm mt-1">Wallet</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(round(quota?.totalStaked || 0, 0))}</div>
                <div className="text-sm mt-1">Staked</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
            <div className="w-full flex mt-4 items-center flex-wrap">
              <Button size="large" onClick={() => setShowStakeTokensModal(true)}>
                Stake
              </Button>

              <Button size="large" variant="outline" className="ml-3" onClick={() => setShowUnstakeTokensModal(true)}>
                Unstake
              </Button>
            </div>
          </div>
        }
      ></RewardsSection>

      <RewardsSection
        title="Curation Rewards"
        subTitle="Earn curation rewards for voting on collections with your votes. You'll gain a portion of the transaction fees for each collection you curate."
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-2xl')}>
            <div>Voting power</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake?.stakePower || 0)}</div>
                <div className="text-sm mt-1">Total</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake.totalCuratedVotes || 0)}</div>
                <div className="text-sm mt-1">Used</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1">Remaining</div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

      {/* --- Trading Rewards --- */}

      <RewardsSection
        title="Trading Rewards"
        subTitle="Earn trading rewards for buying and selling NFTs on Infinity. Rewards are distributed once per week."
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-2xl')}>
            <div className="flex flex-wrap">
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Volume traded</div>
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals.tradingRefund.volume ?? 0, 4))}
                </div>
                <div className="text-sm mt-1">ETH</div>
              </div>
              <Spacer />
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Buys</div>
                <div className="text-2xl font-heading font-bold">{userRewards?.totals.tradingRefund.buys ?? 0}</div>
                <div className="text-sm mt-1">NFTs</div>
              </div>
              <Spacer />
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Sells</div>
                <div className="text-2xl font-heading font-bold">{userRewards?.totals.tradingRefund.sells ?? 0}</div>
                <div className="text-sm mt-1">NFTs</div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

      {/* <RewardsSection
        title="Referral Rewards"
        subTitle="Refer users to collections or assets, and receive a portion of the sales fees if the referral results in a purchase."
        sideInfo={
          <div className="py-4 px-6 rounded-2xl">
            <div className="flex flex-wrap">
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Referrals</div>
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals?.referrals?.numReferrals ?? 0, 4))}
                </div>
                <div className="text-sm mt-1">Total</div>
              </div>
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Referral rewards</div>
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(round(userRewards?.totals?.referrals?.totalRewardsEth ?? 0, 4))}
                </div>
                <div className="text-sm mt-1">ETH</div>
              </div>
            </div>
          </div>
        }
      ></RewardsSection> */}

      {showStakeTokensModal && (
        <StakeTokensModal
          onClose={() => {
            setShowStakeTokensModal(false);
            mutateQuota();
          }}
        />
      )}
      {showUnstakeTokensModal && <UnstakeTokensModal onClose={() => setShowUnstakeTokensModal(false)} />}
    </div>
  );
};

export default MyRewardsPage;
