import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { AssetReferralDto } from '@infinityxyz/lib-frontend/types/dto';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiPut } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const useSaveReferral = (assetAddress: string, chainId: ChainId, tokenId?: string) => {
  const { user, checkSignedIn } = useOnboardContext();
  const { query } = useRouter();

  useEffect(() => {
    const userAddress = user?.address;

    const userValid = !!userAddress && checkSignedIn();
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

      console.log(`Saving referral for ${userAddress} from ${body.referrer} for ${chainId}:${assetAddress}:${tokenId}`);
      apiPut(`/user/${user.address}`, { data: body }).catch((err) => console.error(err));
    }
  }, [user?.address, assetAddress, chainId, tokenId, query.referrer]);
};
