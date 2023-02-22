import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { AssetReferralDto } from '@infinityxyz/lib-frontend/types/dto';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiPut } from 'src/utils';
import { useAccount } from 'wagmi';

export const useSaveReferral = (assetAddress: string, chainId: ChainId, tokenId?: string) => {
  const { query } = useRouter();
  const { address: user, isConnected } = useAccount();

  useEffect(() => {
    const userAddress = user;

    const userValid = !!userAddress && isConnected;
    const assetValid = ethers.utils.isAddress(assetAddress) && chainId;
    const referrerValid =
      !!query.referrer && typeof query.referrer === 'string' && ethers.utils.isAddress(query.referrer as string);

    if (userValid && assetValid && referrerValid) {
      const body: AssetReferralDto = {
        referrer: query.referrer as string,
        assetAddress,
        assetChainId: chainId,
        assetTokenId: tokenId ?? ''
      };

      apiPut(`/user/${user}/referrals`, { data: body }).catch((err) => console.error(err));
    }
  }, [user, assetAddress, chainId, tokenId, query.referrer]);
};
