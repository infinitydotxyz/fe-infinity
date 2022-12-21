import { BaseCollection, ChainId, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaCaretDown, FaCaretUp, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { apiDelete, apiGet, apiPost, nFormatter } from 'src/utils';
import { Spinner, toastError } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { indexCollection } from 'src/utils/orderbookUtils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { TipModal } from './tip-modal';
import { FavoriteButton } from './favorite-button';
import { AButton, AButtonContents, AOutlineButton, ARoundOutlineButton } from '../astra';

interface Props {
  collection?: BaseCollection | null;
  currentStatsData?: CollectionStats;
}

export const StatsChips = ({ collection, currentStatsData }: Props) => {
  const { user, chainId: userChainId, checkSignedIn } = useOnboardContext();

  const [isFollowing, setIsFollowing] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const { push: pushRoute } = useRouter();
  // TODO(sleeyax): we should probably refactor both 'edit' and 'follow' buttons; they shouldn't be part of this 'social stats' component.
  const router = useRouter();
  const { addCartItem, setOrderDrawerOpen } = useOrderContext();

  const showFollow = false; // todo: put this back for Social features.

  useEffect(() => {
    verifyOwnership();
  }, [user]);

  const onClickFollow = async () => {
    if (!checkSignedIn()) {
      return;
    }
    setFollowingLoading(true);
    if (isFollowing) {
      const { error } = await apiDelete(`/user/${userChainId}:${user?.address}/followingCollections`, {
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
      }
    } else {
      const { error } = await apiPost(`/user/${userChainId}:${user?.address}/followingCollections`, {
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
      }
    }
    setFollowingLoading(false);
  };

  const onClickEdit = () => {
    if (!checkSignedIn()) {
      return;
    }

    pushRoute(`/collection/${collection?.slug}/edit`);
  };

  const onClickTip = () => {
    if (!checkSignedIn()) {
      return;
    }

    setShowTipModal(true);
  };

  const verifyOwnership = async () => {
    if (user) {
      const { error, result } = await apiGet(
        `/user/${userChainId}:${user?.address}/collections/${router.query.name}/permissions`
      );

      if (!error) {
        setEditVisible(result.canModify);
      }
    } else {
      setEditVisible(false);
    }
  };

  const twitterChangePct = `${Math.abs(currentStatsData?.twitterFollowersPercentChange ?? 0)}`.slice(0, 5);
  const discordChangePct = `${Math.abs(currentStatsData?.discordFollowersPercentChange ?? 0)}`.slice(0, 5);

  return (
    <div>
      <div className="flex flex-row space-x-2 items-center">
        {collection?.metadata?.tipAddress && (
          <TipModal
            isOpen={showTipModal}
            onClose={() => setShowTipModal(false)}
            address={collection.metadata.tipAddress}
          />
        )}

        {showFollow && (
          <AOutlineButton onClick={onClickFollow}>
            {followingLoading ? (
              <span className="flex justify-center">
                <Spinner />
              </span>
            ) : (
              <span className="flex items-center">
                {isFollowing ? (
                  <>Following</>
                ) : (
                  <>
                    <AiOutlinePlus className="mr-1" /> Follow
                  </>
                )}
              </span>
            )}
          </AOutlineButton>
        )}

        {editVisible && <AOutlineButton onClick={onClickEdit}>Edit</AOutlineButton>}

        {collection?.metadata?.links?.twitter && (
          <AOutlineButton onClick={() => window.open(collection?.metadata?.links?.twitter)}>
            <AButtonContents
              left={<FaTwitter className="text-xl" />}
              right={
                <span className="flex items-center">
                  {nFormatter(currentStatsData?.twitterFollowers) ?? ''}
                  {currentStatsData?.twitterFollowersPercentChange && parseFloat(twitterChangePct) ? (
                    <>
                      {(currentStatsData?.twitterFollowersPercentChange ?? 0) < 0 ? (
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
          </AOutlineButton>
        )}

        {collection?.metadata?.links?.discord && (
          <AOutlineButton onClick={() => window.open(collection?.metadata?.links?.discord)}>
            <AButtonContents
              left={<FaDiscord />}
              right={
                <span className="flex items-center">
                  {nFormatter(currentStatsData?.discordFollowers) ?? ''}
                  {currentStatsData?.discordFollowersPercentChange && parseFloat(discordChangePct) ? (
                    <>
                      {(currentStatsData?.discordFollowersPercentChange ?? 0) < 0 ? (
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
          </AOutlineButton>
        )}

        {collection?.metadata?.links?.instagram && (
          <ARoundOutlineButton onClick={() => window.open(collection?.metadata?.links?.instagram)}>
            <FaInstagram className="text-xl" />
          </ARoundOutlineButton>
        )}
      </div>
      <div className="flex flex-row space-x-2 mt-6 items-center">
        <AOutlineButton
          onClick={() => indexCollection(true, userChainId, collection?.address ?? '', collection?.slug ?? '')}
        >
          Reindex
        </AOutlineButton>

        <AOutlineButton
          onClick={onClickTip}
          disabled={!collection?.metadata.tipAddress}
          tooltip={
            !collection?.metadata.tipAddress
              ? "The collection owner hasn't setup tipping yet"
              : 'Tip ETH to provide extra support towards this project'
          }
        >
          Tip
        </AOutlineButton>

        <FavoriteButton collection={collection} />

        <AButton
          primary={true}
          onClick={() => {
            // assumes parent view has a drawer
            addCartItem({
              chainId: collection?.chainId as ChainId,
              collectionName: collection?.metadata?.name ?? '',
              collectionAddress: collection?.address ?? '',
              collectionImage: collection?.metadata?.profileImage ?? '',
              collectionSlug: collection?.slug ?? '',
              isSellOrder: false
            });
            setOrderDrawerOpen(true);
          }}
        >
          Collection Offer
        </AButton>
      </div>
    </div>
  );
};
