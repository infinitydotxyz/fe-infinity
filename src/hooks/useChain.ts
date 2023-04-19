import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { switchNetwork } from '@wagmi/core';

const DEFAULT_CHAIN = ChainId.Mainnet;

export const useChain = () => {
  const [selectedChain, setSelectedChain] = useState<ChainId>(DEFAULT_CHAIN);
  const [isWalletNetworkSupported, setIsWalletNetworkSupported] = useState(true);
  const { chain } = useNetwork();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (chain?.unsupported) {
      setIsWalletNetworkSupported(false);
    } else if (chain?.id && selectedChain !== `${chain.id}`) {
      setSelectedChain(`${chain.id}` as ChainId);
      setIsWalletNetworkSupported(true);
    }
    if (chain?.unsupported === false) {
      setIsWalletNetworkSupported(true);
    }

    if (!isReady) {
      setIsReady(true);
    }
  }, [chain]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (`${selectedChain}` !== `${chain?.id}`) {
      const chainInt = parseInt(selectedChain, 10);
      switchNetwork({
        chainId: chainInt
      }).catch((err) => {
        console.error('failed to switch network', err);
      });
    }
  }, [selectedChain]);

  return {
    isWalletNetworkSupported,
    selectedChain,
    setSelectedChain
  };
};
