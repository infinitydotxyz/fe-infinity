/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcSigner } from '@ethersproject/providers';
import { SwapWidget, Theme, TokenInfo } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { useTheme } from 'next-themes';
import { useSigner } from 'wagmi';
import tailwindConfig from '../../settings/tailwind/elements/foundations';

// Special address for native token
const NATIVE = 'NATIVE';

export interface UniswapModalProps {
  chainId: number;
  tokenAddress: string;
  tokenName: string;
  tokenDecimals: number;
  tokenSymbol: string;
  tokenLogoURI: string;
}

export default function UniswapWidget({
  chainId,
  tokenAddress,
  tokenName,
  tokenDecimals,
  tokenSymbol,
  tokenLogoURI
}: UniswapModalProps) {
  const provider = useSigner<JsonRpcSigner>().data?.provider;

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const widgetTheme: Theme = {
    borderRadius: 1,
    fontFamily: 'DM Sans',
    accent: tailwindConfig.colors.brand.primary,
    interactive: tailwindConfig.colors.brand.primaryFade,
    container: themeToUse.bg,
    module: themeToUse.card,
    primary: themeToUse.body
  };

  const token: TokenInfo = {
    chainId,
    address: tokenAddress,
    name: tokenName,
    decimals: tokenDecimals,
    symbol: tokenSymbol,
    logoURI: tokenLogoURI
  };

  return (
    <div className="Uniswap">
      <SwapWidget
        provider={provider}
        theme={widgetTheme}
        tokenList={[token]}
        defaultInputTokenAddress={NATIVE}
        defaultOutputTokenAddress={token.address}
      />
    </div>
  );
}
