import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

const DEFAULT_CHAIN = ChainId.Mainnet;

export const useChain = () => {
  const { chain } = useNetwork();
  const [selectedChain, setSelectedChain] = useState<string>(chain?.id ? `${chain.id}` : `${DEFAULT_CHAIN}`);
  const [isWalletNetworkSupported, setIsWalletNetworkSupported] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (chain?.id && selectedChain !== `${chain.id}`) {
      console.log(`Chain is not selected.Selected ${selectedChain} but wallet is on ${chain.id}`);
      setSelectedChain(`${chain.id}`);
    }

    if (chain) {
      setIsWalletNetworkSupported(!chain.unsupported);
    }

    if (!isReady) {
      setIsReady(true);
    }
  }, [chain, selectedChain, setSelectedChain, setIsWalletNetworkSupported, setIsReady]);

  return {
    isWalletNetworkSupported,
    selectedChain,
    chainName: chain?.name || 'Unknown',
    setSelectedChain
  };
};
