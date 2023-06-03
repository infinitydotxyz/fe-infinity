import React, { useEffect, useState } from 'react';
import { Button, CenteredContent, ConnectButton, EthSymbol, Spacer } from 'src/components/common';
import { StakeTokensModal } from 'src/components/rewards/stake-tokens-modal';
import { UnstakeTokensModal } from 'src/components/rewards/unstake-tokens-modal';
import { useUserRewards } from 'src/hooks/api/useUserRewards';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { nFormatter, useFetch } from 'src/utils';
import { FLOW_TOKEN } from 'src/utils/constants';
import { GlobalRewards } from 'src/utils/types';
import { bgColor, secondaryBgColor, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { UniswapModal } from '../common/uniswap-model';

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
  const NUM_DAILY_BUY_REWARDS = 9_000_000;

  const { chain } = useNetwork();
  const chainId = String(chain?.id);

  const [showBuyTokensModal, setShowBuyTokensModal] = useState(false);
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);
  const { address } = useAccount();
  const { result: userRewards } = useUserRewards();
  const { result: globalRewards } = useFetch<GlobalRewards>(`/rewards/global`);

  const numReferrals = userRewards?.totals.referrals.numReferrals ?? 0;
  const referralReward = userRewards?.totals.referrals.numTokens ?? 0;
  const referralRewardBoostNum = userRewards?.totals.referrals.referralRewardBoost ?? 0;
  const referralRewardBoost = referralRewardBoostNum + 'x';
  // const referralLink = userRewards?.totals.referrals.referralLink ?? '';

  const airdropReward = userRewards?.totals.airdrop.cumulative ?? 0;
  const airdropClaimStatus = userRewards?.totals.airdrop.isINFT || numReferrals >= 2 ? 'Earned' : 'Not earned';

  const { getUserStakeLevel, stakeBalance } = useStakerContract();
  const [xflStaked, setXflStaked] = useState(0);
  const [xflStakeBoost, setXflStakeBoost] = useState('1x');
  const [rewardBoost, setRewardBoost] = useState(1);

  const buyerLast24HrVol = userRewards?.totals.buyRewards.volLast24Hrs ?? 0;
  const buyerTotalVol = userRewards?.totals.buyRewards.volTotal ?? 0;
  const xflEarnedTotal = nFormatter(userRewards?.totals.buyRewards.earnedRewardsTotal ?? 0);

  const platformLast24HrVol = globalRewards?.last24HrsVolumeETH ?? 0;

  let xflEarnedLast24hrs;
  if (platformLast24HrVol !== 0) {
    const baseReward = (buyerLast24HrVol / platformLast24HrVol) * NUM_DAILY_BUY_REWARDS;
    xflEarnedLast24hrs = nFormatter(baseReward * rewardBoost);
  }
  xflEarnedLast24hrs = xflEarnedLast24hrs ?? 0;

  const xflBalanceObj = useBalance({
    address,
    token: FLOW_TOKEN.address as `0x${string}`,
    watch: false,
    cacheTime: 5_000
  });
  const xflBalance = parseFloat(xflBalanceObj?.data?.formatted ?? '0');

  useEffect(() => {
    getStakeInfo();
  });

  const getStakeInfo = async () => {
    const stakeLevel = await getUserStakeLevel();
    const boost = stakeLevel === 0 ? 0 : stakeLevel === 1 ? 0.5 : stakeLevel === 2 ? 1 : stakeLevel === 3 ? 1.5 : 2;
    setXflStakeBoost(boost + 'x');
    setRewardBoost(1 + boost + referralRewardBoostNum);
    const xflStaked = parseFloat((await stakeBalance()) ?? '0');
    setXflStaked(xflStaked);
  };

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

  if (!address) {
    return (
      <CenteredContent>
        <ConnectButton />
      </CenteredContent>
    );
  }

  return (
    <div className="space-y-10 mt-6 pb-6 mb-16">
      {/* <RewardsSection title="Claim">
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
      </RewardsSection> */}

      <RewardsSection
        title="Token Balance"
        subTitle={`Stake $${FLOW_TOKEN.symbol} to boost rewards. The more tokens you stake, higher the reward boost. See docs for more info.`}
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>${FLOW_TOKEN.symbol}</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(xflBalance, 2)}</div>
                <div className="text-sm mt-1">Wallet</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(xflStaked, 2)}</div>
                <div className="text-sm mt-1">Staked</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{xflStakeBoost}</div>
                <div className="text-sm mt-1">Stake boost</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
            <div className="w-full flex mt-4 items-center flex-wrap space-x-3">
              <Button size="large" onClick={() => setShowBuyTokensModal(true)}>
                Buy ${FLOW_TOKEN.symbol}
              </Button>

              <Button size="large" onClick={() => setShowStakeTokensModal(true)}>
                Stake
              </Button>

              <Button disabled size="large" variant="outline" onClick={() => setShowUnstakeTokensModal(true)}>
                Unstake
              </Button>
              <div className={twMerge(secondaryTextColor, 'ml-2 text-xs')}>
                Unstake available on Aug 3rd 2023 00:00 UTC)
              </div>
            </div>
          </div>
        }
      ></RewardsSection>

      {referralReward > 0 && (
        <RewardsSection
          title="Referral Rewards"
          subTitle={`Refer users to Flow, and earn $${FLOW_TOKEN.symbol} when users join. The more users you refer, the more you earn. 
          Referrals will also increase your reward boost.`}
          sideInfo={
            <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
              {/* <div className="mt-2 flex items-center space-x-2">
              <div>Referral link: </div>
              <div className={twMerge(secondaryBgColor, 'p-2 rounded-lg')}>{referralLink}</div>
              <ClipboardButton textToCopy={referralLink} className={'h-5 w-5'} />
            </div> */}
              <div className="mt-2 flex items-center space-x-2">
                <div>Earned</div>
              </div>
              <div className="flex flex-wrap mt-4">
                <div className="lg:w-1/4 sm:w-full">
                  <div className="text-2xl font-heading font-bold">{nFormatter(referralReward)}</div>
                  <div className="text-sm mt-1">${FLOW_TOKEN.symbol}</div>
                </div>
                <Spacer />
                <div className="lg:w-1/4 sm:w-full">
                  <div className="text-2xl font-heading font-bold">{nFormatter(numReferrals)}</div>
                  <div className="text-sm mt-1"># Referrals</div>
                </div>
                <Spacer />
                <div className="lg:w-1/4 sm:w-full">
                  <div className="text-2xl font-heading font-bold">{referralRewardBoost}</div>
                  <div className="text-sm mt-1">Reward boost</div>
                </div>
                <Spacer />
                <div className="lg:w-1/4 sm:w-full"></div>
                <Spacer />
              </div>
            </div>
          }
        ></RewardsSection>
      )}

      <RewardsSection
        title="Airdrop"
        subTitle={`Airdrop is calculated based on $INFT holdings, staked $INFT, $FLUR holdings and the past 6 month buy volume (> 9000 USDC total) on Blur and OpenSea.`}
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div className="items-center flex mt-2 text-sm">
              Current status:{' '}
              <div className={twMerge(secondaryBgColor, 'ml-2 p-2 rounded-md text-sm')}>{airdropClaimStatus}</div>
            </div>
            <div className={twMerge(secondaryTextColor, 'mt-1 text-sm font-medium')}>
              Tokens become claimable on Aug 3 2023
            </div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(airdropReward)}</div>
                <div className="text-sm mt-1">${FLOW_TOKEN.symbol}</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
          </div>
        }
      ></RewardsSection>

      <RewardsSection
        title="Buy Rewards"
        subTitle={`Earn buy rewards for every NFT purchase you make on the platform. 
          Every day 9M $${FLOW_TOKEN.symbol} is distributed to buyers proportional to their buy volume. Claimable on Aug 3 2023.`}
        sideInfo={
          <div className={twMerge(bgColor, 'py-4 px-6 rounded-lg')}>
            <div>Volume</div>

            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(buyerLast24HrVol || 0)} {EthSymbol}
                </div>
                <div className="text-sm mt-1">Your vol last 24 hrs</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(platformLast24HrVol ?? 0)} {EthSymbol}
                </div>
                <div className="text-sm mt-1">Total vol last 24 hrs</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">
                  {nFormatter(buyerTotalVol || 0)} {EthSymbol}
                </div>
                <div className="text-sm mt-1">Your total vol</div>
              </div>
              <Spacer />
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{rewardBoost + 'x'}</div>
                <div className="text-sm mt-1">Reward boost</div>
              </div>
              <Spacer />
            </div>

            <div className={twMerge('mt-5 items-center space-y-2')}>
              <div className="flex items-center space-x-2">
                <div className="text-sm">Earned rewards (last 24hrs): </div>
                <div className={twMerge(secondaryBgColor, 'ml-2 p-2 rounded-md')}>
                  {xflEarnedLast24hrs} ${FLOW_TOKEN.symbol}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm">Total earned (excl. last 24hrs): </div>
                <div className={twMerge(secondaryBgColor, 'ml-2 p-2 rounded-md')}>
                  {xflEarnedTotal} ${FLOW_TOKEN.symbol}
                </div>
              </div>
            </div>
          </div>
        }
      ></RewardsSection>

      {/* <RewardsSection
        title="Listing Rewards"
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
      ></RewardsSection> */}
      {showBuyTokensModal && (
        <UniswapModal
          onClose={() => setShowBuyTokensModal(false)}
          title={'Buy XFL'}
          chainId={Number(chainId)}
          tokenAddress={FLOW_TOKEN.address}
          tokenName={FLOW_TOKEN.name}
          tokenDecimals={FLOW_TOKEN.decimals}
          tokenSymbol={FLOW_TOKEN.symbol}
          tokenLogoURI="https://pbs.twimg.com/profile_images/1640378608492371969/Vkm_Wevj_400x400.jpg"
        />
      )}
      {showStakeTokensModal && (
        <StakeTokensModal
          onClose={() => {
            setShowStakeTokensModal(false);
          }}
        />
      )}
      {showUnstakeTokensModal && <UnstakeTokensModal onClose={() => setShowUnstakeTokensModal(false)} />}
    </div>
  );
};

export default MyRewards;
