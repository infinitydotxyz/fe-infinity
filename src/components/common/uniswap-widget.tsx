/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcSigner } from '@ethersproject/providers';
import { SwapWidget, Theme, TokenInfo } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { useSigner } from 'wagmi';

const theme: Theme = {
  borderRadius: 1,
  fontFamily: 'DM Sans',
  accent: '#000000',
  container: '#F0F0F0',
  module: '#FFFFFF',
  primary: '#000000'
};

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
  // const provider = useProvider({
  //   chainId
  // });

  const provider = useSigner<JsonRpcSigner>().data?.provider;

  console.log('provider', provider);

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
        theme={theme}
        tokenList={[token]}
        defaultInputTokenAddress={NATIVE}
        defaultOutputTokenAddress={token.address}
      />
    </div>
  );
}
