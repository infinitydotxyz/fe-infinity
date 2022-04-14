import { BaseCollection, CollectionStats } from '@infinityxyz/lib/types/core';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaCaretDown, FaCaretUp, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { apiPost } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { Chip } from '../common';
import { Toaster, toastError, toastSuccess } from '../common/toaster';
interface Props {
  collection: BaseCollection | null;
  weeklyStatsData: CollectionStats[];
}

export function StatsChips({ collection, weeklyStatsData }: Props) {
  const { user, checkSignedIn } = useAppContext();

  const onClickFollow = async () => {
    if (!checkSignedIn()) {
      return;
    }
    const { error } = await apiPost(`/user/1:${user?.address}/followingCollections`, {
      data: {
        collectionChainId: collection?.chainId,
        collectionAddress: collection?.address
      }
    });
    if (error) {
      toastError(error?.errorResponse?.message);
    } else {
      toastSuccess('Followed ' + collection?.metadata?.name);
    }
  };

  const lastWeeklyStats = weeklyStatsData[weeklyStatsData.length - 1];
  const twitterChangePct = `${Math.abs(lastWeeklyStats?.twitterFollowersPercentChange ?? 0)}`.slice(0, 4);
  const discordChangePct = `${Math.abs(lastWeeklyStats?.discordFollowersPercentChange ?? 0)}`.slice(0, 4);

  return (
    <div className="flex flex-row space-x-1">
      <Chip
        content={
          <span className="flex items-center">
            <AiOutlinePlus className="mr-1" /> Follow
          </span>
        }
        onClick={onClickFollow}
      />
      <Chip content="Edit" />

      {collection?.metadata.links.twitter && (
        <Chip
          left={<FaTwitter />}
          onClick={() => window.open(collection?.metadata.links.twitter)}
          content={
            <span className="flex items-center">
              {lastWeeklyStats?.twitterFollowers?.toLocaleString() ?? '—'}
              {lastWeeklyStats?.twitterFollowersPercentChange && twitterChangePct !== '0.00' ? (
                <>
                  {(lastWeeklyStats?.twitterFollowersPercentChange ?? 0) < 0 ? (
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

      {collection?.metadata.links.discord && (
        <Chip
          left={<FaDiscord />}
          onClick={() => window.open(collection?.metadata.links.discord)}
          content={
            <span className="flex items-center">
              {lastWeeklyStats?.discordFollowers?.toLocaleString() ?? '—'}
              {lastWeeklyStats?.discordFollowersPercentChange && discordChangePct !== '0.00' ? (
                <>
                  {(lastWeeklyStats?.discordFollowersPercentChange ?? 0) < 0 ? (
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

      {collection?.metadata.links.instagram && (
        <Chip
          content={<FaInstagram className="text-lg" />}
          onClick={() => window.open(collection?.metadata.links.instagram)}
          className="p-0"
        />
      )}

      <Toaster />
    </div>
  );
}
