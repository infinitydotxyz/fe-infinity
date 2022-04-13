import { BaseCollection, CollectionStats } from '@infinityxyz/lib/types/core';
import { FaCaretDown, FaCaretUp, FaDiscord, FaTwitter } from 'react-icons/fa';
import { Chip } from '../common';

interface Props {
  collection: BaseCollection | null;
  weeklyStatsData: CollectionStats[];
}

export function StatsChips({ collection, weeklyStatsData }: Props) {
  const lastWeeklyStats = weeklyStatsData[weeklyStatsData.length - 1];
  const twitterChangePct = `${Math.abs(lastWeeklyStats?.twitterFollowersPercentChange ?? 0)}`.slice(0, 4);
  const discordChangePct = `${Math.abs(lastWeeklyStats?.discordFollowersPercentChange ?? 0)}`.slice(0, 4);
  return (
    <div className="flex flex-row space-x-1">
      <Chip content="+ Follow" />
      <Chip content="Edit" />
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
    </div>
  );
}
