import { BaseCollection, StakeLevel } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useUserFavorite } from 'src/hooks/api/useUserFavorite';
import { useMatchMutate } from 'src/hooks/useMatchMutate';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { AButtonContents, AOutlineButton } from '../astra';
import { Modal, Spinner, toastError, toastWarning } from '../common';

export const FavoriteButton: React.FC<{ collection: BaseCollection | null | undefined }> = ({ collection }) => {
  const { user, chainId, checkSignedIn } = useOnboardContext();
  const matchMutate = useMatchMutate();
  const { result: userQuota } = useUserCurationQuota();
  const { result: currentFavoriteCollection } = useUserFavorite();
  const [hasFavorited, setHasFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const invalidStakeLevel = (userQuota?.stakeLevel || 0) < StakeLevel.Bronze;

  useEffect(() => {
    if (currentFavoriteCollection?.collectionAddress === collection?.address) {
      setHasFavorited(true);
    }
  }, [currentFavoriteCollection?.collectionAddress]);

  const onClickFavorite = () => {
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

    setShowConfirmModal(true);
  };

  const onConfirm = async () => {
    setShowConfirmModal(false);
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
    <>
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onOKButton={onConfirm}
        showCloseIcon={true}
        wide={false}
      >
        <div>
          <div className="text-3xl font-medium">Favorite collection</div>

          <div className="mt-5">
            <p>
              Are you sure you want to favorite <strong>{collection?.metadata.name}</strong>?
            </p>
            <br />
            <p>
              <strong>You cannot change your choice until the end of the phase!</strong>
            </p>
          </div>
        </div>
      </Modal>
      <AOutlineButton
        onClick={onClickFavorite}
        disabled={hasFavorited || isFavoriting}
        tooltip={
          hasFavorited
            ? 'You already favorited this collection'
            : 'Click to favorite this collection (your vote is valid as long as the current phase lasts)'
        }
      >
        <AButtonContents label="Favorite" left={isFavoriting ? <Spinner /> : hasFavorited ? <FaCheck /> : <FaStar />} />
      </AOutlineButton>
    </>
  );
};
