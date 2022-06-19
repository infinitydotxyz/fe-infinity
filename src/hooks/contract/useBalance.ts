import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';

/**
 * Utility hook to call any contract method with a signature like `balanceOf(address?: string): BigNumber`.
 *
 * @param method contract method to call.
 * @param address Optional address to lookup. Defaults to the address of the currently logged in user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useBalance(contractMethod: any, address?: string) {
  const { user, userReady } = useAppContext();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (user?.address) {
      contractMethod(address || user.address)
        .then((balance: BigNumber) => {
          setBalance(BigNumber.from(balance).toString());
        })
        .catch(console.error);
    }
  }, [userReady]);

  return { balance };
}
