import { BaseCollection, StakeLevel } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useCurrentFavoriteCollection } from 'src/hooks/api/useFavoriteCollection';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { Chip, toastError } from '../common';

export const FavoriteButton: React.FC<{ collection: BaseCollection | null | undefined }> = ({ collection }) => {
  const { user, chainId, checkSignedIn } = useOnboardContext();
  const { result: userQuota } = useUserCurationQuota();
  const { result: currentFavoriteCollection } = useCurrentFavoriteCollection(user?.address);
  const [hasFavorited, setHasFavorited] = useState(false);

  const invalidStakeLevel = (userQuota?.stakeLevel || 0) < StakeLevel.Bronze;

  useEffect(() => {
    if (currentFavoriteCollection?.collection === collection?.address) {
      setHasFavorited(true);
    }
  }, [currentFavoriteCollection?.collection]);

  const onClickFavorite = async () => {
    if (!checkSignedIn()) {
      return;
    }

    const { error } = await apiPost(
      `/collections/${collection?.chainId}:${collection?.address}/favorites/${chainId}:${user?.address}`
    );

    if (error) {
      toastError(error?.errorResponse?.message);
      return;
    }

    setHasFavorited(true);
  };

  const formatTitle = () => {
    if (invalidStakeLevel) {
      return 'You must be level Bronze or higher to access this feature';
    } else if (hasFavorited) {
      return 'You already favorited this collection';
    } else {
      return 'Click to favorite this collection (your vote is valid as long as the current phase lasts)';
    }
  };

  return (
    <Chip
      left={hasFavorited ? <FaCheck /> : <FaStar />}
      content={<>Favorite</>}
      onClick={onClickFavorite}
      disabled={invalidStakeLevel || hasFavorited}
      title={formatTitle()}
    />
  );
};
