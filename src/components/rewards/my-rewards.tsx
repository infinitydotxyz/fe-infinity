import { DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { UserCumulativeRewardsDto } from '@infinityxyz/lib-frontend/types/dto';
import { ethers } from 'ethers';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { CenteredContent, ConnectButton, Spacer, toastError, toastSuccess } from 'src/components/common';
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

  const [uniswapTokenInfo, setUniswapTokenInfo] = useState({
    name: FLOW_TOKEN.name,
    symbol: FLOW_TOKEN.symbol,
    address: FLOW_TOKEN.address,
    decimals: FLOW_TOKEN.decimals,
    logoURI: 'https://assets.coingecko.com/coins/images/30617/small/flowLogoSquare.png'
  });
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

  const blurBalanceObj = useBalance({
    address,
    token: '0x5283d291dbcf85356a21ba090e6db59121208b44' as `0x${string}`,
    watch: false,
    cacheTime: 5_000
  });
  const blurBalance = parseFloat(blurBalanceObj?.data?.formatted ?? '0');

  const looksBalanceObj = useBalance({
    address,
    token: '0xf4d2888d29d722226fafa5d9b24f9164c092421e' as `0x${string}`,
    watch: false,
    cacheTime: 5_000
  });
  const looksBalance = parseFloat(looksBalanceObj?.data?.formatted ?? '0');

  const x2y2BalanceObj = useBalance({
    address,
    token: '0x1e4ede388cbc9f4b5c79681b7f94d36a11abebc9' as `0x${string}`,
    watch: false,
    cacheTime: 5_000
  });
  const x2y2Balance = parseFloat(x2y2BalanceObj?.data?.formatted ?? '0');

  const sudoBalanceObj = useBalance({
    address,
    token: '0x3446dd70b2d52a6bf4a5a192d9b0a161295ab7f9' as `0x${string}`,
    watch: false,
    cacheTime: 5_000
  });
  const sudoBalance = parseFloat(sudoBalanceObj?.data?.formatted ?? '0');

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const setTokenInfo = (token: string) => {
    switch (token) {
      case 'XFL':
        setUniswapTokenInfo({
          name: FLOW_TOKEN.name,
          symbol: FLOW_TOKEN.symbol,
          address: FLOW_TOKEN.address,
          decimals: FLOW_TOKEN.decimals,
          logoURI: 'https://assets.coingecko.com/coins/images/30617/small/flowLogoSquare.png'
        });
        break;
      case 'BLUR':
        setUniswapTokenInfo({
          name: 'Blur',
          symbol: 'BLUR',
          address: '0x5283d291dbcf85356a21ba090e6db59121208b44',
          decimals: 18,
          logoURI: 'https://assets.coingecko.com/coins/images/28453/small/blur.png'
        });
        break;
      case 'LOOKS':
        setUniswapTokenInfo({
          name: 'Looksrare',
          symbol: 'LOOKS',
          address: '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
          decimals: 18,
          logoURI: 'https://assets.coingecko.com/coins/images/22173/small/circle-black-256.png'
        });
        break;
      case 'X2Y2':
        setUniswapTokenInfo({
          name: 'X2Y2',
          symbol: 'X2Y2',
          address: '0x1e4ede388cbc9f4b5c79681b7f94d36a11abebc9',
          decimals: 18,
          logoURI: 'https://assets.coingecko.com/coins/images/23633/small/logo-60b81ff87b40b11739105acf5ad1e075.png'
        });
        break;
      case 'SUDO':
        setUniswapTokenInfo({
          name: 'SUDO',
          symbol: 'SUDO',
          address: '0x3446dd70b2d52a6bf4a5a192d9b0a161295ab7f9',
          decimals: 18,
          logoURI: 'https://assets.coingecko.com/coins/images/27151/small/sudo.png'
        });
        break;
      default:
        setUniswapTokenInfo({
          name: FLOW_TOKEN.name,
          symbol: FLOW_TOKEN.symbol,
          address: FLOW_TOKEN.address,
          decimals: FLOW_TOKEN.decimals,
          logoURI: 'https://assets.coingecko.com/coins/images/30617/small/flowLogoSquare.png'
        });
    }
  };

  return (
    <div className="space-y-10 mt-6 pb-6 mb-16 mr-4">
      <RewardsSection
        title="Token Balances"
        subTitle={`Balances of the top NFT exchange tokens.`}
        sideInfo={
          <div className={twMerge(buttonBorderColor, primaryShadow, 'border py-4 px-6')}>
            <div className="flex flex-wrap">
              <div className="lg:w-1/6 sm:w-full space-y-1 flex flex-col">
                <div>${FLOW_TOKEN.symbol}</div>
                <div className="text-lg font-heading font-bold">{nFormatter(xflBalance, 2)}</div>
                <div
                  className="underline text-sm cursor-pointer"
                  onClick={() => {
                    setTokenInfo(FLOW_TOKEN.symbol);
                    setShowBuyTokensModal(true);
                  }}
                >
                  Buy ${FLOW_TOKEN.symbol}
                </div>
              </div>
              <Spacer />

              <div className="lg:w-1/6 sm:w-full space-y-1 flex flex-col">
                <div>$BLUR</div>
                <div className="text-lg font-heading font-bold">{nFormatter(blurBalance, 2)}</div>
                <div
                  className="underline text-sm cursor-pointer"
                  onClick={() => {
                    setTokenInfo('BLUR');
                    setShowBuyTokensModal(true);
                  }}
                >
                  Buy $BLUR
                </div>
              </div>
              <Spacer />

              <div className="lg:w-1/6 sm:w-full space-y-1 flex flex-col">
                <div>$LOOKS</div>
                <div className="text-lg font-heading font-bold">{nFormatter(looksBalance, 2)}</div>
                <div
                  className="underline text-sm cursor-pointer"
                  onClick={() => {
                    setTokenInfo('LOOKS');
                    setShowBuyTokensModal(true);
                  }}
                >
                  Buy $LOOKS
                </div>
              </div>
              <Spacer />

              <div className="lg:w-1/6 sm:w-full space-y-1 flex flex-col">
                <div>$X2Y2</div>
                <div className="text-lg font-heading font-bold">{nFormatter(x2y2Balance, 2)}</div>
                <div
                  className="underline text-sm cursor-pointer"
                  onClick={() => {
                    setTokenInfo('X2Y2');
                    setShowBuyTokensModal(true);
                  }}
                >
                  Buy $X2Y2
                </div>
              </div>
              <Spacer />

              <div className="lg:w-1/6 sm:w-full space-y-1 flex flex-col">
                <div>$SUDO</div>
                <div className="text-lg font-heading font-bold">{nFormatter(sudoBalance, 2)}</div>
                <div
                  className="underline text-sm cursor-pointer"
                  onClick={() => {
                    setTokenInfo('SUDO');
                    setShowBuyTokensModal(true);
                  }}
                >
                  Buy $SUDO
                </div>
              </div>
              <Spacer />

              {xflStaked > 0 && (
                <>
                  <div className="lg:w-1/6 sm:w-full">
                    <div className="text-2xl font-heading font-bold">{nFormatter(xflStaked, 2)}</div>
                    <div className="text-sm mt-1">Staked</div>
                  </div>
                  <Spacer />
                </>
              )}

              {/* <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{1}</div>
                <div className="text-sm mt-1">Rewards boost</div>
              </div>
              <Spacer /> */}
            </div>

            <div className="w-full flex mt-4 items-center flex-wrap space-x-3">
              {/* <AButton primary onClick={() => setShowStakeTokensModal(true)}>
                Stake
              </AButton> */}

              {xflStaked > 0 && (
                <AButton primary onClick={() => setShowUnstakeTokensModal(true)}>
                  Unstake
                </AButton>
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

              {/* {claimableAmountWei !== '0' && (
                <div className="w-full flex mt-4 items-center flex-wrap space-x-3">
                  <AButton primary onClick={() => doClaim(DistributionType.XFL)}>
                    Claim
                  </AButton>
                </div>
              )} */}
            </div>
          }
        ></RewardsSection>
      )}

      <CenteredContent>More rewards dropping soon.</CenteredContent>

      {showBuyTokensModal && (
        <UniswapModal
          onClose={() => setShowBuyTokensModal(false)}
          title={`Buy ${uniswapTokenInfo.symbol}`}
          chainId={Number(chainId)}
          tokenAddress={uniswapTokenInfo.address}
          tokenName={uniswapTokenInfo.name}
          tokenDecimals={uniswapTokenInfo.decimals}
          tokenSymbol={uniswapTokenInfo.symbol}
          tokenLogoURI={uniswapTokenInfo.logoURI}
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
