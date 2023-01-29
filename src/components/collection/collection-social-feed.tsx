import { BaseCollection, ChainId } from '@infinityxyz/lib-frontend/types/core';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { NftActivity } from '@infinityxyz/lib-frontend/types/dto';
import { useEffect, useState } from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { ExternalLink } from 'src/components/common';
import { apiGet } from 'src/utils';
import {
  divideColor,
  iconButtonStyle,
  secondaryTextColor,
  smallIconButtonStyle,
  standardBorderCard
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useNetwork } from 'wagmi';

interface NftEventRec extends NftActivity {
  collectionData?: BaseCollection;
}

type FeedFilter = {
  types?: EventType[];
  collectionAddress?: string;
  tokenId?: string;
  userAddress?: string;
};

interface Props {
  collectionAddress: string;
  tokenId?: string;
  types: EventType[];
  className?: string;
  collectionName?: string;
  collectionSlug?: string;
  collectionProfileImage?: string;
}

export const CollectionSocialFeed = ({
  collectionAddress,
  collectionName,
  collectionSlug,
  types,
  collectionProfileImage,
  className = ''
}: Props) => {
  const { chain } = useNetwork();
  const chainId = chain?.id ?? ChainId.Mainnet;
  const [filter] = useState<FeedFilter>({ collectionAddress, types });
  const [activities, setActivities] = useState<NftEventRec[]>([]);

  const fetchActivity = async (isRefresh = false, fromCursor = '') => {
    if (!collectionAddress) {
      return;
    }

    try {
      const types = filter.types ?? [];
      if (types?.length > 0) {
        const url = `/collections/${chainId}:${collectionAddress}/activity`;

        const { result, error } = await apiGet(url, {
          query: {
            limit: 10,
            eventType: filter.types,
            socialsOnly: true,
            cursor: fromCursor
          }
        });

        if (!error && result) {
          if (isRefresh) {
            setActivities([...result.data]);
          } else {
            setActivities([...activities, ...result.data]);
          }
        }
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchActivity(true);
  }, [filter, collectionAddress]);

  if (!collectionAddress) {
    return null;
  }

  return (
    <div className={twMerge(className)}>
      {activities.length > 0 && (
        <div>
          <div className="flex items-center text-2xl font-medium font-heading">Probably Nothing</div>

          {activities.length === 0 ? null : null}

          <div
            className={twMerge(
              standardBorderCard,
              divideColor,
              'text-sm divide-y-[1px] max-h-screen overflow-y-scroll scrollbar-hide'
            )}
          >
            {activities.map((activity) => {
              return (
                <div key={activity.id}>
                  <FeedItem
                    collectionName={collectionName}
                    collectionSlug={collectionSlug}
                    collectionProfileImage={collectionProfileImage}
                    activity={activity}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface Props2 {
  activity: NftEventRec;
  collectionName?: string;
  collectionSlug?: string;
  collectionProfileImage?: string;
}

import { toHTML } from 'discord-markdown';
import parse from 'html-react-parser';

const FeedItem = ({ activity }: Props2) => {
  const tweetItem = () => {
    return (
      <ExternalLink href={activity.tokenId}>
        <div className="flex flex-col space-y-4">
          <div className="whitespace-pre-wrap">{activity.to ?? ''}</div>

          <div className="flex items-center space-x-4">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>{format(activity.timestamp)}</div>
            <FaTwitter className={twMerge('text-brand-twitter', smallIconButtonStyle)} />
          </div>
        </div>
      </ExternalLink>
    );
  };

  const discordItem = () => {
    return (
      <div className="flex flex-col space-y-4">
        <div className={twMerge(secondaryTextColor, 'font-medium')}>{activity.miscString}</div>

        <div className="whitespace-pre-wrap">{parse(toHTML(activity.internalUrl ?? '', { embed: true }))}</div>

        <div className="flex item-center space-x-4">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>{format(activity.timestamp)}</div>
          <FaDiscord className={twMerge('text-brand-discord', iconButtonStyle)} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {activity.type === EventType.TwitterTweet && tweetItem()}
      {activity.type === EventType.DiscordAnnouncement && discordItem()}
    </div>
  );
};
