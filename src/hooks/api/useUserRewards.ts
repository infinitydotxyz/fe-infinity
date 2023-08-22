import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { swrFetch, useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useAccount, useNetwork } from 'wagmi';
import { useUserSignature } from './useUserSignature';
import { useEffect, useState } from 'react';

export function useUserRewards() {
  const { chain } = useNetwork();
  const { address: user } = useAccount();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  return useFetch<UserRewardsDto>(user ? `/user/${chainId}:${user}/rewards` : null);
}

export type UserRewards = {
  referralPoints: number;
  listingPoints: number;
  airdropPoints: number;
  buyPoints: number;
  totalPoints: number;
  updatedAt: number;
  referralCode: string;
  user: string;
};

export function useUserPixlRewards() {
  const { signature } = useUserSignature();
  const [value, setValue] = useState<
    { result: { error: 'Wallet not connected' | 'User not signed in' } } | { result: UserRewards }
  >({
    result: {
      error: 'User not signed in'
    }
  });

  const fetch = async () => {
    if (signature && !('error' in signature)) {
      const endpoint = `/pixl/rewards/${signature.address}`;
      const res = await swrFetch(endpoint, {
        options: {
          headers: {
            'x-auth-nonce': 'error' in signature ? '' : signature?.nonce,
            'x-auth-signature': 'error' in signature ? '' : signature?.sig
          }
        }
      });

      console.log(`setting result`, res);
      if (res) {
        setValue(res);
      }
    }
  };

  useEffect(() => {
    if ('error' in signature) {
      console.log(`error in signature`, signature.error);
      setValue({
        result: {
          error: signature.error
        }
      });
    } else if (signature) {
      console.log(`fetching rewards`);
      fetch();
    }
  }, [signature, setValue, fetch]);

  return value;
}
