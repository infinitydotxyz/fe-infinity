import { twMerge } from 'tailwind-merge';
import { RewardsSection } from './rewards-section';
import { borderColor, primaryShadow, rewardSectionItemLabel, rewardSectionItemValue } from 'src/utils/ui-constants';
import { FLOW_TOKEN, nFormatter } from 'src/utils';
import { AButton } from '../astra/astra-button';
import { UniswapModal } from '../common/uniswap-model';
import { useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { fetchMinXflBalanceForZeroFee } from 'src/utils/orderbook-utils';
import { Spacer } from '../common';
import { StakeTokensModal } from './stake-tokens-modal';
import { UnstakeTokensModal } from './unstake-tokens-modal';

const tokenItemClassname =
  'lg:w-1/6 sm:w-full gap-1 flex md:flex-col items-center justify-between text-sm mt-2.5 md:mt-1';

export const TokenBalances = ({
  address,
  chainId
}: {
  address: `0x${string}`;
  chainId: string;
  isDesktop: boolean;
}) => {
  const [showBuyTokensModal, setShowBuyTokensModal] = useState(false);
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);

  const [uniswapTokenInfo, setUniswapTokenInfo] = useState({
    name: FLOW_TOKEN.name,
    symbol: FLOW_TOKEN.symbol,
    address: FLOW_TOKEN.address,
    decimals: FLOW_TOKEN.decimals,
    logoURI: 'https://assets.coingecko.com/coins/images/30617/small/flowLogoSquare.png'
  });

  const [xflStaked, setXflStaked] = useState(0);

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
  const { stakeBalance } = useStakerContract(chainId);
  const [minStakeAmountForFeeWaiverAndBoost, setMinStakeAmountForFeeWaiverAndBoost] = useState(0);

  const getStakeInfo = async () => {
    try {
      const minStakeAmount =
        minStakeAmountForFeeWaiverAndBoost === 0
          ? await fetchMinXflBalanceForZeroFee(chainId)
          : minStakeAmountForFeeWaiverAndBoost;
      setMinStakeAmountForFeeWaiverAndBoost(minStakeAmount);

      const xflStaked = parseFloat((await stakeBalance()) ?? '0');
      setXflStaked(xflStaked);

      // const boost = xflStaked >= minStakeAmount ? 2 : 0;
      // setXflStakeBoost(boost + 'x');
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getStakeInfo();
  }, []);

  const rewardBoost = xflBalance >= 10_000_000 ? 10 : xflBalance >= 5_000_000 ? 5 : xflBalance >= 1_000_000 ? 2 : 0;

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
    <div>
      <RewardsSection
        title="Token Balances"
        subTitle={
          <div className="flex flex-col items-start space-y-2.5">
            <div className="text-sm font-semibold">
              Balances of the top NFT exchange tokens. Min balance required (any one of the tokens) for 0 fees and
              royalties: {nFormatter(minStakeAmountForFeeWaiverAndBoost, 2)}
            </div>
            {xflBalance > 0 ? (
              <div className="text-base font-semibold">
                Your current reward boost for holding {nFormatter(xflBalance, 2)} ${FLOW_TOKEN.symbol} tokens:{' '}
                <span className={twMerge(primaryShadow, borderColor, 'font-bold text-lg border p-1')}>
                  {rewardBoost}x
                </span>
              </div>
            ) : (
              <div className="text-base font-semibold">
                You are not earning a reward boost as your ${FLOW_TOKEN.symbol} balance is 0. You can earn upto a 10x
                boost on rewards for holding ${FLOW_TOKEN.symbol} tokens. See{' '}
                <a
                  target="_blank"
                  href="https://docs.pixl.so/xfl-tokenomics#utility"
                  className="underline cursor-pointer"
                >
                  docs
                </a>{' '}
                for more info.
              </div>
            )}
          </div>
        }
        sideInfo={
          <div className="h-full md:p-5">
            <div className="md:flex items-center flex-wrap h-full">
              <div className={tokenItemClassname}>
                <div className={rewardSectionItemLabel}>${FLOW_TOKEN.symbol}</div>
                <div className={twMerge(rewardSectionItemValue, 'hidden md:block')}>{nFormatter(xflBalance, 2)}</div>
                <div className="flex items-center">
                  <div className={twMerge(rewardSectionItemValue, 'md:hidden block leading-5 mr-2.5')}>
                    {nFormatter(sudoBalance, 2)}
                  </div>
                  <AButton
                    primary
                    onClick={() => {
                      setTokenInfo(FLOW_TOKEN.symbol);
                      setShowBuyTokensModal(true);
                    }}
                    className={twMerge('text-sm p-2.5 border-0 rounded-4 md:mt-3.75 font-semibold')}
                  >
                    Buy
                  </AButton>
                </div>
              </div>
              <Spacer />

              <div className={tokenItemClassname}>
                <div className={rewardSectionItemLabel}>$BLUR</div>
                <div className={twMerge(rewardSectionItemValue, 'hidden md:block')}>{nFormatter(blurBalance, 2)}</div>
                <div className="flex items-center">
                  <div className={twMerge(rewardSectionItemValue, 'md:hidden block leading-5 mr-2.5')}>
                    {nFormatter(sudoBalance, 2)}
                  </div>
                  <AButton
                    primary
                    onClick={() => {
                      setTokenInfo('BLUR');
                      setShowBuyTokensModal(true);
                    }}
                    className={twMerge('text-sm p-2.5 border-0 rounded-4 md:mt-3.75 font-semibold')}
                  >
                    Buy
                  </AButton>
                </div>
              </div>
              <Spacer />

              <div className={tokenItemClassname}>
                <div className={rewardSectionItemLabel}>$LOOKS</div>
                <div className={twMerge(rewardSectionItemValue, 'hidden md:block')}>{nFormatter(looksBalance, 2)}</div>
                <div className="flex items-center">
                  <div className={twMerge(rewardSectionItemValue, 'md:hidden block leading-5 mr-2.5')}>
                    {nFormatter(sudoBalance, 2)}
                  </div>
                  <AButton
                    primary
                    onClick={() => {
                      setTokenInfo('LOOKS');
                      setShowBuyTokensModal(true);
                    }}
                    className={twMerge('text-sm p-2.5 border-0 rounded-4 md:mt-3.75 font-semibold')}
                  >
                    Buy
                  </AButton>
                </div>
              </div>
              <Spacer />

              <div className={tokenItemClassname}>
                <div className={rewardSectionItemLabel}>$X2Y2</div>
                <div className={twMerge(rewardSectionItemValue, 'hidden md:block')}>{nFormatter(x2y2Balance, 2)}</div>
                <div className="flex items-center">
                  <div className={twMerge(rewardSectionItemValue, 'md:hidden block leading-5 mr-2.5')}>
                    {nFormatter(sudoBalance, 2)}
                  </div>
                  <AButton
                    primary
                    onClick={() => {
                      setTokenInfo('X2Y2');
                      setShowBuyTokensModal(true);
                    }}
                    className={twMerge('text-sm p-2.5 border-0 rounded-4 md:mt-3.75 font-semibold')}
                  >
                    Buy
                  </AButton>
                </div>
              </div>
              <Spacer />

              <div className={tokenItemClassname}>
                <div className={rewardSectionItemLabel}>$SUDO</div>
                <div className={twMerge(rewardSectionItemValue, 'hidden md:block')}>{nFormatter(sudoBalance, 2)}</div>
                <div className="flex items-center">
                  <div className={twMerge(rewardSectionItemValue, 'md:hidden block leading-5 mr-2.5')}>
                    {nFormatter(sudoBalance, 2)}
                  </div>
                  <AButton
                    primary
                    onClick={() => {
                      setTokenInfo('SUDO');
                      setShowBuyTokensModal(true);
                    }}
                    className={twMerge('text-sm p-2.5 border-0 rounded-4 md:mt-3.75 font-semibold')}
                  >
                    Buy
                  </AButton>
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
          chainId={chainId}
          onClose={() => {
            setShowStakeTokensModal(false);
          }}
        />
      )}
      {showUnstakeTokensModal && (
        <UnstakeTokensModal chainId={chainId} onClose={() => setShowUnstakeTokensModal(false)} />
      )}
    </div>
  );
};
