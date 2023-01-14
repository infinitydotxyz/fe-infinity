import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { FaCaretDown, FaCaretUp, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { BlueCheck, ClipboardButton, EthSymbol, EZImage, ReadMoreText, Spacer } from 'src/components/common';
import etherscanLogo from 'src/images/etherscan-logo.png';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import {
  borderColor,
  brandBorderColor,
  hoverColor,
  hoverColorBrandText,
  secondaryBgColor,
  secondaryTextColor,
  smallIconButtonStyle
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra/astra-button';

export interface CollectionPageHeaderProps {
  expanded: boolean;
  avatarUrl: string;
  title: string;
  slug: string;
  description?: string;
  hasBlueCheck?: boolean;
  children?: React.ReactNode;
  collection?: BaseCollection;
  totalVol: string | number | null | undefined;
  floorPrice: string | number | null | undefined;
  numOwners: string | number | null | undefined;
  numNfts: string | number | null | undefined;
  twitterFollowersPercentChange: string | number | null | undefined;
  twitterFollowers: string | number | null | undefined;
  discordFollowersPercentChange: string | number | null | undefined;
  discordFollowers: string | number | null | undefined;
  tabs: string[];
  onTabChange: (tab: string) => void;
}

export const CollectionPageHeader = ({
  expanded,
  avatarUrl,
  title,
  description,
  hasBlueCheck,
  collection,
  totalVol,
  floorPrice,
  numOwners,
  numNfts,
  twitterFollowersPercentChange,
  twitterFollowers,
  discordFollowersPercentChange,
  discordFollowers,
  tabs,
  onTabChange
}: CollectionPageHeaderProps) => {
  const { chainId } = useOnboardContext();

  const twitterChangePct = `${Math.abs(Number(twitterFollowersPercentChange ?? 0))}`.slice(0, 5);
  const discordChangePct = `${Math.abs(Number(discordFollowersPercentChange ?? 0))}`.slice(0, 5);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className={twMerge(borderColor, secondaryBgColor, 'border-b px-8')}>
      {expanded && (
        <div className="flex flex-col space-y-3">
          <div className="flex w-full items-center mt-2">
            <EZImage
              src={avatarUrl}
              className="mr-4 h-14 w-14 rounded-lg cursor-pointer hover:scale-90 duration-100"
              onClick={() => window.open(collection?.metadata?.links?.external)}
            />
            <div className="flex w-full items-center space-x-2">
              <div className="font-bold font-heading text-xl">{title}</div>
              {hasBlueCheck ? <BlueCheck /> : null}

              <div className={twMerge('flex p-2 text-sm space-x-2 items-center')}>
                <div>{ellipsisAddress(collection?.address).toLowerCase()}</div>
                <div className={twMerge('cursor-pointer p-2 rounded-lg', hoverColor)}>
                  <ClipboardButton textToCopy={collection?.address ?? ''} className={twMerge(smallIconButtonStyle)} />
                </div>
              </div>

              <Spacer />

              {collection?.metadata?.links?.external && (
                <>
                  <AOutlineButton
                    className={hoverColor}
                    onClick={() => window.open(collection.metadata?.links?.external)}
                  >
                    <span className="flex items-center">
                      <EZImage src={avatarUrl} className="mr-2 h-5 w-5 rounded-full" />
                      <HiOutlineExternalLink className="text-md" />
                    </span>
                  </AOutlineButton>
                </>
              )}

              <AOutlineButton
                className={hoverColor}
                onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + collection?.address)}
              >
                <span className="flex items-center">
                  <EZImage src={etherscanLogo.src} className="mr-2 h-5 w-5 rounded-lg" />
                  <HiOutlineExternalLink className="text-md" />
                </span>
              </AOutlineButton>

              {collection?.metadata?.links?.twitter && (
                <AOutlineButton
                  className={hoverColor}
                  onClick={() => window.open(collection?.metadata?.links?.twitter)}
                >
                  <span className="flex items-center text-sm">
                    <div className="pr-2">
                      <FaTwitter className="text-brand-twitter" />
                    </div>
                    {twitterFollowers ?? ''}
                    {twitterFollowersPercentChange && parseFloat(twitterChangePct) ? (
                      <>
                        {(twitterFollowersPercentChange ?? 0) < 0 ? (
                          <span className="ml-2 py-1 px-2 rounded-lg bg-red-500 text-dark-body dark:bg-red-500 dark:text-dark-body text-xs flex items-center">
                            <FaCaretDown className="mr-1" /> {twitterChangePct}%
                          </span>
                        ) : (
                          <span className="ml-2 py-1 px-2 rounded-lg bg-green-500 text-dark-body dark:bg-green-500 dark:text-dark-body text-xs flex items-center">
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
                  <span className="flex items-center text-sm">
                    <div className="pr-2">
                      <FaDiscord className="text-brand-discord" />
                    </div>
                    {discordFollowers ?? ''}
                    {discordFollowersPercentChange && parseFloat(discordChangePct) ? (
                      <>
                        {(discordFollowersPercentChange ?? 0) < 0 ? (
                          <span className="ml-2 py-1 px-2 rounded-lg bg-red-500 text-dark-body dark:bg-red-500 dark:text-dark-body text-xs flex items-center">
                            <FaCaretDown className="mr-1" /> {discordChangePct}%
                          </span>
                        ) : (
                          <span className="ml-2 py-1 px-2 rounded-lg bg-green-500 text-dark-body dark:bg-green-500 dark:text-dark-body text-xs flex items-center">
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
            </div>
          </div>

          {description && (
            <div className="max-w-5xl text-sm">
              <ReadMoreText text={description} min={30} ideal={60} max={100} />
            </div>
          )}
        </div>
      )}

      <div className="flex mt-4 text-sm">
        <div className="flex space-x-5">
          {tabs.map((e) => {
            return (
              <div key={e} className={twMerge('pb-2 px-3', selectedTab === e ? `border-b-2 ${brandBorderColor}` : '')}>
                <div
                  className={twMerge(
                    selectedTab === e ? '' : secondaryTextColor,
                    hoverColorBrandText,
                    'font-medium cursor-pointer'
                  )}
                  onClick={() => {
                    setSelectedTab(e);
                    onTabChange(e);
                  }}
                >
                  {e}
                </div>
              </div>
            );
          })}
        </div>

        <Spacer />

        <div className="flex text-sm divide-x divide-light-border dark:divide-dark-border items-center">
          <div className="flex pr-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Floor </span>
            <span className="">
              {floorPrice ?? '-'} {EthSymbol}
            </span>
          </div>
          <div className="flex px-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Total Vol </span>
            <span className="">
              {totalVol ?? '-'} {EthSymbol}
            </span>
          </div>
          <div className="flex px-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Owners </span>
            <span className="">{numOwners ?? '-'}</span>
          </div>
          <div className="flex pl-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Items </span>
            <span className="">{numNfts ?? '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
