import { BaseCollection, CollectionStats } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaCaretDown, FaCaretUp, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { apiDelete, apiGet, apiPost } from 'src/utils';
import { FollowingCollection, useAppContext } from 'src/utils/context/AppContext';
import { Button, Chip, Toaster, toastError } from 'src/components/common';
import { VerificationModal } from './verification_modal';
import { useOrderContext } from 'src/utils/context/OrderContext';
interface Props {
  collection: BaseCollection;
  weeklyStatsData: CollectionStats[];
}

export const StatsChips = ({ collection, weeklyStatsData }: Props) => {
  const { user, checkSignedIn, userFollowingCollections, fetchFollowingCollections, chainId } = useAppContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const { push: pushRoute } = useRouter();
  // TODO(sleeyax): we should probably refactor both 'edit' and 'follow' buttons; they shouldn't be part of this 'social stats' component.
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { addCartItem } = useOrderContext();

  useEffect(() => {
    const _isFollowing = !!userFollowingCollections.find(
      (item: FollowingCollection) => item.collectionAddress && item.collectionAddress === collection?.address
    );
    setIsFollowing(_isFollowing);
  }, [userFollowingCollections]);

  const onClickFollow = async () => {
    if (!checkSignedIn()) {
      return;
    }
    if (isFollowing) {
      const { error } = await apiDelete(`/user/1:${user?.address}/followingCollections`, {
        data: {
          collectionChainId: collection?.chainId,
          collectionAddress: collection?.address
        }
      });
      if (error) {
        toastError(error?.errorResponse?.message);
      } else {
        // toastSuccess('Unfollowed ' + collection?.metadata?.name);
        setIsFollowing(false);
        fetchFollowingCollections();
      }
    } else {
      const { error } = await apiPost(`/user/1:${user?.address}/followingCollections`, {
        data: {
          collectionChainId: collection?.chainId,
          collectionAddress: collection?.address
        }
      });
      if (error) {
        toastError(error?.errorResponse?.message);
      } else {
        // toastSuccess('Followed ' + collection?.metadata?.name);
        setIsFollowing(true);
        fetchFollowingCollections();
      }
    }
  };

  const onClickEdit = () => {
    if (!checkSignedIn()) {
      return;
    }
    setModalOpen(true);
  };

  const verifyOwnership = async () => {
    const { error, result } = await apiGet(
      `/user/${chainId}:${user?.address}/collections/${router.query.name}/permissions`
    );

    if (error) {
      toastError(error?.errorResponse?.message);
      return;
    }

    setModalOpen(false);

    if (result.canModify) {
      pushRoute(`/collection/${collection?.slug}/edit`);
    } else {
      toastError('Unauthorized. Please try a different wallet.');
    }
  };

  const firstWeeklyStats = weeklyStatsData[0];
  const twitterChangePct = `${Math.abs(firstWeeklyStats?.twitterFollowersPercentChange ?? 0)}`.slice(0, 4);
  const discordChangePct = `${Math.abs(firstWeeklyStats?.discordFollowersPercentChange ?? 0)}`.slice(0, 4);

  return (
    <div className="flex flex-row space-x-2 items-center">
      <VerificationModal isOpen={modalOpen} onSubmit={verifyOwnership} onClose={() => setModalOpen(false)} />

      <Chip
        content={
          <span className="flex items-center">
            {isFollowing ? (
              <>
                <AiOutlinePlus className="mr-1" /> Following
              </>
            ) : (
              <>
                <AiOutlinePlus className="mr-1" /> Follow
              </>
            )}
          </span>
        }
        onClick={onClickFollow}
        active={isFollowing}
      />
      <Chip content="Edit" onClick={onClickEdit} />

      {collection?.metadata?.links?.twitter && (
        <Chip
          left={<FaTwitter />}
          onClick={() => window.open(collection?.metadata?.links?.twitter)}
          content={
            <span className="flex items-center">
              {firstWeeklyStats?.twitterFollowers?.toLocaleString() ?? '—'}
              {firstWeeklyStats?.twitterFollowersPercentChange && twitterChangePct !== '0.00' ? (
                <>
                  {(firstWeeklyStats?.twitterFollowersPercentChange ?? 0) < 0 ? (
                    <span className="ml-2 py-1 px-2 rounded-xl bg-red-500 text-white text-xs flex items-center">
                      <FaCaretDown className="mr-1" /> {twitterChangePct}%
                    </span>
                  ) : (
                    <span className="ml-2 py-1 px-2 rounded-xl bg-green-500 text-white text-xs flex items-center">
                      <FaCaretUp className="mr-1" /> {twitterChangePct}%
                    </span>
                  )}
                </>
              ) : (
                ''
              )}
            </span>
          }
        />
      )}

      {collection?.metadata?.links?.discord && (
        <Chip
          left={<FaDiscord />}
          onClick={() => window.open(collection?.metadata?.links?.discord)}
          content={
            <span className="flex items-center">
              {firstWeeklyStats?.discordFollowers?.toLocaleString() ?? '—'}
              {firstWeeklyStats?.discordFollowersPercentChange && discordChangePct !== '0.00' ? (
                <>
                  {(firstWeeklyStats?.discordFollowersPercentChange ?? 0) < 0 ? (
                    <span className="ml-2 py-1 px-2 rounded-xl bg-red-500 text-white text-xs flex items-center">
                      <FaCaretDown className="mr-1" /> {discordChangePct}%
                    </span>
                  ) : (
                    <span className="ml-2 py-1 px-2 rounded-xl bg-green-500 text-white text-xs flex items-center">
                      <FaCaretUp className="mr-1" /> {discordChangePct}%
                    </span>
                  )}
                </>
              ) : (
                ''
              )}
            </span>
          }
        />
      )}

      {collection?.metadata?.links?.instagram && (
        <Chip
          content={<FaInstagram className="text-lg" />}
          onClick={() => window.open(collection?.metadata?.links?.instagram)}
          iconOnly={true}
        />
      )}

      {collection?.metadata?.links?.external && (
        <Chip
          content={<HiOutlineExternalLink className="text-lg" />}
          onClick={() => window.open(collection?.metadata?.links?.external)}
          iconOnly={true}
        />
      )}

      <Button
        onClick={() => {
          // assumes parent view has a drawer
          addCartItem({
            collectionName: collection.metadata.name ?? '(no name)',
            collectionAddress: collection.address ?? '(no address)',
            collectionImage: collection.metadata.profileImage ?? '',
            isSellOrder: false
          });
        }}
      >
        Sweep
      </Button>

      <Toaster />
    </div>
  );
};
