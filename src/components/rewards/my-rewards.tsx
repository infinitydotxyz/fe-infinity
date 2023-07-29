import { DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { UserCumulativeRewardsDto } from '@infinityxyz/lib-frontend/types/dto';
import { ethers } from 'ethers';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Button, CenteredContent, ConnectButton, Spacer, toastError, toastSuccess } from 'src/components/common';
import { StakeTokensModal } from 'src/components/rewards/stake-tokens-modal';
import { UnstakeTokensModal } from 'src/components/rewards/unstake-tokens-modal';
import { useUserRewards } from 'src/hooks/api/useUserRewards';
import { useClaim } from 'src/hooks/contract/cm-distributor/claim';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { nFormatter } from 'src/utils';
import { FLOW_TOKEN } from 'src/utils/constants';
import { useAppContext } from 'src/utils/context/AppContext';
import { fetchMinXflStakeForZeroFees } from 'src/utils/orderbook-utils';
import { buttonBorderColor, primaryShadow, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { AButton } from '../astra/astra-button';
import { UniswapModal } from '../common/uniswap-model';

interface RewardsSectionProps {
  title: string;
  subTitle?: string;
  sideInfo?: React.ReactNode;
  children?: React.ReactNode;
}

const RewardsSection = (props: RewardsSectionProps) => {
  return (
    <div
      className={twMerge(
        buttonBorderColor,
        'border flex-col px-10 py-4 w-full shadow-brand-primaryFade dark:shadow-brand-darkPrimaryFade shadow-sm'
      )}
    >
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
  const { chain } = useNetwork();
  const chainId = String(chain?.id);

  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const [showBuyTokensModal, setShowBuyTokensModal] = useState(false);
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);
  const { address } = useAccount();
  const { result: userRewards } = useUserRewards();
  const cumulativeAmountWei = userRewards?.totals?.totalRewards?.claim?.cumulativeAmount ?? '0';
  const cumulativeAmount = parseFloat(ethers.utils.formatEther(cumulativeAmountWei));
  const claimableAmountWei = userRewards?.totals?.totalRewards?.claim?.claimableWei ?? '0';
  const claimableAmount = userRewards?.totals?.totalRewards?.claim?.claimableEth ?? 0;
  const claimedAmount = userRewards?.totals?.totalRewards?.claim?.claimedEth ?? 0;
  const merkleRoot = userRewards?.totals?.totalRewards?.claim?.merkleRoot;
  const merkleProof = userRewards?.totals?.totalRewards?.claim?.merkleProof;

  const { stakeBalance } = useStakerContract();
  const [minStakeAmountForFeeWaiverAndBoost, setMinStakeAmountForFeeWaiverAndBoost] = useState(0);
  const [xflStaked, setXflStaked] = useState(0);
  // const [xflStakeBoost, setXflStakeBoost] = useState('0x');

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
    const minStakeAmount =
      minStakeAmountForFeeWaiverAndBoost === 0
        ? await fetchMinXflStakeForZeroFees()
        : minStakeAmountForFeeWaiverAndBoost;
    setMinStakeAmountForFeeWaiverAndBoost(minStakeAmount);

    const xflStaked = parseFloat((await stakeBalance()) ?? '0');
    setXflStaked(xflStaked);

    // const boost = xflStaked >= minStakeAmount ? 2 : 0;
    // setXflStakeBoost(boost + 'x');
  };

  const { claim } = useClaim();
  const { setTxnHash } = useAppContext();

  const doClaim = async (type: DistributionType, props?: UserCumulativeRewardsDto) => {
    const claimableWei = props?.claimableWei || claimableAmountWei || '0';
    if (claimableWei === '0') {
      toastError('Nothing to claim', darkMode);
      return;
    }

    const { hash } = await claim({
      type,
      account: props?.account ?? address ?? '',
      cumulativeAmount: props?.cumulativeAmount ?? cumulativeAmountWei,
      merkleRoot: props?.merkleRoot ?? merkleRoot ?? '',
      merkleProof: props?.merkleProof ?? merkleProof ?? []
    });
    toastSuccess('Transaction submitted', darkMode);
    setTxnHash(hash);
  };

  if (!address) {
    return (
      <CenteredContent>
        <ConnectButton />
      </CenteredContent>
    );
  }

  return (
    <div className="space-y-10 mt-6 pb-6 mb-16 mr-4">
      <RewardsSection
        title="Token Balance"
        subTitle={`Token balances.`}
        // subTitle={`Stake $${FLOW_TOKEN.symbol} for royalty waivers, priority support from core team and early/gated access to cool stuff. Staked tokens are locked until the end of each reward season to prevent abuse.`}
        sideInfo={
          <div className={twMerge(buttonBorderColor, primaryShadow, 'border py-4 px-6')}>
            <div>${FLOW_TOKEN.symbol}</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{nFormatter(xflBalance, 2)}</div>
                <div className="text-sm mt-1">Wallet</div>
              </div>
              <Spacer />
              {xflStaked > 0 && (
                <>
                  <div className="lg:w-1/4 sm:w-full">
                    <div className="text-2xl font-heading font-bold">{nFormatter(xflStaked, 2)}</div>
                    <div className="text-sm mt-1">Staked</div>
                  </div>
                  <Spacer />
                </>
              )}
              {/* <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{xflStakeBoost}</div>
                <div className="text-sm mt-1">Rewards boost</div>
              </div>
              <Spacer /> */}
              <div className="lg:w-1/4 sm:w-full"></div>
              <Spacer />
            </div>
            <div className="w-full flex mt-4 items-center flex-wrap space-x-3">
              {/* <Button size="large" variant="outline" onClick={() => setShowBuyTokensModal(true)}>
                Buy ${FLOW_TOKEN.symbol}
              </Button> */}

              {/* <Button size="large" variant="outline" onClick={() => setShowStakeTokensModal(true)}>
                Stake
              </Button>*/}

              {xflStaked > 0 && (
                <Button size="large" variant="outline" onClick={() => setShowUnstakeTokensModal(true)}>
                  Unstake
                </Button>
              )}
              {/* <div className={twMerge(secondaryTextColor, 'ml-2 text-xs')}>
                Unstake available on Nov 3rd 2023 00:00 UTC)
              </div> */}
            </div>
          </div>
        }
      ></RewardsSection>

      {cumulativeAmount > 0 && (
        <RewardsSection
          title="Earned Rewards"
          subTitle={`Earned $${FLOW_TOKEN.symbol} rewards.`}
          sideInfo={
            <div className={twMerge(buttonBorderColor, primaryShadow, 'border py-4 px-6')}>
              <div>${FLOW_TOKEN.symbol}</div>
              <div className="flex flex-wrap mt-4">
                <div className="lg:w-1/3 sm:w-full">
                  <div className="text-2xl font-heading font-bold">{nFormatter(cumulativeAmount, 2)}</div>
                  <div className="text-sm mt-1">Earned</div>
                </div>
                <Spacer />

                <div className="lg:w-1/3 sm:w-full">
                  <div className="text-2xl font-heading font-bold">{nFormatter(claimedAmount, 2)}</div>
                  <div className="text-sm mt-1">Claimed</div>
                </div>
                <Spacer />

                <div className="lg:w-1/3 sm:w-full">
                  <div className="text-2xl font-heading font-bold">{nFormatter(claimableAmount, 2)}</div>
                  <div className="text-sm mt-1">Claimable</div>
                </div>
                <Spacer />
              </div>

              <div className={twMerge('w-full flex mt-2 text-xs', secondaryTextColor)}>Claim coming soon.</div>

              {claimableAmountWei !== '0' && (
                <div className="w-full flex mt-4 items-center flex-wrap space-x-3">
                  <AButton primary onClick={() => doClaim(DistributionType.XFL)}>
                    Claim
                  </AButton>
                </div>
              )}
            </div>
          }
        ></RewardsSection>
      )}

      <CenteredContent>More rewards dropping soon.</CenteredContent>

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
