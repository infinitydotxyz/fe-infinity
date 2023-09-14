import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { apiGet, apiPut, useFetch } from 'src/utils';
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

export type AirdropTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE';

export type UserRewards = {
  referralPoints: number;
  listingPoints: number;
  airdropTier: AirdropTier;
  buyPoints: number;
  totalPoints: number;
  updatedAt: number;
  referralCode: string;
  user: string;
  airdropBoosted: boolean;
  numReferrals: number;
  numBuys: number;
  numNativeBuys: number;
  volume: number;
  nativeVolume: number;
  numListings: number;
  numActiveListings: number;
  numListingsBelowFloor: number;
  numActiveListingsBelowFloor: number;
};

const fetch = async (sig: ReturnType<typeof useUserSignature>['signature']) => {
  if (sig) {
    const endpoint = `/pixl/rewards/user/${sig.address}`;
    try {
      const res = await apiGet(endpoint, {
        options: {
          headers: {
            'x-auth-nonce': sig.nonce,
            'x-auth-signature': sig.sig
          }
        }
      });
      if (res.result) {
        return { result: res.result };
      } else {
        throw new Error(`Failed to parse user response result`);
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};

export function useUserPixlRewards() {
  const { signature } = useAppContext();

  const [value, setValue] = useState<{ error: 'User not signed in' } | UserRewards>({
    error: 'User not signed in'
  });

  const boostAirdrop = async () => {
    if (!signature) {
      return;
    }
    try {
      await apiPut(`/pixl/rewards/user/${signature.address}/airdrop/boost`, {
        options: {
          headers: {
            'x-auth-nonce': signature.nonce,
            'x-auth-signature': signature.sig
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (signature !== null) {
      fetch(signature).then((res) => {
        if (!isMounted || !res) {
          return;
        }
        setValue(res.result);
      });
    } else {
      setValue({ error: 'User not signed in' });
    }
    return () => {
      isMounted = false;
    };
  }, [signature, setValue, fetch]);

  return { rewards: value, boostAirdrop };
}
