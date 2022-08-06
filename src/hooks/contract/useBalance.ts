import { BigNumber, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

/**
 * Utility hook to call any contract method with a signature like `balanceOf(address?: string): BigNumber`.
 *
 * @param method contract method to call.
 * @param address Optional address to lookup. Defaults to the address of the currently logged in user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useBalance(contractMethod: any, address?: string) {
  const { user } = useOnboardContext();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user?.address) {
      contractMethod(address || user.address)
        .then((balance: BigNumber) => {
          const ether = utils.formatEther(balance);
          setBalance(+ether);
        })
        .catch(console.error);
    }
  }, [user]);

  return { balance };
}
