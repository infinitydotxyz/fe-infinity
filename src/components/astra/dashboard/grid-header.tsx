import { BaseCollection, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { NextRouter, useRouter } from 'next/router';
import { FaCaretDown, FaCaretUp, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { BlueCheck, ClipboardButton, EZImage, NextLink, ReadMoreText, Spacer } from 'src/components/common';
import { nFormatter } from 'src/utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import {
  cardColor,
  inputBorderColor,
  primaryBorderColor,
  primaryTextColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export interface GridHeaderProps {
  expanded: boolean;
  avatarUrl: string;
  title: string;
  slug: string;
  description?: string;
  hasBlueCheck?: boolean;
  children?: React.ReactNode;
  collectionAddress?: string;
  collection?: BaseCollection;
  collectionStats?: CollectionStats;
}

export const GridHeader = ({
  expanded,
  avatarUrl,
  title,
  description,
  collectionAddress,
  hasBlueCheck,
  children,
  collection,
  collectionStats
}: GridHeaderProps) => {
  const twitterChangePct = `${Math.abs(collectionStats?.twitterFollowersPercentChange ?? 0)}`.slice(0, 5);
  const discordChangePct = `${Math.abs(collectionStats?.discordFollowersPercentChange ?? 0)}`.slice(0, 5);

  return (
    <div className={twMerge(inputBorderColor, cardColor, textColor, 'border-b px-8')}>
      {expanded && (
        <>
          <div className="flex flex-col space-y-3">
            <div className="flex w-full items-center">
              <EZImage src={avatarUrl} className="mr-4 h-14 w-14 rounded-xl" />
              <div className="flex w-full items-center space-x-2">
                <div className="font-bold text-xl">{title}</div>
                {hasBlueCheck ? <BlueCheck /> : null}
                <ClipboardButton
                  textToCopy={collectionAddress ?? ''}
                  className={twMerge('cursor-pointer', smallIconButtonStyle)}
                />
                {collection?.metadata?.links?.twitter && (
                  <Chip
                    left={<FaTwitter />}
                    onClick={() => window.open(collection?.metadata?.links?.twitter)}
                    content={
                      <span className="flex items-center">
                        {nFormatter(collectionStats?.twitterFollowers) ?? ''}
                        {collectionStats?.twitterFollowersPercentChange && parseFloat(twitterChangePct) ? (
                          <>
                            {(collectionStats?.twitterFollowersPercentChange ?? 0) < 0 ? (
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
                        {nFormatter(collectionStats?.discordFollowers) ?? ''}
                        {collectionStats?.discordFollowersPercentChange && parseFloat(discordChangePct) ? (
                          <>
                            {(collectionStats?.discordFollowersPercentChange ?? 0) < 0 ? (
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
                    content={<FaInstagram className="text-xl" />}
                    onClick={() => window.open(collection?.metadata?.links?.instagram)}
                    iconOnly={true}
                  />
                )}
              </div>
            </div>

            {description && (
              <div className="max-w-5xl text-sm">
                <ReadMoreText text={description} min={30} ideal={60} max={100} />
              </div>
            )}
          </div>
        </>
      )}

      <HeaderTabBar children={children} />
    </div>
  );
};

interface Props2 {
  children?: React.ReactNode;
}

const HeaderTabBar = ({ children }: Props2) => {
  const { collection } = useDashboardContext();
  const router = useRouter();

  const tabItems = RouteUtils.tabItems(router);

  return (
    <div className="flex mt-4 text-sm">
      <div className="flex space-x-8">
        {tabItems.map((e) => {
          return (
            <div key={e.path} className={twMerge('pb-2', e.selected ? `border-b-2 ${primaryBorderColor}` : '')}>
              <NextLink href={`/collection/${collection?.slug}/${e.path}`}>
                <div className={e.selected ? primaryTextColor : ''}>{e.name}</div>
              </NextLink>
            </div>
          );
        })}
      </div>
      {children && (
        <>
          <Spacer />
          {children}
        </>
      )}
    </div>
  );
};
class RouteUtils {
  static tabItems = (router: NextRouter) => {
    const path = router.pathname;

    return [
      {
        id: 'items',
        path: 'items',
        selected: path.endsWith('items'),
        name: 'Items'
      },
      {
        id: 'orders',
        path: 'orders',
        selected: path.endsWith('orders'),
        name: 'Orders'
      },
      {
        id: 'activity',
        path: 'activity',
        selected: path.endsWith('activity'),
        name: 'Activity'
      },
      {
        id: 'analytics',
        path: 'analytics',
        selected: path.endsWith('analytics'),
        name: 'Analytics'
      }
    ];
  };
}
