import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useIsMounted } from './useIsMounted';

export const useEnsName = (address: string) => {
  const [ensName, setEnsName] = useState('');
  const isMounted = useIsMounted();

  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const asyncFunct = async () => {
        const name = await ethersProvider.lookupAddress(address);

        if (name) {
          if (isMounted()) {
            setEnsName(name);
          }
        }
      };

      asyncFunct();
    }
  }, [wallet]);

  return ensName;
};
