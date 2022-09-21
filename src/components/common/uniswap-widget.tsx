/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { chainConstants, CURRENT_VERSION } from '@infinityxyz/lib-frontend/utils';
import { Theme, TokenInfo, SwapWidget } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

/**
 * The UniswapWidget requires a dynamic import to work with NextJS. https://github.com/Uniswap/widgets/issues/133
 *
 * Example usage:
 * Instead of:
 * import UniswapWidget from '../src/components/common/uniswap-widget';
 * Use:
 * import dynamic from 'next/dynamic';
 * const DynamicUniswapWidget = dynamic(() => import('../src/components/common/uniswap-widget'), { ssr: false });
 *
 * Then use it like this:
 * <DynamicUniswapWidget />
 */

const theme: Theme = {
  borderRadius: 1,
  fontFamily: 'F37 Bolton',
  accent: '#000000',
  container: '#F0F0F0',
  module: '#FFFFFF',
  primary: '#000000'
};

// Special address for native token
const NATIVE = 'NATIVE';

export default function UniswapWidget() {
  const { wallet, chainId } = useOnboardContext();

  const chain = chainConstants[chainId as ChainId].prod[CURRENT_VERSION];
  const token: TokenInfo = {
    ...chain.infinityContracts.token,
    chainId: parseInt(chain.infinityContracts.token.chainId as string, 10),
    logoURI: 'https://infinity.xyz/favicon.ico'
  };

  return (
    <div className="Uniswap">
      <SwapWidget
        provider={wallet?.provider as any}
        theme={theme}
        tokenList={[token]}
        defaultInputTokenAddress={NATIVE}
        defaultOutputTokenAddress={token.address}
      />
    </div>
  );
}
