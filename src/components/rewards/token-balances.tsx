import { twMerge } from 'tailwind-merge';
import { RewardsSection } from './rewards-section';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import { FLOW_TOKEN, nFormatter } from 'src/utils';
import { AButton } from '../astra/astra-button';
import { UniswapModal } from '../common/uniswap-model';
import { useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { fetchMinXflStakeForZeroFees } from 'src/utils/orderbook-utils';
import { Spacer } from '../common';
import { StakeTokensModal } from './stake-tokens-modal';
import { UnstakeTokensModal } from './unstake-tokens-modal';

const tokenItemClassname = 'lg:w-1/6 sm:w-full gap-1 flex md:flex-col items-center justify-between text-sm mt-1';

export const TokenBalances = ({
  address,
  isDesktop,
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
  const { stakeBalance } = useStakerContract();
  const [minStakeAmountForFeeWaiverAndBoost, setMinStakeAmountForFeeWaiverAndBoost] = useState(0);

  const getStakeInfo = async () => {
    try {
      const minStakeAmount =
        minStakeAmountForFeeWaiverAndBoost === 0
          ? await fetchMinXflStakeForZeroFees(chainId)
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
        subTitle={<div className="text-sm">Balances of the top NFT exchange tokens.</div>}
        sideInfo={
          <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:p-4 md:px-6')}>
            <div className="md:flex flex-wrap">
              <div className={tokenItemClassname}>
                <div>${FLOW_TOKEN.symbol}</div>
                <div className="md:text-lg font-heading font-bold">{nFormatter(xflBalance, 2)}</div>
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

              <div className={tokenItemClassname}>
                <div>$BLUR</div>
                <div className="md:text-lg font-heading font-bold">{nFormatter(blurBalance, 2)}</div>
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

              <div className={tokenItemClassname}>
                <div>$LOOKS</div>
                <div className="md:text-lg font-heading font-bold">{nFormatter(looksBalance, 2)}</div>
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

              <div className={tokenItemClassname}>
                <div>$X2Y2</div>
                <div className="md:text-lg font-heading font-bold">{nFormatter(x2y2Balance, 2)}</div>
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

              <div className={tokenItemClassname}>
                <div>$SUDO</div>
                <div className="md:text-lg font-heading font-bold">{nFormatter(sudoBalance, 2)}</div>
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
