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
      const asyncFunct = async () => {
        // don't try if not an address
        if (address && address.startsWith('0x')) {
          const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

          const name = await ethersProvider.lookupAddress(address);

          if (name) {
            if (isMounted()) {
              setEnsName(name);
            }
          }
        }
      };

      asyncFunct();
    }
  }, [wallet]);

  return ensName;
};
