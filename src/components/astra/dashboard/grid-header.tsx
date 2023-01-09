import { BaseCollection, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { NextRouter, useRouter } from 'next/router';
import { FaCaretDown, FaCaretUp, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { BlueCheck, ClipboardButton, EZImage, NextLink, ReadMoreText, Spacer } from 'src/components/common';
import etherscanLogo from 'src/images/etherscan-logo.png';
import { ellipsisAddress, getChainScannerBase, nFormatter } from 'src/utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import {
  cardColor,
  hoverColor,
  inputBorderColor,
  primaryBorderColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra-button';
export interface GridHeaderProps {
  expanded: boolean;
  avatarUrl: string;
  title: string;
  slug: string;
  description?: string;
  hasBlueCheck?: boolean;
  children?: React.ReactNode;
  collection?: BaseCollection;
  collectionStats?: CollectionStats;
}

export const GridHeader = ({
  expanded,
  avatarUrl,
  title,
  description,
  hasBlueCheck,
  children,
  collection,
  collectionStats
}: GridHeaderProps) => {
  const twitterChangePct = `${Math.abs(collectionStats?.twitterFollowersPercentChange ?? 0)}`.slice(0, 5);
  const discordChangePct = `${Math.abs(collectionStats?.discordFollowersPercentChange ?? 0)}`.slice(0, 5);
  const { chainId } = useOnboardContext();

  return (
    <div className={twMerge(inputBorderColor, cardColor, textColor, 'border-b px-8')}>
      {expanded && (
        <>
          <div className="flex flex-col space-y-3">
            <div className="flex w-full items-center">
              <EZImage
                src={avatarUrl}
                className="mr-4 h-14 w-14 rounded-xl cursor-pointer hover:scale-90 duration-100"
                onClick={() => window.open(collection?.metadata?.links?.external)}
              />
              <div className="flex w-full items-center space-x-2">
                <div className="font-bold font-heading text-xl">{title}</div>
                {hasBlueCheck ? <BlueCheck /> : null}

                <div className={twMerge('flex p-2 text-sm space-x-2 items-center')}>
                  <div>{ellipsisAddress(collection?.address).toLowerCase()}</div>
                  <div className={twMerge('cursor-pointer p-2 rounded-xl', hoverColor)}>
                    <ClipboardButton textToCopy={collection?.address ?? ''} className={twMerge(smallIconButtonStyle)} />
                  </div>
                </div>
                <Spacer />
                <AOutlineButton
                  className={hoverColor}
                  onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + collection?.address)}
                >
                  <span className="flex items-center">
                    <EZImage src={etherscanLogo.src} className="mr-2 h-5 w-5 rounded-xl" />
                    <HiOutlineExternalLink className="text-md" />
                  </span>
                </AOutlineButton>

                {collection?.metadata?.links?.twitter && (
                  <AOutlineButton
                    className={hoverColor}
                    onClick={() => window.open(collection?.metadata?.links?.twitter)}
                  >
                    <span className="flex items-center">
                      <div className="pr-2">
                        <FaTwitter className="text-brand-twitter" />
                      </div>
                      {nFormatter(collectionStats?.twitterFollowers) ?? ''}
                      {collectionStats?.twitterFollowersPercentChange && parseFloat(twitterChangePct) ? (
                        <>
                          {(collectionStats?.twitterFollowersPercentChange ?? 0) < 0 ? (
                            <span className="ml-2 py-1 px-2 rounded-xl bg-red-500 text-dark-body dark:bg-red-500 dark:text-dark-body text-xs flex items-center">
                              <FaCaretDown className="mr-1" /> {twitterChangePct}%
                            </span>
                          ) : (
                            <span className="ml-2 py-1 px-2 rounded-xl bg-green-500 text-dark-body dark:bg-green-500 dark:text-dark-body text-xs flex items-center">
                              <FaCaretUp className="mr-1" /> {twitterChangePct}%
                            </span>
                          )}
                        </>
                      ) : (
                        ''
                      )}
                    </span>
                  </AOutlineButton>
                )}

                {collection?.metadata?.links?.discord && (
                  <AOutlineButton
                    className={hoverColor}
                    onClick={() => window.open(collection?.metadata?.links?.discord)}
                  >
                    <span className="flex items-center">
                      <div className="pr-2">
                        <FaDiscord className="text-brand-discord" />
                      </div>
                      {nFormatter(collectionStats?.discordFollowers) ?? ''}
                      {collectionStats?.discordFollowersPercentChange && parseFloat(discordChangePct) ? (
                        <>
                          {(collectionStats?.discordFollowersPercentChange ?? 0) < 0 ? (
                            <span className="ml-2 py-1 px-2 rounded-xl bg-red-500 text-dark-body dark:bg-red-500 dark:text-dark-body text-xs flex items-center">
                              <FaCaretDown className="mr-1" /> {discordChangePct}%
                            </span>
                          ) : (
                            <span className="ml-2 py-1 px-2 rounded-xl bg-green-500 text-dark-body dark:bg-green-500 dark:text-dark-body text-xs flex items-center">
                              <FaCaretUp className="mr-1" /> {discordChangePct}%
                            </span>
                          )}
                        </>
                      ) : (
                        ''
                      )}
                    </span>
                  </AOutlineButton>
                )}

                {collection?.metadata?.links?.instagram && (
                  <AOutlineButton
                    className={hoverColor}
                    onClick={() => window.open(collection?.metadata?.links?.instagram)}
                  >
                    <FaInstagram className="text-xl" />
                  </AOutlineButton>
                )}

                {collection?.metadata?.links?.external && (
                  <>
                    <AOutlineButton
                      className={hoverColor}
                      onClick={() => window.open(collection.metadata?.links?.external)}
                    >
                      <span className="flex items-center">
                        <EZImage src={avatarUrl} className="mr-2 h-5 w-5 rounded-xl" />
                        <HiOutlineExternalLink className="text-md" />
                      </span>
                    </AOutlineButton>
                  </>
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
                <div className={e.selected ? textColor : ''}>{e.name}</div>
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
