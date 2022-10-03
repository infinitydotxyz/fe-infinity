import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useStakerContract } from './useStakerContract';

export function useRageQuit() {
  const { user, checkSignedIn } = useOnboardContext();
  const { contract } = useStakerContract();
  const [userAmount, setUserAmount] = useState('');
  const [penalty, setPenalty] = useState('');
  const [amountLoading, setAmountLoading] = useState(false);

  const updateRageQuitAmounts = async () => {
    const address = user?.address;
    if (!address) {
      return;
    }

    try {
      setAmountLoading(true);
      const [userAmount, penalties] = await contract.getRageQuitAmounts(address);
      setUserAmount(BigNumber.from(userAmount).toString());
      setPenalty(BigNumber.from(penalties).toString());
      setAmountLoading(false);
    } catch (err) {
      console.error(err);
      setAmountLoading(false);
    }
  };

  useEffect(() => {
    updateRageQuitAmounts();
  }, [user?.address]);

  const rageQuit = async () => {
    if (!checkSignedIn()) {
      return;
    }
    const tx = await contract.rageQuit();
    await tx.wait();
  };

  return { rageQuit, userAmount, penalty, amountLoading };
}
