import { BaseCollection, StakeLevel } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useUserFavoriteCollection } from 'src/hooks/api/useFavoriteCollection';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useSWRConfig } from 'swr';
import { Chip, Spinner, toastError } from '../common';

export const FavoriteButton: React.FC<{ collection: BaseCollection | null | undefined }> = ({ collection }) => {
  const { user, chainId, checkSignedIn } = useOnboardContext();
  const { mutate } = useSWRConfig();
  const { result: userQuota } = useUserCurationQuota();
  const { result: currentFavoriteCollection } = useUserFavoriteCollection();
  const [hasFavorited, setHasFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const invalidStakeLevel = (userQuota?.stakeLevel || 0) < StakeLevel.Bronze;

  useEffect(() => {
    if (currentFavoriteCollection?.collectionAddress === collection?.address) {
      setHasFavorited(true);
    }
  }, [currentFavoriteCollection?.collectionAddress]);

  const onClickFavorite = async () => {
    setIsFavoriting(true);

    if (!checkSignedIn()) {
      return;
    }

    const { error } = await apiPost(
      `/collections/${collection?.chainId}:${collection?.address}/favorites/${chainId}:${user?.address}`
    );

    if (error) {
      toastError(error?.errorResponse?.message);
      setIsFavoriting(false);
      return;
    }

    setHasFavorited(true);
    setIsFavoriting(false);
    mutate('/collections/phase/favorites');
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
      left={isFavoriting ? <Spinner /> : hasFavorited && !invalidStakeLevel ? <FaCheck /> : <FaStar />}
      content={<>Favorite</>}
      onClick={onClickFavorite}
      disabled={invalidStakeLevel || hasFavorited || isFavoriting}
      title={formatTitle()}
    />
  );
};
