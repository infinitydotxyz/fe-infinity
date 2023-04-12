import { round } from '@infinityxyz/lib-frontend/utils';
import React, { useState } from 'react';
import { Button, Spacer } from 'src/components/common';
import { StakeTokensModal } from 'src/components/rewards/stake-tokens-modal';
import { UnstakeTokensModal } from 'src/components/rewards/unstake-tokens-modal';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { nFormatter } from 'src/utils';
import { FLOW_TOKEN } from 'src/utils/constants';
import { bgColor, secondaryBgColor, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface RewardsSectionProps {
  title: string;
  subTitle?: string;
  sideInfo?: React.ReactNode;
  children?: React.ReactNode;
}

const RewardsSection = (props: RewardsSectionProps) => {
  return (
    <div className={twMerge(secondaryBgColor, 'flex-col px-10 py-4 rounded-lg w-full')}>
      <div className="flex w-full">
        <div className="w-1/2">
          <div className="text-2xl font-medium underline">{props.title}</div>
          {props.subTitle && <div className="w-1/2 mt-5">{props.subTitle}</div>}
        </div>
        {props?.sideInfo && <div className="w-1/2">{props.sideInfo}</div>}
      </div>
      {props.children && <div className="flex w-full mt-5">{props.children}</div>}
    </div>
  );
};

const MyRewards = () => {
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);
  const { result: quota, mutate: mutateQuota } = useUserCurationQuota();
  // const { result: userRewards } = useUserRewards();
  const [referralLink] = useState('');
  // const { claim } = useClaim();
  // const { setTxnHash } = useAppContext();

  // const onClaim = async (type: DistributionType, props?: UserCumulativeRewardsDto) => {
  //   if (!props || !props.claimableWei || props.claimableWei === '0') {
  //     throw new Error('Nothing to claim');
  //   }

  //   const { hash } = await claim({
  //     type,
  //     account: props.account,
  //     cumulativeAmount: props.cumulativeAmount,
  //     merkleRoot: props.merkleRoot,
  //     merkleProof: props.merkleProof,
  //     contractAddress: props.contractAddress
  //   });
  //   toastSuccess('Sent txn to chain for execution');
  //   setTxnHash(hash);
  // };

  return (
    <div className="space-y-10 mt-6 pb-6 mb-16">
      {/* <RewardsSection title="Claim">
        <div className="flex flex-col md:!flex-row mt-4 w-full">
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg grow')}>
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

          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg grow mt-4 md:mt-0')}>
            <div>${INFT_TOKEN.symbol} earned</div>
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
                {`Claim $${INFT_TOKEN.symbol}`}
              </Button>
            </div>
          </div>
        </div>
      </RewardsSection> */}

      <RewardsSection
        title="Token Balance"
        subTitle={`Stake ${FLOW_TOKEN.symbol} tokens to boost rewards. The more tokens you stake, higher the reward boost.`}
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>${FLOW_TOKEN.symbol}</div>
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
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(round(quota?.totalStaked || 0, 0))}</div>
                <div className="text-sm mt-1">Stake boost</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
            <div className="w-full flex mt-4 items-center flex-wrap">
              <Button size="large" onClick={() => setShowStakeTokensModal(true)}>
                Stake
              </Button>

              <Button
                disabled
                size="large"
                variant="outline"
                className="ml-3"
                onClick={() => setShowUnstakeTokensModal(true)}
              >
                Unstake
              </Button>
              <div className={twMerge(secondaryTextColor, 'ml-2 text-xs')}>
                Unstake available at block 17778462 (roughly Aug 1 2023)
              </div>
            </div>
          </div>
        }
      ></RewardsSection>

      <RewardsSection
        title="Referral Rewards"
        subTitle={`Refer users to Flow, and earn $${FLOW_TOKEN.symbol} when users join. The more users you refer, the more you earn. 
          Referrals will also increase your reward boost. \n
          Your referral link: ${referralLink}`}
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>Earned</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake?.stakePower || 0)}</div>
                <div className="text-sm mt-1">${FLOW_TOKEN.symbol}</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1"># Referrals</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1">Referral boost</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

      <RewardsSection
        title="Bid Rewards"
        subTitle="Earn bid rewards for placing collection and per NFT bids. Only bids closer to floor and the last sale price of the NFT are rewarded."
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>Earned</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake?.stakePower || 0)}</div>
                <div className="text-sm mt-1">${FLOW_TOKEN.symbol}</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake.totalCuratedVotes || 0)}</div>
                <div className="text-sm mt-1">WETH bid vol</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1"># Bids</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1">Effective boost</div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

      <RewardsSection
        title="Buy Rewards"
        subTitle="Earn buy rewards for every purchase you make on the platform. "
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>Earned</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake?.stakePower || 0)}</div>
                <div className="text-sm mt-1">${FLOW_TOKEN.symbol}</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake.totalCuratedVotes || 0)}</div>
                <div className="text-sm mt-1">WETH buy vol</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1"># Buys</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1">Effective boost</div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

      <RewardsSection
        title="Creator Rewards"
        subTitle="Creators of whitelisted collections earn rewards on every purchase of the collection's NFTs on Flow."
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>Earned</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake?.stakePower || 0)}</div>
                <div className="text-sm mt-1">${FLOW_TOKEN.symbol}</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.stake.totalCuratedVotes || 0)}</div>
                <div className="text-sm mt-1">WETH buy vol</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(quota?.availableVotes ?? 0)}</div>
                <div className="text-sm mt-1"># Buys</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

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

export default MyRewards;
