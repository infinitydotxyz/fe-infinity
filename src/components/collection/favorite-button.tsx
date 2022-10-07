import { BaseCollection, StakeLevel } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useUserFavorite } from 'src/hooks/api/useUserFavorite';
import { useMatchMutate } from 'src/hooks/useMatchMutate';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { Chip, Spinner, toastError, toastWarning } from '../common';

export const FavoriteButton: React.FC<{ collection: BaseCollection | null | undefined }> = ({ collection }) => {
  const { user, chainId, checkSignedIn } = useOnboardContext();
  const matchMutate = useMatchMutate();
  const { result: userQuota } = useUserCurationQuota();
  const { result: currentFavoriteCollection } = useUserFavorite();
  const [hasFavorited, setHasFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const invalidStakeLevel = (userQuota?.stakeLevel || 0) < StakeLevel.Bronze;

  useEffect(() => {
    if (currentFavoriteCollection?.collectionAddress === collection?.address) {
      setHasFavorited(true);
    }
  }, [currentFavoriteCollection?.collectionAddress]);

  const onClickFavorite = async () => {
    if (!checkSignedIn()) {
      return;
    }

    if (invalidStakeLevel) {
      toastWarning(
        <span>
          You must have a stake level of bronze or higher to access this feature. Keep staking your tokens!{' '}
          <a href="https://docs.infinity.xyz/gm/" target="_blank" className="underline" rel="noopener noreferrer">
            Docs
          </a>
        </span>
      );
      return;
    }

    setIsFavoriting(true);

    const { error } = await apiPost(
      `/favorites/${collection?.chainId}:${collection?.address}/${chainId}:${user?.address}`
    );

    if (error) {
      toastError(error?.errorResponse?.message);
      setIsFavoriting(false);
      return;
    }

    setHasFavorited(true);
    setIsFavoriting(false);
    matchMutate(/^\/collections\/phase\/favorites.*/);
  };

  return (
    <Chip
      left={isFavoriting ? <Spinner /> : hasFavorited ? <FaCheck /> : <FaStar />}
      content={<>Favorite</>}
      onClick={onClickFavorite}
      disabled={hasFavorited || isFavoriting}
      title={
        hasFavorited
          ? 'You already favorited this collection'
          : 'Click to favorite this collection (your vote is valid as long as the current phase lasts)'
      }
    />
  );
};
